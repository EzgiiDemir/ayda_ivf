<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FooterConfig;
use App\Models\FooterSocialLink;
use App\Models\FooterQuickLink;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class FooterController extends Controller
{
    /**
     * Footer yapılandırmasını getir (Public)
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $locale = $request->input('locale', 'tr');

            $config = FooterConfig::where('locale', $locale)
                ->with(['socialLinks' => fn($q) => $q->where('is_active', true)->orderBy('order')])
                ->with(['quickLinks' => fn($q) => $q->where('is_active', true)->orderBy('order')])
                ->first();

            if (!$config) {
                return response()->json([
                    'success' => true,
                    'data' => null,
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => $this->transformConfig($config),
            ]);
        } catch (\Exception $e) {
            Log::error('Footer index error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Footer verileri yüklenirken hata oluştu',
            ], 500);
        }
    }

    /**
     * Footer yapılandırmasını güncelle (Admin)
     */
    public function update(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'locale' => 'required|string|in:tr,en',
                'address_icon' => 'nullable|string',
                'address_iso_logo' => 'nullable|string',
                'address_text' => 'nullable|string',
                'address_title' => 'nullable|string',
                'contact_icon' => 'nullable|string',
                'contact_title' => 'nullable|string',
                'contact_phone' => 'nullable|string',
                'contact_phone_link' => 'nullable|string',
                'contact_email' => 'nullable|email',
                'contact_email_link' => 'nullable|string',
                'quick_access_icon' => 'nullable|string',
                'quick_access_title' => 'nullable|string',
                'copyright_logo' => 'nullable|string',
                'copyright_text' => 'nullable|string',
                'social_links' => 'nullable|array',
                'social_links.*.platform' => 'required|string',
                'social_links.*.url' => 'required|url',
                'social_links.*.order' => 'required|integer|min:1',
                'social_links.*.is_active' => 'required|boolean',
                'quick_links' => 'nullable|array',
                'quick_links.*.label' => 'required|string',
                'quick_links.*.href' => 'required|string',
                'quick_links.*.order' => 'required|integer|min:1',
                'quick_links.*.is_active' => 'required|boolean',
            ]);

            DB::beginTransaction();

            $config = FooterConfig::updateOrCreate(
                ['locale' => $validated['locale']],
                [
                    'address_icon' => $validated['address_icon'] ?? null,
                    'address_iso_logo' => $validated['address_iso_logo'] ?? null,
                    'address_text' => $validated['address_text'] ?? null,
                    'address_title' => $validated['address_title'] ?? null,
                    'contact_icon' => $validated['contact_icon'] ?? null,
                    'contact_title' => $validated['contact_title'] ?? null,
                    'contact_phone' => $validated['contact_phone'] ?? null,
                    'contact_phone_link' => $validated['contact_phone_link'] ?? null,
                    'contact_email' => $validated['contact_email'] ?? null,
                    'contact_email_link' => $validated['contact_email_link'] ?? null,
                    'quick_access_icon' => $validated['quick_access_icon'] ?? null,
                    'quick_access_title' => $validated['quick_access_title'] ?? null,
                    'copyright_logo' => $validated['copyright_logo'] ?? null,
                    'copyright_text' => $validated['copyright_text'] ?? null,
                ]
            );

            $config->socialLinks()->delete();
            $config->quickLinks()->delete();

            if (!empty($validated['social_links'])) {
                foreach ($validated['social_links'] as $link) {
                    FooterSocialLink::create([
                        'footer_config_id' => $config->id,
                        'platform' => $link['platform'],
                        'url' => $link['url'],
                        'order' => $link['order'],
                        'is_active' => $link['is_active'],
                    ]);
                }
            }

            if (!empty($validated['quick_links'])) {
                foreach ($validated['quick_links'] as $link) {
                    FooterQuickLink::create([
                        'footer_config_id' => $config->id,
                        'label' => $link['label'],
                        'href' => $link['href'],
                        'order' => $link['order'],
                        'is_active' => $link['is_active'],
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Footer başarıyla güncellendi',
                'data' => [
                    'social_links_count' => count($validated['social_links'] ?? []),
                    'quick_links_count' => count($validated['quick_links'] ?? []),
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
            Log::error('Footer update error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Footer güncellenirken hata oluştu',
            ], 500);
        }
    }

    /**
     * Config'i frontend için uygun formata dönüştür
     */
    private function transformConfig(FooterConfig $config): array
    {
        return [
            'address' => [
                'icon' => $config->address_icon,
                'iso_logo' => $config->address_iso_logo,
                'text' => $config->address_text,
                'title' => $config->address_title,
            ],
            'contact' => [
                'icon' => $config->contact_icon,
                'title' => $config->contact_title,
                'phone' => $config->contact_phone,
                'phone_link' => $config->contact_phone_link,
                'email' => $config->contact_email,
                'email_link' => $config->contact_email_link,
                'social_links' => $config->socialLinks->map(fn($link) => [
                    'id' => $link->id,
                    'platform' => $link->platform,
                    'url' => $link->url,
                    'order' => $link->order,
                    'is_active' => $link->is_active,
                ])->toArray(),
            ],
            'quick_access' => [
                'icon' => $config->quick_access_icon,
                'title' => $config->quick_access_title,
                'links' => $config->quickLinks->map(fn($link) => [
                    'id' => $link->id,
                    'label' => $link->label,
                    'href' => $link->href,
                    'order' => $link->order,
                    'is_active' => $link->is_active,
                ])->toArray(),
            ],
            'copyright_logo' => $config->copyright_logo,
            'copyright_text' => $config->copyright_text,
        ];
    }
}
