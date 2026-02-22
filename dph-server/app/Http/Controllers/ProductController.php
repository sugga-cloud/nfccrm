<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Traits\TracksStorage; // Import Trait
class ProductController extends Controller
{   use TracksStorage;
    public function index()
    {
        $profile = Auth::user()->profile;
        if (!$profile) return response()->json([], 200);
        return response()->json($profile->products);
    }

    public function show($id){
        $product = Product::where('id',$id)->first();
        return response()->json($product);
    }

    public function store(Request $request)
    {
        $profile = Auth::user()->profile;
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048'
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            // This generates a full URL: http://yoursite.com/storage/products/filename.jpg
            $validated['image'] = asset('storage/' . $path);
        }
        // Track the storage!
            $this->trackFileUpload(auth()->id(), $request->file('image'));
        $product = $profile->products()->create($validated);
        return response()->json($product, 201);
    }

    public function update(Request $request, Product $product)
    {
        // Ownership check
        if ($product->profile->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048'
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($product->image) {
                $oldPath = str_replace(asset('storage/'), '', $product->image);
                Storage::disk('public')->delete($oldPath);
            }
            
            $path = $request->file('image')->store('products', 'public');
            $validated['image'] = asset('storage/' . $path);
        }

        $product->update($validated);
        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        if ($product->profile->user_id !== Auth::id()) return abort(403);
        
        if ($product->image) {
            $path = str_replace(asset('storage/'), '', $product->image);
            Storage::disk('public')->delete($path);
        }
        
        $product->delete();
        return response()->json(['message' => 'Deleted']);
    }
}