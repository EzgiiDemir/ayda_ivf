<?php
// app/Http/Controllers/Api/FooterController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FooterConfig;
use App\Models\FooterSocialLink;
use App\Models\FooterQuickLink;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FooterController extends Controller
{
    // Public: Get footer config
    public function index(Request $request)
    {
        $locale = $request->get('locale', 'tr');
        $config = FooterConfig::where('locale', $locale)
            ->with(['socialLinks', 'quickLinks'])
            ->first();

        if (!$config) {
            return response()->json([
                'success' => true,
                'data' => $this->getDefaultConfig($locale)
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $this->transformConfig($config)
        ]);
    }

    // Admin: Update footer config
    public function update(Request $request)
    {
        $validated = $request->validate([
            'locale' => 'nullable|string|size:2',
            'address_icon' => 'nullable|string',
            'address_iso_logo' => 'nullable|string',
            'address_text' => 'nullable|string',
            'contact_icon' => 'nullable|string',
            'contact_phone' => 'nullable|string',
            'contact_phone_link' => 'nullable|string',
            'contact_email' => 'nullable|string|email',
            'contact_email_link' => 'nullable|string',
            'quick_access_icon' => 'nullable|string',
            'copyright_logo' => 'nullable|string',
            'copyright_text' => 'nullable|string',
            'social_links' => 'nullable|array',
            'quick_links' => 'nullable|array',
        ]);

        $locale = $validated['locale'] ?? 'tr';

        DB::beginTransaction();
        try {
            // Update or create config
            $config = FooterConfig::updateOrCreate(
                ['locale' => $locale],
                [
                    'address_icon' => $validated['address_icon'] ?? null,
                    'address_iso_logo' => $validated['address_iso_logo'] ?? null,
                    'address_text' => $validated['address_text'] ?? null,
                    'contact_icon' => $validated['contact_icon'] ?? null,
                    'contact_phone' => $validated['contact_phone'] ?? null,
                    'contact_phone_link' => $validated['contact_phone_link'] ?? null,
                    'contact_email' => $validated['contact_email'] ?? null,
                    'contact_email_link' => $validated['contact_email_link'] ?? null,
                    'quick_access_icon' => $validated['quick_access_icon'] ?? null,
                    'copyright_logo' => $validated['copyright_logo'] ?? null,
                    'copyright_text' => $validated['copyright_text'] ?? null,
                ]
            );

            // Delete existing links
            $config->socialLinks()->delete();
            $config->quickLinks()->delete();

            // Create social links
            if (isset($validated['social_links'])) {
                foreach ($validated['social_links'] as $index => $link) {
                    FooterSocialLink::create([
                        'footer_config_id' => $config->id,
                        'platform' => $link['platform'],
                        'url' => $link['url'],
                        'order' => $index + 1,
                        'is_active' => $link['is_active'] ?? true,
                    ]);
                }
            }

            // Create quick links
            if (isset($validated['quick_links'])) {
                foreach ($validated['quick_links'] as $index => $link) {
                    FooterQuickLink::create([
                        'footer_config_id' => $config->id,
                        'label' => $link['label'],
                        'href' => $link['href'],
                        'order' => $index + 1,
                        'is_active' => $link['is_active'] ?? true,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Footer başarıyla güncellendi',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Güncelleme başarısız: ' . $e->getMessage(),
            ], 500);
        }
    }

    private function transformConfig($config)
    {
        return [
            'address' => [
                'icon' => $config->address_icon,
                'iso_logo' => $config->address_iso_logo,
                'text' => $config->address_text,
            ],
            'contact' => [
                'icon' => $config->contact_icon,
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

    private function getDefaultConfig($locale)
    {
        return [
            'address' => [
                'icon' => 'https://api.aydaivf.com/uploads/map_white_1bd6772a21.svg',
                'iso_logo' => 'https://api.aydaivf.com/uploads/iso1_659752db23.png',
                'text' => '',
            ],
            'contact' => [
                'icon' => 'https://api.aydaivf.com/uploads/phone_white_10236cf66a.svg',
                'phone' => '+90 533 123 4567',
                'phone_link' => 'tel:+905331234567',
                'email' => 'info@aydaivf.com',
                'email_link' => 'mailto:info@aydaivf.com',
                'social_links' => [],
            ],
            'quick_access' => [
                'icon' => 'https://api.aydaivf.com/uploads/link_white_8ce9830683.svg',
                'links' => [],
            ],
            'copyright_logo' => '',
            'copyright_text' => '',
        ];
    }
}
