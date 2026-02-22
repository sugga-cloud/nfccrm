<?php

namespace App\Http\Controllers;

use App\Models\Enquiry;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\EnquiryMail;
class EnquiryController extends Controller
{
    /**
     * Display enquiries for the authenticated user's profile.
     */
    public function index()
    {
        $profile = Auth::user()->profile;

        if (!$profile) {
            return response()->json([], 200);
        }

        // Return enquiries sorted by latest
        return response()->json($profile->enquiries()->latest()->get());
    }

    /**
     * Store a new enquiry (Used by the public/visitors).
     */
 public function store(Request $request)
{   
    $validated = $request->validate([
        'profile_id' => 'required|exists:profiles,id',
        'name'       => 'required|string|max:255',
        'email'      => 'required|email',
        'phone'      => 'nullable|string',
        'message'    => 'required|string',
    ]);

    // 1. Create the enquiry
    $enquiry = Enquiry::create($validated);

    // 2. Find the profile and its owner (Customer)
    // Assuming Profile belongsTo User
    $profile = \App\Models\Profile::with('user')->find($validated['profile_id']);
    
    if ($profile) {
        // --- EMAIL SYSTEM START ---
        try {
            $ownerEmail = $profile->user->email; // The Customer's email
            Mail::to($ownerEmail)->send(new EnquiryMail($enquiry, $profile));
        } catch (\Exception $e) {
            // Log error but don't stop the user's response
            Log::error("Email failed: " . $e->getMessage());
        }
        // --- EMAIL SYSTEM END ---

        // Update Analytics
        $profile->analytics()->firstOrCreate(
            ['profile_id' => $profile->id],
            ['visit_count' => 0, 'click_count' => 0, 'enquiry_count' => 0, 'appointment_count' => 0]
        )->increment('enquiry_count');
    }

    return response()->json([
        'message' => 'Enquiry sent successfully!',
        'enquiry' => $enquiry
    ], 201);
}
    /**
     * Remove an enquiry (Only the owner can delete).
     */
    public function destroy(Enquiry $enquiry)
    {
        // Check if the enquiry belongs to the authenticated user's profile
        if ($enquiry->profile->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $enquiry->delete();

        return response()->json(['message' => 'Enquiry deleted']);
    }
}