<?php
// app/Http/Controllers/Api/FAQController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FAQPage;
use App\Models\FAQ;
use Illuminate\Http\Request;

class FAQController extends Controller
{
    // Public: Get FAQ page data
    public function index(Request $request)
    {
        $locale = $request->get('locale', 'tr');
        $faqPage = FAQPage::where('locale', $locale)->first();

        if (!$faqPage) {
            $faqPage = FAQPage::where('locale', 'tr')->first();
        }

        $faqs = FAQ::where('locale', $locale)
            ->where('is_active', true)
            ->orderBy('order')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'locale' => $locale,
                'hero_image' => $faqPage->hero_image ?? 'https://api.aydaivf.com/uploads/elitebig_7bc1166778.jpg',
                'faqs' => $faqs,
            ]
        ]);
    }

    // Admin: Update FAQ page
    public function update(Request $request)
    {
        $validated = $request->validate([
            'locale' => 'nullable|string|size:2',
            'hero_image' => 'nullable|string',
            'faqs' => 'nullable|array',
            'faqs.*.id' => 'nullable|integer',
            'faqs.*.question' => 'required|string',
            'faqs.*.answer' => 'required|string',
            'faqs.*.order' => 'nullable|integer',
            'faqs.*.is_active' => 'nullable|boolean',
        ]);

        $locale = $validated['locale'] ?? 'tr';

        // Update/Create page
        $faqPage = FAQPage::updateOrCreate(
            ['locale' => $locale],
            ['hero_image' => $validated['hero_image'] ?? '']
        );

        // Delete old FAQs for this locale
        FAQ::where('locale', $locale)->delete();

        // Create new FAQs
        if (isset($validated['faqs'])) {
            foreach ($validated['faqs'] as $faqData) {
                FAQ::create([
                    'locale' => $locale,
                    'question' => $faqData['question'],
                    'answer' => $faqData['answer'],
                    'order' => $faqData['order'] ?? 0,
                    'is_active' => $faqData['is_active'] ?? true,
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'FAQ sayfası başarıyla güncellendi',
        ]);
    }
}
