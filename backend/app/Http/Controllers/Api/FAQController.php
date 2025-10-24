<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FAQPage;
use App\Models\FAQ;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class FAQController extends Controller
{
    /**
     * FAQ sayfası verilerini getir (Public)
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $locale = $request->input('locale', 'tr');

            $faqPage = FAQPage::where('locale', $locale)->first();

            $faqs = FAQ::where('locale', $locale)
                ->where('is_active', true)
                ->orderBy('order')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'locale' => $locale,
                    'hero_image' => $faqPage->hero_image ?? null,
                    'page_title' => $faqPage->page_title ?? null,
                    'page_subtitle' => $faqPage->page_subtitle ?? null,
                    'empty_message' => $faqPage->empty_message ?? null,
                    'faqs' => $faqs,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('FAQ index error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'FAQ verileri yüklenirken hata oluştu',
            ], 500);
        }
    }

    /**
     * FAQ sayfasını güncelle (Admin)
     */
    public function update(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'locale' => 'required|string|in:tr,en',
                'hero_image' => 'nullable|string',
                'page_title' => 'nullable|string',
                'page_subtitle' => 'nullable|string',
                'empty_message' => 'nullable|string',
                'faqs' => 'nullable|array',
                'faqs.*.question' => 'required|string',
                'faqs.*.answer' => 'required|string',
                'faqs.*.order' => 'required|integer|min:1',
                'faqs.*.is_active' => 'required|boolean',
            ]);

            DB::beginTransaction();

            $faqPage = FAQPage::updateOrCreate(
                ['locale' => $validated['locale']],
                [
                    'hero_image' => $validated['hero_image'] ?? null,
                    'page_title' => $validated['page_title'] ?? null,
                    'page_subtitle' => $validated['page_subtitle'] ?? null,
                    'empty_message' => $validated['empty_message'] ?? null,
                ]
            );

            FAQ::where('locale', $validated['locale'])->delete();

            if (!empty($validated['faqs'])) {
                foreach ($validated['faqs'] as $faqData) {
                    FAQ::create([
                        'locale' => $validated['locale'],
                        'question' => $faqData['question'],
                        'answer' => $faqData['answer'],
                        'order' => $faqData['order'],
                        'is_active' => $faqData['is_active'],
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'FAQ sayfası başarıyla güncellendi',
                'data' => [
                    'page' => $faqPage,
                    'faqs_count' => count($validated['faqs'] ?? []),
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
            Log::error('FAQ update error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'FAQ güncellenirken hata oluştu',
            ], 500);
        }
    }
}
