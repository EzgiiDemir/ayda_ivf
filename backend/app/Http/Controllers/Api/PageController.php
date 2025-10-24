<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PageController extends Controller
{
    /**
     * PUBLIC: Frontend için slug ile sayfa getir (locale ile)
     * GET /api/pages/slug/{slug}?locale=tr
     */
    public function getBySlug(Request $request, $slug)
    {
        $locale = $request->get('locale', 'tr');

        $page = Page::where('slug', $slug)
            ->where('locale', $locale)
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
     * PUBLIC: Tüm published sayfaları listele (locale ile)
     * GET /api/pages?locale=tr
     */
    public function getAllPages(Request $request)
    {
        $locale = $request->get('locale', 'tr');

        $pages = Page::where('status', 'published')
            ->where('locale', $locale)
            ->select('id', 'title', 'slug', 'subtitle', 'locale')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $pages
        ]);
    }

    /**
     * ADMIN: Sayfa listesi
     * GET /api/admin/pages
     */
    public function index(Request $request)
    {
        $query = Page::with('author:id,name,email')
            ->whereNull('parent_id'); // Only show parent pages

        if ($request->has('search') && $request->search) {
            $query->where(function($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                    ->orWhere('slug', 'like', "%{$request->search}%")
                    ->orWhere('subtitle', 'like', "%{$request->search}%");
            });
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('author_id')) {
            $query->where('author_id', $request->author_id);
        }

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
            ],
        ]);
    }

    /**
     * ADMIN: Tek sayfa detayı (locale bazlı)
     * GET /api/admin/pages/{id}?locale=tr
     */
    public function show(Request $request, $id)
    {
        $locale = $request->get('locale', 'tr');

        Log::info("🔍 Fetching page", ['id' => $id, 'locale' => $locale]);

        $page = Page::where('id', $id)
            ->where('locale', $locale)
            ->with('author:id,name,email')
            ->first();

        if (!$page) {
            $parent = Page::find($id);
            if ($parent && $parent->locale !== $locale) {
                $page = Page::where('parent_id', $parent->parent_id ?: $parent->id)
                    ->where('locale', $locale)
                    ->first();
            }
        }

        if (!$page) {
            Log::warning("⚠️ Page not found for locale", ['id' => $id, 'locale' => $locale]);

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $id,
                    'locale' => $locale,
                    'title' => '',
                    'subtitle' => '',
                    'slug' => '',
                    'content' => '',
                    'heroImage' => '',
                    'metaTitle' => '',
                    'metaDescription' => '',
                    'status' => 'draft',
                ],
            ]);
        }

        Log::info("✅ Page found", ['id' => $page->id, 'locale' => $page->locale, 'title' => $page->title]);

        return response()->json([
            'success' => true,
            'data' => $page,
        ]);
    }

    /**
     * ADMIN: Yeni sayfa oluştur (multi-language)
     * POST /api/admin/pages
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'locale' => 'required|string|size:2',
            'title' => 'required|string|max:255',
            'subtitle' => 'required|string|max:500',
            'slug' => 'nullable|string',
            'content' => 'required',
            'heroImage' => 'required|string',
            'metaTitle' => 'nullable|string|max:60',
            'metaDescription' => 'nullable|string|max:160',
            'status' => 'required|in:published,draft',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $existingPage = Page::where('slug', $validated['slug'])
            ->where('locale', $validated['locale'])
            ->first();

        if ($existingPage) {
            $validated['slug'] = $validated['slug'] . '-' . time();
        }

        $validated['author_id'] = $request->user()->id;

        $page = Page::create($validated);

        Log::info("✅ Page created", ['id' => $page->id, 'locale' => $page->locale]);

        return response()->json([
            'success' => true,
            'message' => 'Sayfa başarıyla oluşturuldu',
            'data' => $page->load('author'),
        ], 201);
    }

    /**
     * ADMIN: Sayfayı güncelle (multi-language)
     * PUT /api/admin/pages/{id}
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'locale' => 'required|string|size:2',
            'title' => 'required|string|max:255',
            'subtitle' => 'required|string|max:500',
            'slug' => 'nullable|string',
            'content' => 'required',
            'heroImage' => 'required|string',
            'metaTitle' => 'nullable|string|max:60',
            'metaDescription' => 'nullable|string|max:160',
            'status' => 'required|in:published,draft',
        ]);

        $locale = $validated['locale'];

        Log::info("🔥 Updating page", ['id' => $id, 'locale' => $locale]);

        $page = Page::where('id', $id)
            ->where('locale', $locale)
            ->first();

        if (!$page) {
            $parent = Page::find($id);

            if ($parent) {
                $page = Page::where('parent_id', $parent->parent_id ?: $parent->id)
                    ->where('locale', $locale)
                    ->first();

                if (!$page) {
                    $validated['parent_id'] = $parent->parent_id ?: $parent->id;
                    $validated['author_id'] = $request->user()->id;

                    if (empty($validated['slug'])) {
                        $validated['slug'] = Str::slug($validated['title']);
                    }

                    $page = Page::create($validated);

                    Log::info("✅ Translation created", ['id' => $page->id, 'locale' => $locale, 'parent_id' => $validated['parent_id']]);

                    return response()->json([
                        'success' => true,
                        'message' => "Sayfa çevirisi oluşturuldu (locale: {$locale})",
                        'data' => $page->load('author'),
                    ]);
                }
            }
        }

        if (!$page) {
            return response()->json([
                'success' => false,
                'message' => 'Sayfa bulunamadı',
            ], 404);
        }

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $existingPage = Page::where('slug', $validated['slug'])
            ->where('locale', $locale)
            ->where('id', '!=', $page->id)
            ->first();

        if ($existingPage) {
            $validated['slug'] = $validated['slug'] . '-' . time();
        }

        $page->update($validated);

        Log::info("✅ Page updated", ['id' => $page->id, 'locale' => $locale]);

        return response()->json([
            'success' => true,
            'message' => "Sayfa güncellendi (locale: {$locale})",
            'data' => $page->load('author'),
        ]);
    }

    /**
     * ADMIN: Sayfayı sil (tüm dilleri)
     * DELETE /api/admin/pages/{id}
     */
    public function destroy($id)
    {
        $page = Page::findOrFail($id);

        if ($page->parent_id) {
            $page->delete();
        } else {
            Page::where('parent_id', $page->id)->delete();
            $page->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Sayfa başarıyla silindi',
        ]);
    }
}
