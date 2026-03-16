<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|image|max:5120', // 5MB max
            'folder' => 'nullable|string|in:rooms',
        ]);

        $file = $request->file('file');
        $folder = $request->input('folder') === 'rooms' ? 'rooms' : '';

        // On shared hosting with split layout, DOCUMENT_ROOT points to public_html.
        $documentRoot = rtrim((string) $request->server('DOCUMENT_ROOT', ''), DIRECTORY_SEPARATOR);
        $uploadsRoot = $documentRoot !== '' ? $documentRoot . DIRECTORY_SEPARATOR . 'uploads' : public_path('uploads');

        $targetDir = $folder
            ? $uploadsRoot . DIRECTORY_SEPARATOR . $folder
            : $uploadsRoot;

        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0755, true);
        }

        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeBase = Str::slug($originalName);
        if ($safeBase === '') {
            $safeBase = 'image';
        }
        $extension = strtolower($file->getClientOriginalExtension() ?: 'jpg');
        $filename = time() . '-' . Str::random(6) . '-' . $safeBase . '.' . $extension;
        $file->move($targetDir, $filename);
        $url = $folder ? '/uploads/' . $folder . '/' . $filename : '/uploads/' . $filename;

        return response()->json([
            'success' => true,
            'folder' => $folder ?: null,
            'url' => $url,
            'filename' => $filename,
        ]);
    }
}
