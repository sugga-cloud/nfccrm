<?php

namespace App\Http\Controllers;
use App\Models\Profile; // Import the Profile model at the top

use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\AppointmentMail;
use Illuminate\Support\Facades\Log;
class AppointmentController extends Controller
{
    /**
     * Dashboard: List all appointments for the logged-in user's profile
     */
    public function index()
    {
        $profile = Auth::user()->profile;

        if (!$profile) {
            return response()->json([], 200);
        }

        // We use latest() to show the newest bookings first
        return response()->json($profile->appointments()->latest()->get());
    }


/**
     * Store a new appointment and notify the Profile Owner.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'profile_id'       => [
                'required',
                \Illuminate\Validation\Rule::exists(Profile::class, 'id')
            ],
            'customer_name'    => 'required|string|max:255',
            'customer_email'   => 'required|email|max:255',
            'customer_phone'   => 'required|string|max:20',
            'appointment_date' => 'required|date|after_or_equal:today',
            'appointment_time' => 'required|string',
            'status'           => 'nullable|string'
        ]);

        // 1. Create the appointment
        $appointment = Appointment::create($validated);

        // 2. Load relationships and send Email to Profile Owner
        $profile = Profile::with('user')->find($validated['profile_id']);
        
        if ($profile) {
            // Send email to the person who owns the NFC profile
            try {
                if ($profile->user && $profile->user->email) {
                    Mail::to($profile->user->email)->send(new AppointmentMail($appointment, 'new_booking'));
                }
            } catch (\Exception $e) {
                Log::error("Failed to send appointment notification: " . $e->getMessage());
            }

            // 3. Update Analytics
            $profile->analytics()->firstOrCreate(
                ['profile_id' => $profile->id],
                [
                    'visit_count' => 0, 
                    'click_count' => 0, 
                    'enquiry_count' => 0, 
                    'appointment_count' => 0
                ]
            )->increment('appointment_count');
        }

        return response()->json([
            'message' => 'Appointment booked successfully',
            'data' => $appointment
        ], 201);
    }

    /**
     * Dashboard: Update status and notify the Customer.
     */
    public function update(Request $request, Appointment $appointment)
    {
        // Security check
        if ($appointment->profile->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,rejected,completed',
        ]);

        $appointment->update($validated);

        // Notify the Guest/Customer about the status change
        try {
            Mail::to($appointment->customer_email)->send(new AppointmentMail($appointment, 'status_update'));
        } catch (\Exception $e) {
            Log::error("Failed to send status update email: " . $e->getMessage());
        }

        return response()->json([
            'message' => 'Appointment status updated to ' . $appointment->status,
            'data' => $appointment
        ]);
    }
    /**
     * Dashboard: Delete an appointment
     */
    public function destroy(Appointment $appointment)
    {
        if ($appointment->profile->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $appointment->delete();
        return response()->json(['message' => 'Appointment deleted']);
    }
}