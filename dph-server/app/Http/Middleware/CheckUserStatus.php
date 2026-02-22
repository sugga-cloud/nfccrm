<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckUserStatus
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if ($user && !$user->is_active) {
            // Log the user out so they can't use their session anymore
            Auth::guard('web')->logout(); 
            // If using Sanctum/Tokens, you can also revoke them here
            $user->tokens()->delete();

            return response()->json([
                'error' => 'Account Deactivated',
                'message' => 'Your account has been disabled by an administrator.',
                'code' => 'ACCOUNT_DISABLED'
            ], 403); 
        }

        return $next($request);
    }
}