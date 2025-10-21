<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Tüm ayarları getir
     */
    public function index()
    {
        $settings = [
            'general' => Setting::getGroup('general'),
            'seo' => Setting::getGroup('seo'),
            'social' => Setting::getGroup('social'),
        ];

        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }

    /**
     * GET: Genel ayarları getir
     */
    public function getGeneral()
    {
        return response()->json([
            'success' => true,
            'data' => Setting::getGroup('general'),
        ]);
    }

    /**
     * GET: SEO ayarlarını getir
     */
    public function getSeo()
    {
        return response()->json([
            'success' => true,
            'data' => Setting::getGroup('seo'),
        ]);
    }

    /**
     * GET: Sosyal medya ayarlarını getir
     */
    public function getSocial()
    {
        return response()->json([
            'success' => true,
            'data' => Setting::getGroup('social'),
        ]);
    }

    /**
     * PUT: Genel ayarları güncelle
     */
    public function updateGeneral(Request $request)
    {
        $validated = $request->validate([
            'siteName' => 'required|string|max:255',
            'siteDescription' => 'nullable|string',
            'siteUrl' => 'required|url',
            'adminEmail' => 'required|email',
            'logo' => 'nullable|string',
            'favicon' => 'nullable|string',
            'timezone' => 'required|string',
            'language' => 'required|string|max:2',
        ]);

        foreach ($validated as $key => $value) {
            Setting::set($key, $value, 'string', 'general');
        }

        return response()->json([
            'success' => true,
            'message' => 'Genel ayarlar başarıyla güncellendi',
            'data' => Setting::getGroup('general'),
        ]);
    }

    /**
     * PUT: SEO ayarlarını güncelle
     */
    public function updateSeo(Request $request)
    {
        $validated = $request->validate([
            'metaTitle' => 'nullable|string|max:255',
            'metaDescription' => 'nullable|string',
            'metaKeywords' => 'nullable|string',
            'googleAnalytics' => 'nullable|string',
            'googleSearchConsole' => 'nullable|string',
        ]);

        foreach ($validated as $key => $value) {
            Setting::set($key, $value, 'string', 'seo');
        }

        return response()->json([
            'success' => true,
            'message' => 'SEO ayarları başarıyla güncellendi',
            'data' => Setting::getGroup('seo'),
        ]);
    }

    /**
     * PUT: Sosyal medya ayarlarını güncelle
     */
    public function updateSocial(Request $request)
    {
        $validated = $request->validate([
            'facebook' => 'nullable|url',
            'twitter' => 'nullable|url',
            'instagram' => 'nullable|url',
            'linkedin' => 'nullable|url',
            'youtube' => 'nullable|url',
        ]);

        foreach ($validated as $key => $value) {
            Setting::set($key, $value, 'string', 'social');
        }

        return response()->json([
            'success' => true,
            'message' => 'Sosyal medya ayarları başarıyla güncellendi',
            'data' => Setting::getGroup('social'),
        ]);
    }
}
