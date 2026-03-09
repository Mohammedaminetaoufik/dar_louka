<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GalleryImage;
use Illuminate\Http\Request;

class GalleryApiController extends Controller
{
    public function index(Request $request)
    {
        $query = GalleryImage::orderBy('created_at', 'desc');

        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|string',
        ]);

        $image = GalleryImage::create([
            'title_en' => $request->title_en,
            'title_fr' => $request->title_fr,
            'description_en' => $request->description_en,
            'description_fr' => $request->description_fr,
            'image' => $request->image,
            'category' => $request->category,
        ]);

        return response()->json($image, 201);
    }

    public function update(Request $request, $id)
    {
        $image = GalleryImage::findOrFail($id);
        $image->update([
            'title_en' => $request->title_en,
            'title_fr' => $request->title_fr,
            'description_en' => $request->description_en,
            'description_fr' => $request->description_fr,
            'image' => $request->image ?? $image->image,
            'category' => $request->category,
        ]);

        return response()->json($image);
    }

    public function destroy($id)
    {
        GalleryImage::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }
}
