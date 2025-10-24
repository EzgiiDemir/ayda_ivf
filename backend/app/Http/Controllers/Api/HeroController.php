<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Hero;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class HeroController extends Controller
{
    /**
     * Hero section verilerini getir (Public)
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $locale = $request->input('locale', 'tr');

            $hero = Hero::where('locale', $locale)->first();

            if (!$hero) {
                return response()->json([
                    'success' => true,
                    'data' => null,
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'locale' => $hero->locale,
                    'slides' => $hero->slides ?? [],
                    'rightText' => $hero->right_text,
                    'bottomText' => $hero->bottom_text,
                    'dotsPattern' => $hero->dots_pattern,
                    'autoPlay' => $hero->auto_play,
                    'autoPlayInterval' => $hero->auto_play_interval,
                    'showIndicators' => $hero->show_indicators,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Hero index error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Hero verileri yüklenirken hata oluştu',
            ], 500);
        }
    }

    /**
     * Hero section'ı güncelle (Admin)
     */
    public function update(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'locale' => 'required|string|in:tr,en',
                'slides' => 'nullable|array',
                'slides.*.image' => 'required|array',
                'slides.*.image.url' => 'required|string',
                'slides.*.image.alt' => 'nullable|string',
                'slides.*.title' => 'nullable|string',
                'slides.*.subtitle' => 'nullable|string',
                'slides.*.overlayOpacity' => 'nullable|numeric|min:0|max:1',
                'right_text' => 'nullable|string',
                'bottom_text' => 'nullable|string',
                'dots_pattern' => 'nullable|string',
                'auto_play' => 'nullable|boolean',
                'auto_play_interval' => 'nullable|integer|min:1000|max:30000',
                'show_indicators' => 'nullable|boolean',
            ]);

            DB::beginTransaction();

            $hero = Hero::updateOrCreate(
                ['locale' => $validated['locale']],
                [
                    'slides' => $validated['slides'] ?? [],
                    'right_text' => $validated['right_text'] ?? null,
                    'bottom_text' => $validated['bottom_text'] ?? null,
                    'dots_pattern' => $validated['dots_pattern'] ?? null,
                    'auto_play' => $validated['auto_play'] ?? true,
                    'auto_play_interval' => $validated['auto_play_interval'] ?? 5000,
                    'show_indicators' => $validated['show_indicators'] ?? true,
                ]
            );

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Hero section başarıyla güncellendi',
                'data' => [
                    'slides_count' => count($validated['slides'] ?? []),
                ],
            ]);

        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Doğrulama hatası',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Hero update error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Hero güncellenirken hata oluştu',
            ], 500);
        }
    }
}
