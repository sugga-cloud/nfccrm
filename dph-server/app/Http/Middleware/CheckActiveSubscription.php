<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckActiveSubscription
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        // 1. If user isn't logged in, let standard Auth middleware handle it
        if (!$user) {
            return $next($request);
        }

        // 2. Check for an active subscription
        $hasActivePlan = $user->subscriptions()
            ->where('status', 'active')
            ->where('end_date', '>', now())
            ->exists();

        if (!$hasActivePlan) {
            return response()->json([
                'error' => 'Subscription Required',
                'message' => 'Your access is restricted. Please purchase a plan to continue.',
                'code' => 'SUBSCRIPTION_EXPIRED'
            ], 403); // 403 Forbidden
        }

        return $next($request);
    }
}