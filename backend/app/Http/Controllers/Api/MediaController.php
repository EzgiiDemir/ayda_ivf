<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    public function index(Request $request)
    {
        $query = Media::with('uploader:id,name,email');

        // Search
        if ($request->has('search') && $request->search) {
            $query->search($request->search);
        }

        // Filter by type
        if ($request->has('type') && $request->type !== 'all') {
            switch ($request->type) {
                case 'image':
                    $query->images();
                    break;
                case 'video':
                    $query->videos();
                    break;
                case 'document':
                    $query->documents();
                    break;
            }
        }

        // Sorting
        $sortBy = $request->get('sortBy', 'created_at');
        $sortOrder = $request->get('sortOrder', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $media = $query->paginate($request->get('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $media->items(),
            'meta' => [
                'total' => $media->total(),
                'perPage' => $media->perPage(),
                'currentPage' => $media->currentPage(),
                'lastPage' => $media->lastPage(),
                'from' => $media->firstItem(),
                'to' => $media->lastItem(),
            ],
            'links' => [
                'first' => $media->url(1),
                'last' => $media->url($media->lastPage()),
                'prev' => $media->previousPageUrl(),
                'next' => $media->nextPageUrl(),
            ],
        ]);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'files' => 'required|array',
            'files.*' => 'required|file|max:10240', // Max 10MB
        ]);

        $uploadedFiles = [];

        foreach ($request->file('files') as $file) {
            // Generate unique filename
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();

            // Store file
            $path = $file->storeAs('media', $filename, 'public');

            // Create media record
            $media = Media::create([
                'name' => $file->getClientOriginalName(),
                'file_name' => $filename,
                'mime_type' => $file->getMimeType(),
                'path' => $path,
                'disk' => 'public',
                'size' => $file->getSize(),
                'uploaded_by' => $request->user()->id,
            ]);

            $uploadedFiles[] = $media;
        }

        return response()->json([
            'success' => true,
            'message' => count($uploadedFiles) . ' dosya başarıyla yüklendi',
            'data' => $uploadedFiles,
        ], 201);
    }

    public function show($id)
    {
        $media = Media::with('uploader:id,name,email')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $media,
        ]);
    }

    public function destroy($id)
    {
        $media = Media::findOrFail($id);

        // Delete file from storage
        if (Storage::disk($media->disk)->exists($media->path)) {
            Storage::disk($media->disk)->delete($media->path);
        }

        $media->delete();

        return response()->json([
            'success' => true,
            'message' => 'Medya dosyası başarıyla silindi',
        ]);
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required|integer|exists:media,id',
        ]);

        $media = Media::whereIn('id', $request->ids)->get();

        foreach ($media as $item) {
            // Delete file from storage
            if (Storage::disk($item->disk)->exists($item->path)) {
                Storage::disk($item->disk)->delete($item->path);
            }
            $item->delete();
        }

        return response()->json([
            'success' => true,
            'message' => count($request->ids) . ' medya dosyası başarıyla silindi',
        ]);
    }

}
