<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Profile;

class CheckProfileStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
{
    // 1. Get the username from the route
    $username = $request->route('username');

    // 2. Fetch the actual record using first()
    $profile = \App\Models\Profile::where('username', $username)->first();

    // 3. Check if profile exists AND if it is inactive
    // We check !is_active to handle both 'false' and '0'
    if ($profile && !$profile->is_active) {
        return response()->json([
            'error' => 'Account Deactivated',
            'message' => 'This profile has been disabled by an administrator.',
            'code' => 'PROFILE_DISABLED'
        ], 403); 
    }

    // 4. If profile doesn't exist at all, you might want to 404 
    // or just let the controller handle it.
    if (!$profile) {
        return response()->json(['error' => 'Profile not found'], 404);
    }

    return $next($request);
}
}
