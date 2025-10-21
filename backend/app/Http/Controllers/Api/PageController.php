<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PageController extends Controller
{
    /**
     * PUBLIC: Frontend için slug ile sayfa getir
     */
    public function getBySlug($slug)
    {
        $page = Page::where('slug', $slug)
            ->where('status', 'published')
            ->with('author:id,name,email')
            ->first();

        if (!$page) {
            return response()->json([
                'success' => false,
                'message' => 'Sayfa bulunamadı'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $page
        ]);
    }

    /**
     * PUBLIC: Tüm published sayfaları listele
     */
    public function getAllPages()
    {
        $pages = Page::where('status', 'published')
            ->select('id', 'title', 'slug', 'subtitle')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $pages
        ]);
    }

    /**
     * ADMIN: Sayfa listesi (pagination, search, filter)
     */
    public function index(Request $request)
    {
        $query = Page::with('author:id,name,email');

        // Search
        if ($request->has('search') && $request->search) {
            $query->where(function($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                    ->orWhere('slug', 'like', "%{$request->search}%")
                    ->orWhere('subtitle', 'like', "%{$request->search}%");
            });
        }

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by author
        if ($request->has('author_id')) {
            $query->where('author_id', $request->author_id);
        }

        // Sorting
        $sortBy = $request->get('sortBy', 'updated_at');
        $sortOrder = $request->get('sortOrder', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $pages = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $pages->items(),
            'meta' => [
                'total' => $pages->total(),
                'perPage' => $pages->perPage(),
                'currentPage' => $pages->currentPage(),
                'lastPage' => $pages->lastPage(),
                'from' => $pages->firstItem(),
                'to' => $pages->lastItem(),
            ],
            'links' => [
                'first' => $pages->url(1),
                'last' => $pages->url($pages->lastPage()),
                'prev' => $pages->previousPageUrl(),
                'next' => $pages->nextPageUrl(),
            ],
        ]);
    }

    /**
     * ADMIN: Tek sayfa detayı
     */
    public function show($id)
    {
        $page = Page::with('author:id,name,email')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $page,
        ]);
    }

    /**
     * ADMIN: Yeni sayfa oluştur
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'required|string|max:500',
            'slug' => 'nullable|string|unique:pages,slug',
            'content' => 'required',
            'heroImage' => 'required|string',
            'metaTitle' => 'nullable|string|max:60',
            'metaDescription' => 'nullable|string|max:160',
            'status' => 'required|in:published,draft',
        ]);

        // Generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        // Author ID
        $validated['author_id'] = $request->user()->id;

        $page = Page::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Sayfa başarıyla oluşturuldu',
            'data' => $page->load('author'),
        ], 201);
    }

    /**
     * ADMIN: Sayfayı güncelle
     */
    public function update(Request $request, $id)
    {
        $page = Page::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'required|string|max:500',
            'slug' => 'nullable|string|unique:pages,slug,' . $id,
            'content' => 'required',
            'heroImage' => 'required|string',
            'metaTitle' => 'nullable|string|max:60',
            'metaDescription' => 'nullable|string|max:160',
            'status' => 'required|in:published,draft',
        ]);

        // Generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $page->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Sayfa başarıyla güncellendi',
            'data' => $page->load('author'),
        ]);
    }

    /**
     * ADMIN: Sayfayı sil
     */
    public function destroy($id)
    {
        $page = Page::findOrFail($id);
        $page->delete();

        return response()->json([
            'success' => true,
            'message' => 'Sayfa başarıyla silindi',
        ]);
    }

    /**
     * ADMIN: Toplu silme
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required|integer|exists:pages,id',
        ]);

        Page::whereIn('id', $request->ids)->delete();

        return response()->json([
            'success' => true,
            'message' => count($request->ids) . ' sayfa başarıyla silindi',
        ]);
    }
}
