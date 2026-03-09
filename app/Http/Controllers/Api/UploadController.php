<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|image|max:5120', // 5MB max
        ]);

        $file = $request->file('file');
        $filename = time() . '-' . $file->getClientOriginalName();
        $file->move(public_path('uploads'), $filename);

        return response()->json([
            'success' => true,
            'url' => '/uploads/' . $filename,
            'filename' => $filename,
        ]);
    }
}
