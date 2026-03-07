<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LegalDocument;
use Illuminate\Support\Facades\Auth;

class LegalController extends Controller
{
    /**
     * Get the Terms and Conditions for the logged-in user.
     */
    public function getTerms()
    {
        $terms = Auth::user()->profile->legalDocuments()
            ->where('type', 'terms')
            ->first();

        return response()->json($terms ?? ['content' => '']);
    }

    /**
     * Update or Create Terms.
     */
    public function updateTerms(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string',
            'title'   => 'nullable|string|max:255',
        ]);

        $profile = Auth::user()->profile;

        $terms = $profile->legalDocuments()->updateOrCreate(
            ['type' => 'terms'],
            [
                'title'   => $validated['title'] ?? 'Terms and Conditions',
                'content' => $validated['content'],
                'is_active' => true
            ]
        );

        return response()->json([
            'message' => 'Terms updated successfully',
            'data' => $terms
        ]);
    }
}