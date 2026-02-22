<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Traits\TracksStorage; // Uncommented

class GalleryController extends Controller
{
    use TracksStorage; // Uncommented

    /**
     * Get the logged-in user's gallery items.
     */
    public function index()
    {
        $profile = Auth::user()->profile;

        if (!$profile) {
            return response()->json([], 200);
        }

        return response()->json($profile->gallery()->latest()->get());
    }

    /**
     * Store multiple images in the gallery.
     */
    public function store(Request $request)
    {
        $request->validate([
            'images'   => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB limit
        ]);

        $profile = Auth::user()->profile;
        $items = [];

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                // 1. Track the storage for EACH file
                $this->trackFileUpload(Auth::id(), $file);

                // 2. Store file in public/gallery folder
                $path = $file->store('gallery/' . $profile->id, 'public');
                
                // 3. Create DB record
                $galleryItem = $profile->gallery()->create([
                    'media_url' => asset('storage/' . $path),
                ]);

                $items[] = $galleryItem;
            }
        }

        return response()->json([
            'message' => 'Images uploaded successfully',
            'data'    => $items
        ], 201);
    }

    /**
     * Remove a specific image from the gallery.
     */
    public function destroy(string $id)
    {
        // Ensure the image belongs to the authenticated user's profile
        $galleryItem = Auth::user()->profile->gallery()->findOrFail($id);

        // 1. Track the deletion to decrement storage usage
        $this->trackFileDeletion(Auth::id(), $galleryItem->media_url);

        // 2. Delete the file from physical storage
        $relativePath = str_replace(asset('storage/'), '', $galleryItem->media_url);
        Storage::disk('public')->delete($relativePath);

        // 3. Delete DB record
        $galleryItem->delete();

        return response()->json([
            'message' => 'Image removed from gallery'
        ]);
    }
}