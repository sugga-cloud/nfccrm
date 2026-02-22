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
use App\Http\Controllers\PaymentController;

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
// Route::middleware('auth:sanctum','subscribed')->group(function () {
//     Route::get('/user/current-subscription', [PaymentController::class, 'getCurrentSubscription']);
//     // Current User
//     Route::get('/user', function () {
//         return response()->json(auth()->user());
//         });
        
//     Route::post('/logout', [AuthController::class, 'logout']);
//     // Fetch a single plan by ID
//     /*
//     |--------------------------------------------------------------------------
//     | Profile
//     |--------------------------------------------------------------------------
//     */
//     Route::get('/my-profile', [ProfileController::class, 'myProfile']);
//     Route::put('/my-profile', [ProfileController::class, 'update']);
    
//     /*
//     |--------------------------------------------------------------------------
//     | Services
//     |--------------------------------------------------------------------------
//     */
//     Route::apiResource('services', ServiceController::class);

//     /*
//     |--------------------------------------------------------------------------
//     | Products
//     |--------------------------------------------------------------------------
//     */
//     Route::apiResource('products', ProductController::class);
    
//     /*
//     |--------------------------------------------------------------------------
//     | Blogs
//     |--------------------------------------------------------------------------
//     */
//     Route::apiResource('blogs', BlogController::class);
    
//     /*
//     |--------------------------------------------------------------------------
//     | Gallery
//     |--------------------------------------------------------------------------
//     */
//     Route::apiResource('gallery', GalleryController::class);
// // We use a POST for upload even if it's "adding" because of multi-part file support
//     Route::get('/gallery', [GalleryController::class, 'index']);
//     Route::post('/gallery/upload', [GalleryController::class, 'store']); 
//     Route::delete('/gallery/{id}', [GalleryController::class, 'destroy']);
//     /*
//     |--------------------------------------------------------------------------
//     | Appointments
//     |--------------------------------------------------------------------------
//     */
//     Route::apiResource('appointments', AppointmentController::class);
    
//     /*
//     |--------------------------------------------------------------------------
//     | Enquiries
//     |--------------------------------------------------------------------------
//     */
//     Route::apiResource('enquiries', EnquiryController::class);

//     // Business Hours Routes
//     Route::get('/profile/hours', [ProfileController::class, 'getHours']);
//     Route::post('/profile/hours', [ProfileController::class, 'updateHours']);

//     // Social Links Routes
//     Route::get('/profile/social-links', [ProfileController::class, 'getSocialLinks']);
//     Route::post('/profile/social-links', [ProfileController::class, 'updateSocialLinks']);
//     Route::get('/products', [ProductController::class, 'index']);
//     Route::post('/payments/create-order', [PaymentController::class, 'createOrder']);
//     Route::post('/payments/verify', [PaymentController::class, 'verifyPayment']);
// });
/*
|--------------------------------------------------------------------------
| 1. BASIC AUTH ROUTES (Accessible even if subscription expired)
|--------------------------------------------------------------------------
| Users can still logout, view their profile, and PAY for a new plan here.
*/
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

    // Profile (Usually allowed so users can fix their email/billing info)
    Route::get('/my-profile', [ProfileController::class, 'myProfile']);
    Route::put('/my-profile', [ProfileController::class, 'update']);


    /*
    |--------------------------------------------------------------------------
    | 2. PROTECTED DATA ROUTES (Only for Active Subscribers)
    |--------------------------------------------------------------------------
    | No data from these resources will be transferred if 'subscribed' fails.
    */
    Route::middleware('subscribed')->group(function () {
        
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

        // Business Settings
        Route::get('/profile/hours', [ProfileController::class, 'getHours']);
        Route::post('/profile/hours', [ProfileController::class, 'updateHours']);
        Route::get('/profile/social-links', [ProfileController::class, 'getSocialLinks']);
        Route::post('/profile/social-links', [ProfileController::class, 'updateSocialLinks']);
    });
});

/*
|--------------------------------------------------------------------------
| Admin Routes (Admin Only)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/analytics', [AdminController::class, 'analytics']); // For AdminAnalytics tab
    Route::get('/profiles', [AdminController::class, 'profiles']);   // For ProfilesList tab
    Route::get('/users', [AdminController::class, 'users']);         // For UsersTab
    Route::get('/payments', [PaymentController::class, 'payments']);   // For PaymentsTab
    Route::get('/plans', [AdminController::class, 'plans']);
    Route::delete('/users/{user}', [AdminController::class, 'destroy']);
    Route::patch('/users/{user}/status', [AdminController::class, 'toggleStatus']);
    // POST create plan -> Used for new plans
    Route::post('/plans', [AdminController::class, 'storePlan']);
    
    // PUT update plan -> Used when editingPlan is not null
    // Important: The parameter {plan} must match $plan in the controller
    Route::put('/plans/{plan}', [AdminController::class, 'updatePlan']);

    // DELETE plan -> Used by handleDelete()
    Route::delete('/plans/{plan}', [AdminController::class, 'destroyPlan']);
    Route::get('/storage-stats', [AdminController::class, 'storageStats']); // For StorageTab
    Route::patch('/profiles/{profile}/toggle', [AdminController::class, 'toggleActive']);
});
Route::post('/profiles/{id}/track-click', [ProfileController::class, 'trackClick']);
// Public product routes
Route::middleware('profile_is_active')->get('/profile/{username}', [ProfileController::class, 'show']);