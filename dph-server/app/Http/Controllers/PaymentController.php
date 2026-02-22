<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SubscriptionPlan;
use App\Models\Subscription;
use App\Models\Payment;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function payments(Request $request){
        $data = Payment::all();
        return response()->json(['payments'=>$data]);
    }
    // 1. Create Order (Unchanged)
    public function createOrder(Request $request) {
        $request->validate(['plan_id' => 'required|exists:subscription_plans,id']);
        $plan = SubscriptionPlan::find($request->plan_id);

        return response()->json([
            'id' => 'order_' . uniqid(),
            'amount' => $plan->price * 100,
            'currency' => 'INR'
        ]);
    }

    // 2. Verify and Record Payment
    public function verifyPayment(Request $request) {
        $request->validate([
            'plan_id' => 'required|exists:subscription_plans,id',
            'razorpay_payment_id' => 'nullable|string'
        ]);

        return DB::transaction(function () use ($request) {
            $user = Auth::user();
            $plan = SubscriptionPlan::find($request->plan_id);

            // Deactivate existing
            Subscription::where('user_id', $user->id)->update(['status' => 'cancelled']);

            // Create Subscription
            $subscription = Subscription::create([
                'user_id' => $user->id,
                'plan_id' => $plan->id,
                'start_date' => Carbon::now(),
                'end_date' => Carbon::now()->addDays($plan->duration),
                'auto_renew' => true,
                'status' => 'active',
            ]);

            // Create Payment Record
            Payment::create([
                'user_id' => $user->id,
                'subscription_id' => $subscription->id,
                'amount' => $plan->price,
                'payment_method' => 'razorpay',
                'transaction_id' => $request->razorpay_payment_id ?? 'SIM_'.uniqid(),
                'status' => 'success'
            ]);

            return response()->json(['message' => 'Success', 'subscription' => $subscription]);
        });
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
        ->with('plan') // Assuming Subscription model has a 'plan' relationship
        ->first();

    if (!$subscription) {
        return response()->json(['status' => 'inactive'], 404);
    }

    return response()->json([
        'plan_name'  => $subscription->plan->name,
        'start_date' => $subscription->start_date,
        'end_date'   => $subscription->end_date,
        'auto_renew' => $subscription->auto_renew,
        'status'     => $subscription->status,
    ]);
}
}