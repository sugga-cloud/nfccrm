<?php

namespace App\Http\Controllers;

use App\Models\SubscriptionPlan; // Ensure you have a Plan model created
use App\Models\User;
use App\Models\Profile;
use App\Models\Enquiry;
use App\Models\Product;
use App\Models\Service;
use App\Models\Payment;
use App\Models\StorageUsage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class AdminController extends Controller
{
    /**
     * Get System-wide Analytics
     * Used by: AdminAnalytics.tsx
     */
    public function analytics()
    {
        // Aggregating counts and sums
        $totalUsers = User::count();
        $activeProfiles = Profile::where('is_active', true)->count();
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();
        // Mock revenue logic - replace with your Payments table logic if available
        // 1. Total MTD Revenue (Single Number)
        $revenueMTD = Payment::where('status', 'success')
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->sum('amount');

        // 2. Chart Data: Daily Revenue
        $chartData = Payment::where('status', 'success')
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(amount) as total')
            )
            ->groupBy('date')
            ->orderBy('date', 'ASC')
            ->get();
        $totalRevenue = Payment::sum('amount');
        // Calculating total storage used across all profiles
        $totalStorageMB = StorageUsage::sum('used_space_mb') ?? 0;
        $totalStorageGB = round($totalStorageMB / 1024, 2);
        // $totalStorageGB = $totalStorageMB;

        // Plan distribution for the Pie Chart
        $planDistribution = Profile::join('subscriptions', 'profiles.user_id', '=', 'subscriptions.user_id')
        // If you have a 'plans' table, join it here to get the name
        // ->join('plans', 'subscriptions.plan_id', '=', 'plans.id') 
        ->select('subscriptions.plan_id', DB::raw('count(*) as value'))
        ->groupBy('subscriptions.plan_id')
        ->get()
        ->map(function ($item) {
            // You can use a match expression or a Plan model to get the name
            $planName = SubscriptionPlan::select('name')->where('id',$item->plan_id)->first()->name;

        return [
            'name' => $planName,
            'value' => $item->value
        ];
    });

        return response()->json([
            'total_users' => $totalUsers,
            'active_profiles' => $activeProfiles,
            'revenue' => $revenueMTD,
            'storage_gb' => $totalStorageGB,
            'plan_distribution' => $planDistribution,
            'total_revenue' => $totalRevenue,
            'chart_data' => $chartData
        ]);
    }

    /**
     * List Profiles for Management
     * Used by: ProfilesList.tsx
     */
    public function profiles()
{
    try {
        // Eager load 'user' to avoid N+1 query issues
        $profiles = Profile::with('user')->get();

       $data = $profiles->map(function ($p) {
    // 1. Get the latest active subscription from the user
    // We use optional() or null coalescing to prevent "Attempt to read property on null"
    $activeSub = $p->user->subscriptions->where('status', 'active')->first();

    return [
        'id' => $p->id,
        'user_id' => $p->user_id,
        'username' => $p->username,
        'email' => $p->user->email ?? 'No Email', 
        
        // Return the Plan Name specifically
        'plan' => $activeSub && $activeSub->plan ? $activeSub->plan->name : 'No Active Plan', 
        
        // Return full details if you need them for the frontend (e.g., price, expiry)
        'plan_detail' => $activeSub ? [
            'name' => $activeSub->plan->name ?? 'N/A',
            'price' => $activeSub->plan->price ?? 0,
            'expiry' => $activeSub->end_date,
        ] : null,

        'is_active' => $p->user ? (bool)$p->user->is_active : false,
    ];
});
  

        return response()->json($data);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Database Error',
            'message' => $e->getMessage()
        ], 500);
    }
}

    /**
     * Toggle Profile Status (Activate/Deactivate)
     * Used by: ToggleTab.tsx & ProfilesList.tsx
     */
    public function toggleActive(Request $request, Profile $profile)
    {
        $profile->is_active = !$profile->is_active;
        $profile->save();

        return response()->json([
            'message' => 'Profile status updated successfully',
            'is_active' => $profile->is_active
        ]);
    }

 /**
 * ADMIN: create a new profile (and user if necessary)
 */
public function storeProfile(Request $request)
{
    // 1. Initial lookup to determine validation rules
    $user = User::where('email', $request->email)->first();
    $existingProfile = $user ? $user->profile : null;

    $rules = [
        'email' => 'required|email' . ($user ? '' : '|unique:users,email'),
        'username' => 'required|string|max:255|unique:profiles,username' . ($existingProfile ? ',' . $existingProfile->id : ''),
        'designation' => 'nullable|string|max:255',
        'company_name' => 'nullable|string|max:255',
        'phone' => 'nullable|string',
        'whatsapp' => 'nullable|string',
        'website' => 'nullable|string',
        'google_map_link' => 'nullable|string',
        'address' => 'nullable|string',
        'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        'theme_id' => 'nullable|string|max:50',
        'interface_id' => 'nullable|string|max:50',
    ];

    $validated = $request->validate($rules);

    return DB::transaction(function () use ($request, $validated, $user, $existingProfile) {
        
        // 2. If profile exists, STOP and redirect to Update logic immediately
        if ($existingProfile) {
            return $this->updateProfile($request, $existingProfile);
        }

        // 3. If User exists but no profile, use that user. Otherwise, create user.
        if (!$user) {
            $user = User::create([
                'full_name' => $validated['username'],
                'email' => $validated['email'],
                'password' => bcrypt('12345678'), // Default password, should prompt reset
                'role_id' => 2,
                'is_active' => true,
            ]);
        }

        // 4. Double check: Ensure no profile was created by a race condition
        // This is the "Safety Guard" against the 1062 error
        $profile = Profile::updateOrCreate(
            ['user_id' => $user->id], // Search criteria
            $this->mapProfileData($request, $validated) // Data to insert/update
        );

        $this->saveRelatedData($request, $profile);

        return response()->json($profile, 201);
    });
}

/**
 * Helper to clean up data mapping for profiles
 */
private function mapProfileData(Request $request, $validated)
{
    $data = $validated;
    
    if ($request->hasFile('profile_image')) {
        $path = $request->file('profile_image')->store('profiles/avatars', 'public');
        $data['profile_image'] = asset('storage/' . $path);
    }
    
    if ($request->hasFile('cover_image')) {
        $path = $request->file('cover_image')->store('profiles/covers', 'public');
        $data['cover_image'] = asset('storage/' . $path);
    }
    
    return $data;
}

/**
 * ADMIN: update profile (and optionally user email)
 */
public function updateProfile(Request $request, Profile $profile)
{
    \Log::info("Updating profile ID {$profile->id} with data: ", $request->all());
    $validated = $request->validate([
        'email' => 'nullable|email|unique:users,email,' . $profile->user_id,
        'username' => 'nullable|string|max:255|unique:profiles,username,' . $profile->id,
        'designation' => 'nullable|string|max:255',
        'company_name' => 'nullable|string|max:255',
        'phone' => 'nullable|string',
        'whatsapp' => 'nullable|string',
        'website' => 'nullable|string',
        'google_map_link' => 'nullable|string',
        'address' => 'nullable|string',
        'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        'theme_id' => 'nullable|string|max:50',
        'interface_id' => 'nullable|string|max:50',
    ]);

    return DB::transaction(function () use ($request, $validated, $profile) {
        if (isset($validated['email'])) {
            $profile->user->update(['email' => $validated['email']]);
        }

        // Handle Image Deletions before replacing
        foreach (['profile_image', 'cover_image'] as $field) {
            if ($request->hasFile($field)) {
                if ($profile->$field) {
                    Storage::disk('public')->delete(str_replace(asset('storage/'), '', $profile->$field));
                }
                $folder = ($field === 'profile_image') ? 'avatars' : 'covers';
                $path = $request->file($field)->store("profiles/$folder", 'public');
                $validated[$field] = asset('storage/' . $path);
            }
        }

        $profile->update($validated);
        
        // Clean up old related files before wiping database records
        foreach ($profile->gallery as $item) {
            Storage::disk('public')->delete(str_replace(asset('storage/'), '', $item->media_url));
        }
        foreach ($profile->services as $item) {
            if ($item->image) Storage::disk('public')->delete(str_replace(asset('storage/'), '', $item->image));
        }
        foreach ($profile->products as $item) {
            if ($item->image) Storage::disk('public')->delete(str_replace(asset('storage/'), '', $item->image));
        }

        $profile->businessHours()->delete();
        $profile->socialLinks()->delete();
        $profile->gallery()->delete();
        $profile->services()->delete();
        $profile->products()->delete();

        $this->saveRelatedData($request, $profile);

        return response()->json(['message' => 'Profile updated successfully', 'profile' => $profile->load(['services', 'products', 'gallery'])]);
    });
}

/**
 * Helper to handle the repetitive related data saving
 */
private function saveRelatedData(Request $request, Profile $profile)
{
    // Business Hours
    if ($request->filled('hours')) {
        $hours = json_decode($request->hours, true);
        foreach ($hours as $h) {
            $profile->businessHours()->create([
                'day' => $h['day'],
                'open_time' => $h['isOpen'] ? $h['open'] : null,
                'close_time' => $h['isOpen'] ? $h['close'] : null,
                'is_closed' => !$h['isOpen'],
            ]);
        }
    }

    // Social Links
    if ($request->filled('links')) {
        $linksArr = json_decode($request->links, true);

        // Support both:
        // 1) [{ platform: 'instagram', url: '...' }, ...]
        // 2) { instagram: '...', facebook: '...' }
        foreach ($linksArr as $key => $value) {
            if (is_array($value)) {
                // Array of objects form
                $platform = $value['platform'] ?? null;
                $url = $value['url'] ?? null;
            } else {
                // Key/value map form
                $platform = $key;
                $url = $value;
            }

            if (!empty($platform) && !empty($url)) {
                $profile->socialLinks()->create([
                    'platform' => $platform,
                    'url' => $url,
                ]);
            }
        }
    }

    // Gallery
    if ($request->hasFile('gallery')) {
        foreach ($request->file('gallery') as $file) {
            $path = $file->store('profiles/gallery', 'public');
            $profile->gallery()->create(['media_type' => 'image', 'media_url' => asset('storage/' . $path)]);
        }
    }

    // Services
    $servicesData = $request->input('services', []);
    foreach ($servicesData as $idx => $s) {
        $data = ['title' => $s['title'] ?? '', 'description' => $s['description'] ?? ''];
        if ($request->hasFile("services.$idx.image")) {
            $path = $request->file("services.$idx.image")->store('profiles/services', 'public');
            $data['image'] = asset('storage/' . $path);
        }
        $profile->services()->create($data);
    }

    // Products
    $productsData = $request->input('products', []);
    foreach ($productsData as $idx => $p) {
        $data = ['name' => $p['name'] ?? '', 'description' => $p['description'] ?? '', 'price' => $p['price'] ?? 0];
        if ($request->hasFile("products.$idx.image")) {
            $path = $request->file("products.$idx.image")->store('profiles/products', 'public');
            $data['image'] = asset('storage/' . $path);
        }
        $profile->products()->create($data);
    }

    // Blogs
    $blogsData = $request->input('blogs', []);
    foreach ($blogsData as $idx => $b) {
        $data = [
            'title' => $b['title'] ?? '',
            'description' => $b['description'] ?? '',
        ];
        if ($request->hasFile("blogs.$idx.image")) {
            $path = $request->file("blogs.$idx.image")->store('profiles/blogs', 'public');
            $data['featured_image'] = asset('storage/' . $path);
        }
        $profile->blogs()->create($data);
    }

    // Testimonials
    $testimonialsData = $request->input('testimonials', []);
    foreach ($testimonialsData as $t) {
        if (empty($t['reviewer_name']) || empty($t['content'])) {
            continue;
        }
        $profile->testimonials()->create([
            'reviewer_name' => $t['reviewer_name'],
            'content' => $t['content'],
            'rating' => $t['rating'] ?? 5,
            'is_visible' => isset($t['is_visible']) ? (bool)$t['is_visible'] : true,
        ]);
    }

    // Terms & Conditions
    if ($request->filled('terms_content')) {
        $title = $request->input('terms_title', 'Terms and Conditions');
        $content = $request->input('terms_content');

        $profile->legalDocuments()->updateOrCreate(
            ['type' => 'terms'],
            [
                'title' => $title,
                'content' => $content,
                'is_active' => true,
            ]
        );
    }
}

    /**
     * ADMIN: delete a profile (also cascades via relationship)
     */
    public function destroyProfile(Profile $profile)
    {
        $profile->delete();
        return response()->json(['message' => 'Profile deleted successfully']);
    }

    /**
     * List All Users and Roles
     * Used by: UsersTab.tsx
     */
    public function users()
    {
        $users = User::select('id', 'full_name', 'email', 'role_id','created_at','is_active')->where('role_id','!=','1')
            ->latest()
            ->get();

        return response()->json($users);
    }

    /**
     * ADMIN: Create a staff user (role_id = 3)
     */
    public function createStaff(Request $request)
    {
        $data = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'full_name' => $data['full_name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role_id' => 3,
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'Staff user created successfully',
            'user' => $user,
        ], 201);
    }

    /**
     * Storage Monitoring Data
     * Used by: StorageTab.tsx
     */
    public function storageStats()
{
    return Profile::query()
    // 1. Join storage usage
    ->leftJoin('storage_usage', 'profiles.user_id', '=', 'storage_usage.user_id')
    // 2. Join subscriptions
    ->leftJoin('subscriptions', 'profiles.user_id', '=', 'subscriptions.user_id')
    // 3. Join plans to get the dynamic limit and name
    ->leftJoin('subscription_plans', 'subscriptions.plan_id', '=', 'subscription_plans.id')
    ->select(
        'profiles.id',
        'profiles.username',
        'storage_usage.used_space_mb as used_mb',
        'subscriptions.plan_id',
        'subscription_plans.name as plan_name',
        'subscription_plans.limit as plan_limit' // Fetch the new column
    )
    ->where('subscriptions.status', 'active')
    ->get()
    ->map(function($p) {
        // Use the limit from DB, fallback to 100 (Starter) if null
        $limit = $p->plan_limit ?? 100;
        $used = $p->used_mb ?? 0;

        return [
            'id' => $p->id,
            'username' => $p->username,
            'used_mb' => round($used, 2),
            'limit_mb' => $limit,
            'plan' => $p->plan_name ?? 'Starter', 
            // Percentage now calculates based on the DB limit
            'percentage' => $limit > 0 ? min(round(($used / $limit) * 100, 2), 100) : 0
        ];
    });
    }

    /**
     * Payment History (Mocking for now, connect to your Payments table)
     * Used by: PaymentsTab.tsx
     */
    public function payments()
    {
        // Example structure matching your frontend needs
        return response()->json([
            [
                'id' => 1,
                'user' => ['name' => 'John Doe'],
                'plan_name' => 'Pro Plan',
                'amount' => 9.00,
                'status' => 'completed',
                'created_at' => now()->subDays(2)
            ],
            [
                'id' => 2,
                'user' => ['name' => 'Jane Smith'],
                'plan_name' => 'Business Plan',
                'amount' => 29.00,
                'status' => 'completed',
                'created_at' => now()->subDays(5)
            ]
        ]);
    }


/**
 * Create a new Subscription Plan
 * Used by: PlansTab.tsx
 */
/**
 * READ: List all plans
 */
public function plans()
{
    return response()->json(SubscriptionPlan::latest()->get());
}
public function planDetail($id)
    {
        // Find the plan or return 404
        $plan = SubscriptionPlan::find($id);

        if (!$plan) {
            return response()->json([
                'message' => 'Plan not found'
            ], 404);
        }

        return response()->json($plan);
    }

    /**
     * Return a single profile with related data for editing
     */
    public function profileDetail(Profile $profile)
    {
        $profile->load([
            'businessHours',
            'socialLinks',
            'gallery',
            'services',
            'products'
        ]);

        return response()->json($profile);
    }

/**
 * CREATE: Store a new plan
 */
public function storePlan(Request $request)
{
    $validated = $request->validate([
        'name'     => 'required|string|unique:subscription_plans,name|max:255',
        'price'    => 'required|numeric|min:0',
        'duration' => 'required|integer',
        'features' => 'nullable|array',
        'limit'    => 'required|integer'
    ]);

    $plan = SubscriptionPlan::create($validated);
    return response()->json($plan, 201);
}

/**
 * UPDATE: Update an existing plan
 */
public function updatePlan(Request $request, SubscriptionPlan $plan)
{
    $validated = $request->validate([
        'name'     => 'required|string|max:255|unique:subscription_plans,name,' . $plan->id,
        'price'    => 'required|numeric|min:0',
        'duration' => 'required|integer',
        'features' => 'nullable|array',
        'limit'    => 'nullable|integer'
    ]);

    $plan->update($validated);
    return response()->json(['message' => 'Plan updated successfully', 'plan' => $plan]);
}

/**
 * DELETE: Remove a plan
 */
public function destroyPlan(SubscriptionPlan $plan)
{
    // Check if any profiles are currently using this plan before deleting
    // if ($plan->profiles()->exists()) {
    //     return response()->json(['message' => 'Cannot delete plan being used by users'], 422);
    // }

    $plan->delete();
    return response()->json(['message' => 'Plan deleted successfully']);
}

public function destroy(User $user) {
    $user->delete(); // This will also delete their profile/storage if cascades are set
    return response()->json(['message' => 'Deleted']);
}

public function toggleStatus(Request $request, User $user) {
    $user->update(['is_active' => $request->is_active]);
    return response()->json(['message' => 'Status Updated']);
}
}