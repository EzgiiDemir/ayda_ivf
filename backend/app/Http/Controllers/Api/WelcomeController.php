<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Welcome;
use Illuminate\Http\Request;

class WelcomeController extends Controller
{
    public function index(Request $request)
    {
        $locale = $request->get('locale', 'tr');
        $welcome = Welcome::where('locale', $locale)->first();

        if (!$welcome) {
            $welcome = Welcome::where('locale', 'tr')->first();
        }

        if (!$welcome) {
            return response()->json([
                'success' => true,
                'data' => [
                    'locale' => $locale,
                    'image' => ['url' => '', 'alt' => '', 'width' => 400, 'height' => 400],
                    'gradient' => ['from' => '#F7DFE6', 'via' => '#FFFFFF', 'to' => '#FFFFFF'],
                    'title_top' => '',
                    'title' => '',
                    'paragraphs' => ['', '', '', '', ''],
                    'signature_name' => '',
                    'signature_title' => '',
                ]
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'locale' => $welcome->locale,
                'image' => $welcome->image ?? ['url' => '', 'alt' => '', 'width' => 400, 'height' => 400],
                'gradient' => $welcome->gradient ?? ['from' => '#F7DFE6', 'via' => '#FFFFFF', 'to' => '#FFFFFF'],
                'title_top' => $welcome->title_top ?? '',
                'title' => $welcome->title ?? '',
                'paragraphs' => $welcome->paragraphs ?? ['', '', '', '', ''],
                'signature_name' => $welcome->signature_name ?? '',
                'signature_title' => $welcome->signature_title ?? '',
            ]
        ]);
    }
    public function update(Request $request)
    {
        $validated = $request->validate([
            'locale' => 'nullable|string|size:2',
            'image' => 'nullable|array',
            'image.url' => 'nullable|string',
            'image.alt' => 'nullable|string',
            'image.width' => 'nullable|integer',
            'image.height' => 'nullable|integer',
            'gradient' => 'nullable|array',
            'gradient.from' => 'nullable|string',
            'gradient.via' => 'nullable|string',
            'gradient.to' => 'nullable|string',
            'title_top' => 'nullable|string',
            'title' => 'nullable|string',
            'paragraphs' => 'nullable|array',
            'signature_name' => 'nullable|string',
            'signature_title' => 'nullable|string',
        ]);

        $locale = $validated['locale'] ?? 'tr';
        unset($validated['locale']);

        $validated = array_filter($validated, function($value) {
            return $value !== null && $value !== '';
        });

        $welcome = Welcome::updateOrCreate(
            ['locale' => $locale],
            $validated
        );

        return response()->json([
            'success' => true,
            'message' => 'Welcome section güncellendi',
            'data' => $welcome
        ]);
    }
}
