<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Treatment;
use Illuminate\Http\Request;

class TreatmentsController extends Controller
{
    // Public: Frontend için
    public function index(Request $request)
    {
        $locale = $request->get('locale', 'tr');
        $treatment = Treatment::where('locale', $locale)->first();

        if (!$treatment) {
            $treatment = Treatment::where('locale', 'tr')->first();
        }

        if (!$treatment) {
            return response()->json([
                'success' => true,
                'data' => [
                    'locale' => $locale,
                    'background_logo' => '',
                    'treatments' => [],
                    'top_title' => '',
                    'title' => '',
                    'description1' => '',
                    'description2' => '',
                    'contact_button_text' => '',
                ]
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'locale' => $treatment->locale,
                'background_logo' => $treatment->background_logo ?? '',
                'treatments' => $treatment->treatments ?? [],
                'top_title' => $treatment->top_title ?? '',
                'title' => $treatment->title ?? '',
                'description1' => $treatment->description1 ?? '',
                'description2' => $treatment->description2 ?? '',
                'contact_button_text' => $treatment->contact_button_text ?? '',
            ]
        ]);
    }

    // Admin: Güncelleme
    public function update(Request $request)
    {
        $validated = $request->validate([
            'locale' => 'nullable|string|size:2',
            'background_logo' => 'nullable|string',
            'treatments' => 'nullable|array',
            'treatments.*.id' => 'nullable|string',
            'treatments.*.href' => 'nullable|string',
            'treatments.*.label' => 'nullable|string',
            'treatments.*.order' => 'nullable|integer',
            'treatments.*.isActive' => 'nullable|boolean',
            'top_title' => 'nullable|string',
            'title' => 'nullable|string',
            'description1' => 'nullable|string',
            'description2' => 'nullable|string',
            'contact_button_text' => 'nullable|string',
        ]);

        $locale = $validated['locale'] ?? 'tr';
        unset($validated['locale']);

        $validated = array_filter($validated, function($value) {
            return $value !== null && $value !== '';
        });

        $treatment = Treatment::updateOrCreate(
            ['locale' => $locale],
            $validated
        );

        return response()->json([
            'success' => true,
            'message' => 'Treatments section güncellendi',
            'data' => $treatment
        ]);
    }
}
