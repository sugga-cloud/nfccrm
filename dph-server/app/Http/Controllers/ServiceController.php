<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Traits\TracksStorage;

class ServiceController extends Controller
{
    use TracksStorage;

    public function index()
    {
        $profile = Auth::user()->profile;

        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        return response()->json($profile->services()->latest()->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048', // 2MB max
        ]);

        $profile = Auth::user()->profile;

        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        $imageData = null;
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            
            // 1. Track Storage
            $this->trackFileUpload(Auth::id(), $file);
            
            // 2. Store File
            $path = $file->store('services', 'public');
            $imageData = asset('storage/' . $path);
        }

        $service = $profile->services()->create([
            'title' => $request->title,
            'description' => $request->description,
            'image' => $imageData,
        ]);

        return response()->json([
            'message' => 'Service created successfully',
            'service' => $service
        ], 201);
    }

    public function update(Request $request, Service $service)
    {
        $this->authorizeService($service);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $data = $request->only(['title', 'description']);

        if ($request->hasFile('image')) {
            // 1. Track Update (subtracts old size, adds new size)
            $this->trackFileUpdate(Auth::id(), $service->image, $request->file('image'));

            // 2. Delete old file physically if it exists
            if ($service->image) {
                $oldPath = str_replace(asset('storage/'), '', $service->image);
                Storage::disk('public')->delete($oldPath);
            }

            // 3. Store new file
            $path = $request->file('image')->store('services', 'public');
            $data['image'] = asset('storage/' . $path);
        }

        $service->update($data);

        return response()->json([
            'message' => 'Service updated successfully',
            'service' => $service
        ]);
    }

    public function destroy(Service $service)
    {
        $this->authorizeService($service);

        // 1. Track Deletion (decrements storage_usage table)
        if ($service->image) {
            $this->trackFileDeletion(Auth::id(), $service->image);

            // 2. Delete physical file
            $path = str_replace(asset('storage/'), '', $service->image);
            Storage::disk('public')->delete($path);
        }

        $service->delete();

        return response()->json([
            'message' => 'Service deleted successfully'
        ]);
    }

    private function authorizeService(Service $service)
    {
        if ($service->profile->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }
    }
}