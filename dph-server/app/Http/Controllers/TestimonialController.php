<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TestimonialController extends Controller
{
    /**
     * Get testimonials for the authenticated user's profile.
     */
    public function index()
    {
        $testimonials = Auth::user()->profile->testimonials()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'testimonials' => $testimonials
        ]);
    }

    /**
     * Update the visibility status.
     */
    public function update(Request $request, Testimonial $testimonial)
    {
        // Ensure the testimonial belongs to the user's profile
        if ($testimonial->profile_id !== Auth::user()->profile->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'is_visible' => 'required|boolean',
        ]);

        $testimonial->update($validated);

        return response()->json([
            'message' => 'Testimonial updated successfully',
            'testimonial' => $testimonial
        ]);
    }

    /**
     * Delete the testimonial.
     */
    public function destroy(Testimonial $testimonial)
    {
        if ($testimonial->profile_id !== Auth::user()->profile->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $testimonial->delete();

        return response()->json([
            'message' => 'Testimonial deleted'
        ]);
    }
    /**
 * Store a newly created testimonial in storage.
 */
public function store(Request $request)
{
    $validated = $request->validate([
        'reviewer_name' => 'required|string|max:255',
        'content'       => 'required|string',
        'rating'        => 'required|integer|min:1|max:5',
        'is_visible'    => 'boolean',
    ]);

    // Automatically link to the logged-in user's profile
    $testimonial = Auth::user()->profile->testimonials()->create([
        'reviewer_name' => $validated['reviewer_name'],
        'content'       => $validated['content'],
        'rating'        => $validated['rating'],
        'is_visible'    => $request->get('is_visible', true),
    ]);

    return response()->json([
        'message' => 'Testimonial created successfully!',
        'testimonial' => $testimonial
    ], 201);
}
}