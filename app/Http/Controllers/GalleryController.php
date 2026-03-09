<?php

namespace App\Http\Controllers;

use App\Models\GalleryImage;

class GalleryController extends Controller
{
    public function index()
    {
        $images = GalleryImage::orderBy('created_at', 'desc')->get();
        return view('pages.gallery', compact('images'));
    }
}
