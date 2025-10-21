<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Hero;
use Illuminate\Http\Request;

class HeroController extends Controller
{
    // Public: Frontend için
    public function index(Request $request)
    {
        $locale = $request->get('locale', 'tr');
        $hero = Hero::where('locale', $locale)->first();

        if (!$hero) {
            $hero = Hero::where('locale', 'tr')->first();
        }

        if (!$hero) {
            return response()->json([
                'success' => true,
                'data' => [
                    'locale' => $locale,
                    'slides' => [],
                    'right_text' => 'FERTILITY CLINIC',
                    'bottom_text' => 'creating miracles',
                    'dots_pattern' => '',
                    'auto_play' => true,
                    'auto_play_interval' => 5000,
                    'show_indicators' => true,
                ]
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'locale' => $hero->locale,
                'slides' => $hero->slides ?? [],
                'rightText' => $hero->right_text ?? 'FERTILITY CLINIC',
                'bottomText' => $hero->bottom_text ?? 'creating miracles',
                'dotsPattern' => $hero->dots_pattern ?? '',
                'autoPlay' => (bool) ($hero->auto_play ?? true),
                'autoPlayInterval' => $hero->auto_play_interval ?? 5000,
                'showIndicators' => (bool) ($hero->show_indicators ?? true),
                'showControls' => false,
                'showCounter' => false,
                'mobileHeight' => 'calc(70dvh - 80px)',
                'desktopHeight' => 'calc(100dvh - 80px)',
            ]
        ]);
    }
    public function update(Request $request)
    {
        // Validation - locale varsayılan 'tr'
        $validated = $request->validate([
            'locale' => 'nullable|string|size:2',
            'slides' => 'nullable|array',
            'slides.*.image' => 'sometimes|array',
            'slides.*.image.url' => 'sometimes|string',
            'slides.*.image.alt' => 'nullable|string',
            'slides.*.title' => 'nullable|string',
            'slides.*.subtitle' => 'nullable|string',
            'dots_pattern' => 'nullable|string',
            'auto_play' => 'nullable|boolean',
            'auto_play_interval' => 'nullable|integer|min:1000',
            'show_indicators' => 'nullable|boolean',
            'right_text' => 'nullable|string',
            'bottom_text' => 'nullable|string',
        ]);

        // Locale yoksa default 'tr'
        $locale = $validated['locale'] ?? 'tr';
        unset($validated['locale']);

        // Boş değerleri temizle
        $validated = array_filter($validated, function($value) {
            return $value !== null && $value !== '';
        });

        $hero = Hero::updateOrCreate(
            ['locale' => $locale],
            $validated
        );

        return response()->json([
            'success' => true,
            'message' => 'Hero section güncellendi',
            'data' => $hero
        ]);
    }
}
