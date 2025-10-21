<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMap;
use Illuminate\Http\Request;

class ContactMapController extends Controller
{
    public function index(Request $request)
    {
        $locale = $request->get('locale', 'tr');
        $contactMap = ContactMap::where('locale', $locale)->first();

        if (!$contactMap) {
            $contactMap = ContactMap::where('locale', 'tr')->first();
        }

        if (!$contactMap) {
            return response()->json([
                'success' => true,
                'data' => [
                    'locale' => $locale,
                    'show_iframe' => true,
                    'map_url' => '',
                    'image' => '',
                ]
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'locale' => $contactMap->locale,
                'show_iframe' => (bool) ($contactMap->show_iframe ?? true),
                'map_url' => $contactMap->map_url ?? '',
                'image' => $contactMap->image ?? '',
            ]
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'locale' => 'nullable|string|size:2',
            'show_iframe' => 'nullable|boolean',
            'map_url' => 'nullable|string',
            'image' => 'nullable|string',
        ]);

        $locale = $validated['locale'] ?? 'tr';
        unset($validated['locale']);

        $validated = array_filter($validated, function($value) {
            return $value !== null && $value !== '';
        });

        $contactMap = ContactMap::updateOrCreate(
            ['locale' => $locale],
            $validated
        );

        return response()->json([
            'success' => true,
            'message' => 'Contact Map section güncellendi',
            'data' => $contactMap
        ]);
    }
}
