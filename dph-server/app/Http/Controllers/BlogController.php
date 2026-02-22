<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Traits\TracksStorage;

class BlogController extends Controller
{
    use TracksStorage;

    public function index()
    {
        return response()->json(Auth::user()->profile->blogs()->latest()->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120', // 5MB max
        ]);

        $profile = Auth::user()->profile;
        $imageData = null;

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            
            // 1. Track Storage Usage
            $this->trackFileUpload(Auth::id(), $file);
            
            // 2. Physical Storage
            $path = $file->store('blogs', 'public');
            $imageData = asset('storage/' . $path);
        }

        $blog = $profile->blogs()->create([
            'title' => $request->title,
            'description' => $request->description,
            'featured_image' => $imageData,
        ]);

        return response()->json($blog, 201);
    }

    public function update(Request $request, Blog $blog)
    {
        if ($blog->profile->user_id !== Auth::id()) abort(403);

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        $data = $request->only(['title', 'description']);

        if ($request->hasFile('image')) {
            // 1. Track the swap (decrements old, increments new)
            $this->trackFileUpdate(Auth::id(), $blog->featured_image, $request->file('image'));

            // 2. Delete the old physical file
            if ($blog->featured_image) {
                $oldPath = str_replace(asset('storage/'), '', $blog->featured_image);
                Storage::disk('public')->delete($oldPath);
            }

            // 3. Store new file
            $path = $request->file('image')->store('blogs', 'public');
            $data['featured_image'] = asset('storage/' . $path);
        }

        $blog->update($data);

        return response()->json(['message' => 'Updated', 'blog' => $blog]);
    }

    public function destroy(Blog $blog)
    {
        if ($blog->profile->user_id !== Auth::id()) abort(403);

        if ($blog->featured_image) {
            // 1. Subtract file size from user's storage usage table
            $this->trackFileDeletion(Auth::id(), $blog->featured_image);

            // 2. Delete physical file from disk
            $path = str_replace(asset('storage/'), '', $blog->featured_image);
            Storage::disk('public')->delete($path);
        }

        $blog->delete();

        return response()->json(['message' => 'Deleted']);
    }
}