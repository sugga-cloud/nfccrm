<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\EnquiryController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\LegalController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\TestimonialController;

/*
|--------------------------------------------------------------------------
| Public API Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return response()->json([
        'message' => 'API is running'
    ]);
});

// routes/api.php

// This endpoint must be public
Route::post('/webhooks/razorpay', [PaymentController::class, 'handleWebhook']);
// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/plans', [AdminController::class, 'plans']);

Route::get('/products/{id}', [ProductController::class, 'show']);
// Public Profile

/*
|--------------------------------------------------------------------------
| Protected Routes (User)
|--------------------------------------------------------------------------
*/
Route::get('/plans/{id}', [AdminController::class, 'planDetail']);
Route::post('/enquire',[EnquiryController::class, 'store']);
Route::post('/take-appointment',[AppointmentController::class, 'store']);
Route::middleware('auth:sanctum','is_active')->group(function () {
    
    // Auth & Basic Info
    Route::get('/user', function () {
        return response()->json(auth()->user());
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // Payments (MUST be outside 'subscribed' so they can renew)
    Route::post('/payments/create-order', [PaymentController::class, 'createOrder']);
    Route::post('/payments/verify', [PaymentController::class, 'verifyPayment']);
    
    // We allow fetching the current subscription status so the frontend 
    // can show the "Renew Now" card.
    Route::get('/user/current-subscription', [PaymentController::class, 'getCurrentSubscription']);

    // Profile (Customer-only self profile management)
    Route::middleware('role:customer')->group(function () {
        Route::get('/my-profile', [ProfileController::class, 'myProfile']);
        Route::put('/my-profile', [ProfileController::class, 'update']);
    });


    /*
    |--------------------------------------------------------------------------
    | 2. PROTECTED DATA ROUTES (Only for Active Subscribers)
    |--------------------------------------------------------------------------
    | No data from these resources will be transferred if 'subscribed' fails.
    */
    Route::middleware(['subscribed','role:customer'])->group(function () {
        
        // Content Management
        Route::apiResource('services', ServiceController::class);
        Route::apiResource('products', ProductController::class);
        Route::apiResource('blogs', BlogController::class);
        
        // Gallery logic
        Route::get('/gallery', [GalleryController::class, 'index']);
        Route::post('/gallery/upload', [GalleryController::class, 'store']); 
        Route::delete('/gallery/{id}', [GalleryController::class, 'destroy']);
        Route::apiResource('gallery', GalleryController::class);

        // Business Interactions
        Route::apiResource('appointments', AppointmentController::class);
        Route::apiResource('enquiries', EnquiryController::class);

        // Business Settings (customer-only for their own profile)
        Route::get('/profile/hours', [ProfileController::class, 'getHours']);
        Route::post('/profile/hours', [ProfileController::class, 'updateHours']);
        Route::get('/profile/social-links', [ProfileController::class, 'getSocialLinks']);
        Route::post('/profile/social-links', [ProfileController::class, 'updateSocialLinks']);
        Route::post('/profile/update-theme', [ProfileController::class, 'updateTheme']);
        Route::get('/my-testimonials', [TestimonialController::class, 'index']);
        Route::post('/testimonials', [TestimonialController::class, 'store']); // <--- Add this
        Route::patch('/testimonials/{testimonial}', [TestimonialController::class, 'update']);
        Route::delete('/testimonials/{testimonial}', [TestimonialController::class, 'destroy']);
        Route::get('/profile/terms', [LegalController::class, 'getTerms']);
        Route::post('/profile/terms', [LegalController::class, 'updateTerms']);

    });
});

/*
|--------------------------------------------------------------------------
| Admin Routes (Admin Only)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'role:admin,staff'])->prefix('admin')->group(function () {
    Route::get('/analytics', [AdminController::class, 'analytics']); // For AdminAnalytics tab
    Route::get('/profiles', [AdminController::class, 'profiles']);   // For ProfilesList tab
    // Admin profile management
    Route::post('/profiles', [AdminController::class, 'storeProfile']);            // create new profile
    Route::put('/profiles/{profile}', [AdminController::class, 'updateProfile']);  // update existing profile
    Route::delete('/profiles/{profile}', [AdminController::class, 'destroyProfile']); // delete profile
    Route::get('/profiles/{profile}', [AdminController::class, 'profileDetail']); // single profile for editing
    Route::post('/profiles/{profile}/update-theme', [ProfileController::class, 'updateThemeAdmin']); // admin update theme/ui
    Route::get('/users', [AdminController::class, 'users']);         // For UsersTab
    Route::get('/payments', [PaymentController::class, 'payments']);   // For PaymentsTab
    Route::get('/plans', [AdminController::class, 'plans']);
    Route::delete('/users/{user}', [AdminController::class, 'destroy']);
    Route::patch('/users/{user}/status', [AdminController::class, 'toggleStatus']);
    Route::post('/staff', [AdminController::class, 'createStaff']);
    // POST create plan -> Used for new plans
    Route::post('/plans', [AdminController::class, 'storePlan']);
    
    // PUT update plan -> Used when editingPlan is not null
    // Important: The parameter {plan} must match $plan in the controller
    Route::put('/plans/{plan}', [AdminController::class, 'updatePlan']);

    // DELETE plan -> Used by handleDelete()
    Route::delete('/plans/{plan}', [AdminController::class, 'destroyPlan']);
    Route::get('/storage-stats', [AdminController::class, 'storageStats']); // For StorageTab
    Route::patch('/profiles/{profile}/toggle', [AdminController::class, 'toggleActive']);
    // Razorpay Configuration Routes
    Route::get('/razorpay-settings', [PaymentController::class, 'getRazorpaySettings']);
    Route::post('/update-razorpay-settings', [PaymentController::class, 'updateRazorpaySettings']);
});
Route::post('/profiles/{id}/track-click', [ProfileController::class, 'trackClick']);
// Public product routes
Route::middleware('profile_is_active')->get('/profile/{username}', [ProfileController::class, 'show']);