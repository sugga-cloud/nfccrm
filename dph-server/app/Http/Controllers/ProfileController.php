<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\ProfileAnalytics;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\SocialLink;
use App\Models\BusinessHour;
use App\Models\SubscriptionPlan;
use App\Models\StorageUsage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
   /**
     * Public Profile (For NFC URL)
     */
  public function show($username)
{
    $profile = Profile::where('username', $username)
        ->with([
            'services',
            'products',
            'blogs',
            'gallery',
            'businessHours',
            'analytics',
            'user',
            'sociallinks'
        ])
        ->first();

    if (!$profile) {
        return response()->json(['message' => 'Profile not found'], 404);
    }

    // Ensure analytics record exists and increment visit_count
    // This handles profiles that might have been created without an analytics row
    $analytics = $profile->analytics()->firstOrCreate(
        ['profile_id' => $profile->id],
        ['visit_count' => 0, 'click_count' => 0, 'enquiry_count' => 0, 'appointment_count' => 0]
    );
    
    $analytics->increment('visit_count');

    return response()->json($profile);
}
public function trackClick($id)
{
    $profile = Profile::findOrFail($id);
    
    $profile->analytics()->firstOrCreate(
        ['profile_id' => $id],
        ['click_count' => 0]
    )->increment('click_count');

    return response()->json(['message' => 'Click tracked']);
}
    /**
     * Authenticated User Profile (Dashboard)
     */
public function myProfile()
{
    $user = Auth::user();
    
    // Load profile with its specific relations
    $profile = Profile::where('user_id', $user->id)
        ->with(['gallery', 'services', 'blogs', 'analytics']) // Load things linked to profile
        ->first();

    // Load storage usage linked directly to the user
    $storage = StorageUsage::where('user_id', $user->id)->first();

    // Calculate Analytics on the fly for the frontend
// Use first() to get a single object out of the collection
$activeSubscription = $user->subscriptions()->where('status', 'active')->first();
$plan = 100;
if ($activeSubscription) {
    $plan = SubscriptionPlan::where('id', $activeSubscription->plan_id)->first();
} else {
    $plan = "No Plan Active yet"; // Default for users with no active plan
}
    return response()->json([
        'user' => $user,
        'profile' => $profile,
        'storage' => $storage,
        'analytics' => $profile?->analytics,
        'plan' => $plan
    ]);
}

    /**
     * Update Profile with Image Handling
     */
    public function update(Request $request)
    {
        $profile = Profile::where('user_id', Auth::id())->first();

        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        $validated = $request->validate([
            'username'            => 'nullable|string|max:255|unique:profiles,username,' . $profile->id,
            'designation'         => 'nullable|string|max:255',
            'company_name'        => 'nullable|string|max:255',
            'company_description' => 'nullable|string',
            'phone'               => 'nullable|string',
            'whatsapp'            => 'nullable|string',
            'website'             => 'nullable|string',
            'google_map_link'     => 'nullable|string',
            'address'     => 'nullable|string',
            'profile_image'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // 2MB Max
            'cover_image'         => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB Max
        ]);

        // --- Handle Profile Image ---
        if ($request->hasFile('profile_image')) {
            // Delete old image if it exists
            if ($profile->profile_image) {
                $oldPath = str_replace(asset('storage/'), '', $profile->profile_image);
                Storage::disk('public')->delete($oldPath);
            }
            
            $path = $request->file('profile_image')->store('profiles/avatars', 'public');
            $validated['profile_image'] = asset('storage/' . $path);
        }

        // --- Handle Cover Image ---
        if ($request->hasFile('cover_image')) {
            // Delete old image if it exists
            if ($profile->cover_image) {
                $oldPath = str_replace(asset('storage/'), '', $profile->cover_image);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('cover_image')->store('profiles/covers', 'public');
            $validated['cover_image'] = asset('storage/' . $path);
        }

        // Update the profile with validated data (including new image URLs if any)
        $profile->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'profile' => $profile
        ]);
    }

    /**
     * Delete Account
     */
    public function destroy(Request $request)
    {
        $request->validate(['password' => ['required']]);

        $user = Auth::user();

        if (!password_verify($request->password, $user->password)) {
            return response()->json(['message' => 'Incorrect password'], 400);
        }

        // Clean up images before deleting profile/user
        if ($user->profile) {
            if ($user->profile->profile_image) {
                Storage::disk('public')->delete(str_replace(asset('storage/'), '', $user->profile->profile_image));
            }
            if ($user->profile->cover_image) {
                Storage::disk('public')->delete(str_replace(asset('storage/'), '', $user->profile->cover_image));
            }
        }

        $user->delete();

        return response()->json(['message' => 'Account deleted successfully']);
    }
    public function getHours()
    {
        $profile = Auth::user()->profile;
        
        // Return sorted by ID or Day to keep the order Monday -> Sunday
        return response()->json($profile->businessHours);
    }

    public function updateHours(Request $request)
    {
        $request->validate([
            'hours' => 'required|array',
            'hours.*.day' => 'required|string',
            'hours.*.open' => 'nullable',
            'hours.*.close' => 'nullable',
            'hours.*.isOpen' => 'required|boolean',
        ]);

        $profile = Auth::user()->profile;

        DB::transaction(function () use ($profile, $request) {
            // 1. Wipe current schedule
            $profile->businessHours()->delete();

            // 2. Map and Insert new schedule
            $data = collect($request->hours)->map(function ($hour) use ($profile) {
                return [
                    'profile_id' => $profile->id,
                    'day'        => $hour['day'],
                    'open_time'       => $hour['isOpen'] ? $hour['open'] : null,
                    'close_time'      => $hour['isOpen'] ? $hour['close'] : null,
                    'is_closed'    => !$hour['isOpen'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            })->toArray();

            BusinessHour::insert($data);
        });

        return response()->json(['message' => 'Schedule updated successfully']);
    }

    /** * SOCIAL LINKS LOGIC (Separate Table)
     */
    public function getSocialLinks()
    {
        $profile = Auth::user()->profile;
        // Returns: ["instagram" => "url", "facebook" => "url"]
        return response()->json(
            $profile->socialLinks()->pluck('url', 'platform')
        );
    }

    public function updateSocialLinks(Request $request)
    {
        $request->validate([
            'links' => 'required|array', // Expects: {"instagram": "url", "twitter": "url"}
        ]);

        $profile = Auth::user()->profile;

        // Start a transaction for safety
        \DB::transaction(function () use ($profile, $request) {
            // 1. Remove existing links to start fresh
            $profile->socialLinks()->delete();

            // 2. Filter out empty URLs and prepare new data
            $newLinks = [];
            foreach ($request->links as $platform => $url) {
                if (!empty($url)) {
                    $newLinks[] = [
                        'profile_id' => $profile->id,
                        'platform'   => $platform,
                        'url'        => $url,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }

            // 3. Mass insert
            if (count($newLinks) > 0) {
                SocialLink::insert($newLinks);
            }
        });

        return response()->json(['message' => 'Social links synchronized successfully.']);
    }

    /**
     * Update Profile Theme
     */
    public function updateTheme(Request $request)
    {
        // 1. Get the profile belonging to the authenticated user
        $profile = Profile::where('user_id', Auth::id())->first();

        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        // 2. Validate the request
        // Adjust the validation rules if your theme IDs are strings or specific numbers
        $validated = $request->validate([
            'theme_id' => 'required|string|max:50', 
        ]);

        // 3. Update the theme_id column
        $profile->update([
            'theme_id' => $validated['theme_id']
        ]);

        return response()->json([
            'message' => 'Theme updated successfully',
            'theme_id' => $profile->theme_id
        ]);
    }
}
