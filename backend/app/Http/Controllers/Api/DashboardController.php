<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\Media;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats()
    {
        $stats = [
            'totalPages' => Page::count(),
            'publishedPages' => Page::published()->count(),
            'draftPages' => Page::draft()->count(),
            'totalMedia' => Media::count(),
            'totalVisits' => 0, // Bu veriyi analytics'ten alabilirsiniz
            'activeUsers' => User::where('created_at', '>=', now()->subDays(30))->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    public function recentPages(Request $request)
    {
        $limit = $request->get('limit', 5);

        $pages = Page::with('author:id,name,email')
            ->orderBy('updated_at', 'desc')
            ->limit($limit)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $pages,
        ]);
    }

    public function recentActivity(Request $request)
    {
        $limit = $request->get('limit', 10);

        // Recent pages
        $recentPages = Page::with('author:id,name,email')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($page) {
                return [
                    'id' => $page->id,
                    'type' => 'page_created',
                    'title' => 'Yeni sayfa oluşturuldu',
                    'description' => $page->title,
                    'user' => $page->author,
                    'created_at' => $page->created_at,
                ];
            });

        // Recent media
        $recentMedia = Media::with('uploader:id,name,email')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($media) {
                return [
                    'id' => $media->id,
                    'type' => 'media_uploaded',
                    'title' => 'Medya dosyası yüklendi',
                    'description' => $media->name,
                    'user' => $media->uploader,
                    'created_at' => $media->created_at,
                ];
            });

        // Merge and sort
        $activities = $recentPages->concat($recentMedia)
            ->sortByDesc('created_at')
            ->take($limit)
            ->values();

        return response()->json([
            'success' => true,
            'data' => $activities,
        ]);
    }
}
