<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SubscriptionPlan;
use App\Models\Subscription;
use App\Models\Payment;
use App\Models\RazorpaySetting;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Razorpay\Api\Api; // <--- This line is mandatory

class PaymentController extends Controller
{
    public function getRazorpaySettings()
    {
        // We always fetch the first record
        return response()->json(RazorpaySetting::first());
    }

    /**
     * Create or Update credentials
     */
    public function updateRazorpaySettings(Request $request)
    {
        $request->validate([
            'live_key_id'     => 'required|string',
            'live_key_secret' => 'required|string',
            'test_key_id'     => 'required|string',
            'test_key_secret' => 'required|string',
            'is_live'         => 'required|boolean',
        ]);

        // Using updateOrCreate ensures we only ever have ID: 1
        $settings = RazorpaySetting::updateOrCreate(
            ['id' => 1], // The search criteria
            [
                'live_key_id'     => $request->live_key_id,
                'live_key_secret' => $request->live_key_secret, // Encrypted via Model Attribute
                'test_key_id'     => $request->test_key_id,
                'test_key_secret' => $request->test_key_secret, // Encrypted via Model Attribute
                'webhook_url'     => $request->webhook_url ?? url('/api/webhooks/razorpay'),
                'webhook_secret'  => $request->webhook_secret,
                'is_live'         => $request->is_live,
            ]
        );

        return response()->json([
            'message' => 'Credentials encrypted and synced.',
            'settings' => $settings
        ]);
    }
    public function payments(Request $request){
        $data = Payment::all();
        return response()->json(['payments'=>$data]);
    }
    // 1. Create Order (Unchanged)
    public function createOrder(Request $request) {
        $request->validate(['plan_id' => 'required|exists:subscription_plans,id']);
        $config = RazorpaySetting::first();
        $plan = SubscriptionPlan::find($request->plan_id);
        $user = Auth::user();
    
        $api = new Api($config->active_key_id, $config->active_key_secret);
        $order = $api->order->create([
            'receipt' => 'plan_sub_' . time(),
            'amount' => $plan->price * 100,
            'currency' => 'INR'
        ]);
    
        // Create a PENDING subscription record to link the Order ID
        Subscription::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'razorpay_order_id' => $order['id'], // Crucial for Webhook
            'start_date' => Carbon::now(),
            'end_date' => Carbon::now()->addDays($plan->duration),
            'status' => 'pending', // Mark as pending
        ]);
    
        return response()->json([
            'id' => $order['id'],
            'amount' => $order['amount'],
            'razorpay_key' => $config->active_key_id
        ]);
    }

    public function verifyPayment(Request $request) {
        $request->validate([
            'plan_id' => 'required|exists:subscription_plans,id',
            'razorpay_order_id' => 'required|string', // Ensure this is passed from React
            'razorpay_payment_id' => 'nullable|string'
        ]);
    
        // Simply call the helper. It handles the stacking logic and prevents duplicates.
        $this->activateSubscriptionByOrderId(
            $request->razorpay_order_id, 
            $request->razorpay_payment_id
        );
    
        // Fetch the updated subscription to return to the frontend
        $subscription = Subscription::where('razorpay_order_id', $request->razorpay_order_id)->first();
    
        return response()->json([
            'message' => 'Success', 
            'subscription' => $subscription
        ]);
    }

    // 3. Get Payment History (For the User)
    public function getPaymentHistory() {
        $payments = Payment::where('user_id', Auth::id())
            ->with('subscription.plan')
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($payments);
    }
    public function getCurrentSubscription()
    {
        $subscription = Subscription::where('user_id', Auth::id())
            ->where('status', 'active')
            ->where('start_date', '<=', now()) // Must have started
            ->where('end_date', '>=', now())   // Must not have expired
            ->with('plan')
            ->first();
    
        if (!$subscription) {
            return response()->json(['status' => 'inactive'], 404);
        }
    
        return response()->json([
            'plan_name'  => $subscription->plan->name,
            'end_date'   => $subscription->end_date->format('d M Y'),
            'is_stacked' => Subscription::where('user_id', Auth::id())
                            ->where('status', 'active')
                            ->where('start_date', '>', now())
                            ->exists(), // Tell UI if there's a plan waiting in queue
        ]);
    }
// app/Http/Controllers/PaymentController.php

public function handleWebhook(Request $request) {
    $config = RazorpaySetting::first();
    $webhookSecret = $config->webhook_secret; 

    // 1. Verify Webhook Signature
    $signature = $request->header('X-Razorpay-Signature');
    $payload = $request->getContent();

    try {
        $api = new Api($config->active_key_id, $config->active_key_secret);
        $api->utility->verifyWebhookSignature($payload, $signature, $webhookSecret);
    } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'message' => 'Invalid signature'], 400);
    }

    // 2. Handle the Event
    $event = $request->event;

    if ($event === 'payment.captured') {
        $paymentData = $request->payload['payment']['entity'];
        $orderId = $paymentData['order_id'];

        // Logic to activate subscription if not already done by the frontend
        $this->activateSubscriptionByOrderId($orderId, $paymentData['id']);
    }

    return response()->json(['status' => 'ok']);
}

/**
 * Helper to ensure the subscription is active even if frontend fails
 */private function activateSubscriptionByOrderId($orderId, $paymentId) {
    return DB::transaction(function () use ($orderId, $paymentId) {
        // 1. Find the pending subscription created during 'createOrder'
        $subscription = Subscription::where('razorpay_order_id', $orderId)
                                    ->where('status', 'pending')
                                    ->with('plan')
                                    ->first();

        if (!$subscription) return;

        // 2. Check if the user ALREADY has an active plan
        $latestActiveSub = Subscription::where('user_id', $subscription->user_id)
                                        ->where('status', 'active')
                                        ->orderBy('end_date', 'desc')
                                        ->first();

        // 3. Determine the Start Date
        // If they have an active plan, start AFTER it ends. 
        // If not, start NOW.
        $newStartDate = ($latestActiveSub && $latestActiveSub->end_date > now()) 
                        ? Carbon::parse($latestActiveSub->end_date) 
                        : Carbon::now();

        // 4. Update the pending subscription to active with the new dates
        $subscription->update([
            'start_date' => $newStartDate,
            'end_date'   => $newStartDate->copy()->addDays($subscription->plan->duration),
            'status'     => 'active'
        ]);

        // 5. Record the Payment (using firstOrCreate to prevent duplicates from Webhook vs Frontend)
        Payment::firstOrCreate(
            ['transaction_id' => $paymentId],
            [
                'user_id' => $subscription->user_id,
                'subscription_id' => $subscription->id,
                'amount' => $subscription->plan->price,
                'payment_method' => 'razorpay',
                'status' => 'success'
            ]
        );
    });
}
}