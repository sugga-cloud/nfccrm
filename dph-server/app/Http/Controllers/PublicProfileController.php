<?php

namespace App\Http\Controllers;

use App\Models\Profile;

class PublicProfileController extends Controller
{
    public function show($username)
    {
        $profile = Profile::where('username', $username)
            ->with([
                'services',
                'products',
                'blogs',
                'gallery',
                'businessHours',
                'socialLinks',
                'analytics'
            ])
            ->firstOrFail();

        if (!$profile->is_active) {
            return view('subscription_expired');
        }

        $profile->analytics()->increment('visit_count');

        return view('public.profile', compact('profile'));
    }
}
