<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NavbarConfig;
use App\Models\NavbarDropdown;
use App\Models\NavbarLink;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class NavbarController extends Controller
{
    // Public: Get navbar config
    public function index(Request $request)
    {
        $locale = $request->get('locale', 'tr');
        $config = NavbarConfig::where('locale', $locale)
            ->with(['dropdowns.links', 'links'])
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

    // Admin: Update navbar config
    public function update(Request $request)
    {
        // ✅ VALIDATION EKLEDIM
        $validated = $request->validate([
            'locale' => 'nullable|string|size:2',
            'logo_url' => 'nullable|string',
            'logo_alt' => 'nullable|string',
            'logo_width' => 'nullable|integer',
            'logo_height' => 'nullable|integer',
            'phone_number' => 'nullable|string',
            'whatsapp_number' => 'nullable|string',
            'email' => 'nullable|string|email',
            'about' => 'nullable|array',
            'about.label' => 'required_with:about|string',
            'about.links' => 'nullable|array',
            'about.links.*.label' => 'required|string|max:255', // ✅ ZORUNLU
            'about.links.*.href' => 'required|string|max:255',  // ✅ ZORUNLU
            'about.links.*.order' => 'nullable|integer',
            'about.links.*.is_active' => 'nullable|boolean',
            'treatments' => 'nullable|array',
            'treatments.label' => 'required_with:treatments|string',
            'treatments.links' => 'nullable|array',
            'treatments.links.*.label' => 'required|string|max:255', // ✅ ZORUNLU
            'treatments.links.*.href' => 'required|string|max:255',  // ✅ ZORUNLU
            'treatments.links.*.order' => 'nullable|integer',
            'treatments.links.*.is_active' => 'nullable|boolean',
            'links' => 'nullable|array',
            'links.*.label' => 'required|string|max:255', // ✅ ZORUNLU
            'links.*.href' => 'required|string|max:255',  // ✅ ZORUNLU
            'links.*.order' => 'nullable|integer',
            'links.*.is_active' => 'nullable|boolean',
        ], [
            // ✅ TÜRKÇE HATA MESAJLARI
            'about.links.*.label.required' => 'Hakkımızda menüsünde tüm linklerin etiketi zorunludur',
            'about.links.*.href.required' => 'Hakkımızda menüsünde tüm linklerin URL\'si zorunludur',
            'treatments.links.*.label.required' => 'Tedaviler menüsünde tüm linklerin etiketi zorunludur',
            'treatments.links.*.href.required' => 'Tedaviler menüsünde tüm linklerin URL\'si zorunludur',
            'links.*.label.required' => 'Ana menüde tüm linklerin etiketi zorunludur',
            'links.*.href.required' => 'Ana menüde tüm linklerin URL\'si zorunludur',
        ]);

        $locale = $validated['locale'] ?? 'tr';

        DB::beginTransaction();
        try {
            // Update or create config
            $config = NavbarConfig::updateOrCreate(
                ['locale' => $locale],
                [
                    'logo_url' => $validated['logo_url'] ?? null,
                    'logo_alt' => $validated['logo_alt'] ?? null,
                    'logo_width' => $validated['logo_width'] ?? 125,
                    'logo_height' => $validated['logo_height'] ?? 65,
                    'phone_number' => $validated['phone_number'] ?? null,
                    'whatsapp_number' => $validated['whatsapp_number'] ?? null,
                    'email' => $validated['email'] ?? null,
                ]
            );

            // Delete existing dropdowns and links
            $config->dropdowns()->delete();
            $config->links()->delete();

            // Create About dropdown
            if (isset($validated['about']) && isset($validated['about']['links']) && count($validated['about']['links']) > 0) {
                $aboutDropdown = $config->dropdowns()->create([
                    'type' => 'about',
                    'label' => $validated['about']['label'] ?? 'about',
                    'order' => 1,
                    'is_active' => true,
                ]);

                foreach ($validated['about']['links'] as $index => $link) {
                    // ✅ BOŞ KONTROLÜ
                    if (empty(trim($link['label'])) || empty(trim($link['href']))) {
                        continue;
                    }

                    NavbarLink::create([
                        'navbar_config_id' => $config->id,
                        'dropdown_id' => $aboutDropdown->id,
                        'label' => trim($link['label']),
                        'href' => trim($link['href']),
                        'order' => $link['order'] ?? ($index + 1),
                        'is_active' => $link['is_active'] ?? true,
                    ]);
                }
            }

            // Create Treatments dropdown
            if (isset($validated['treatments']) && isset($validated['treatments']['links']) && count($validated['treatments']['links']) > 0) {
                $treatmentsDropdown = $config->dropdowns()->create([
                    'type' => 'treatments',
                    'label' => $validated['treatments']['label'] ?? 'treatments',
                    'order' => 2,
                    'is_active' => true,
                ]);

                foreach ($validated['treatments']['links'] as $index => $link) {
                    // ✅ BOŞ KONTROLÜ
                    if (empty(trim($link['label'])) || empty(trim($link['href']))) {
                        continue;
                    }

                    NavbarLink::create([
                        'navbar_config_id' => $config->id,
                        'dropdown_id' => $treatmentsDropdown->id,
                        'label' => trim($link['label']),
                        'href' => trim($link['href']),
                        'order' => $link['order'] ?? ($index + 1),
                        'is_active' => $link['is_active'] ?? true,
                    ]);
                }
            }

            // Create main links
            if (isset($validated['links']) && count($validated['links']) > 0) {
                foreach ($validated['links'] as $index => $link) {
                    // ✅ BOŞ KONTROLÜ
                    if (empty(trim($link['label'])) || empty(trim($link['href']))) {
                        continue;
                    }

                    NavbarLink::create([
                        'navbar_config_id' => $config->id,
                        'dropdown_id' => null,
                        'label' => trim($link['label']),
                        'href' => trim($link['href']),
                        'order' => $link['order'] ?? ($index + 1),
                        'is_active' => $link['is_active'] ?? true,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Navbar başarıyla güncellendi',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Validasyon hatası: ' . implode(', ', $e->validator->errors()->all()),
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Navbar update error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Güncelleme başarısız: ' . $e->getMessage(),
            ], 500);
        }
    }

    private function transformConfig($config)
    {
        $about = $config->dropdowns->where('type', 'about')->first();
        $treatments = $config->dropdowns->where('type', 'treatments')->first();

        return [
            'logo' => [
                'url' => $config->logo_url,
                'alt' => $config->logo_alt,
                'width' => $config->logo_width,
                'height' => $config->logo_height,
            ],
            'about' => [
                'label' => $about?->label ?? 'about',
                'links' => $about?->links->sortBy('order')->map(fn($link) => [
                        'id' => $link->id,
                        'label' => $link->label,
                        'href' => $link->href,
                        'order' => $link->order,
                        'is_active' => $link->is_active,
                    ])->values()->toArray() ?? [],
            ],
            'treatments' => [
                'label' => $treatments?->label ?? 'treatments',
                'links' => $treatments?->links->sortBy('order')->map(fn($link) => [
                        'id' => $link->id,
                        'label' => $link->label,
                        'href' => $link->href,
                        'order' => $link->order,
                        'is_active' => $link->is_active,
                    ])->values()->toArray() ?? [],
            ],
            'links' => $config->links->whereNull('dropdown_id')->sortBy('order')->map(fn($link) => [
                'id' => $link->id,
                'label' => $link->label,
                'href' => $link->href,
                'order' => $link->order,
                'is_active' => $link->is_active,
            ])->values()->toArray(),
            'contact' => [
                'phone_number' => $config->phone_number,
                'whatsapp_number' => $config->whatsapp_number,
                'email' => $config->email,
            ],
        ];
    }

    private function getDefaultConfig($locale)
    {
        return [
            'logo' => [
                'url' => 'https://api.aydaivf.com/uploads/ayda_logo_9e8994bffd.png',
                'alt' => 'Ayda IVF Logo',
                'width' => 125,
                'height' => 65,
            ],
            'about' => [
                'label' => 'about',
                'links' => [],
            ],
            'treatments' => [
                'label' => 'treatments',
                'links' => [],
            ],
            'links' => [],
            'contact' => [
                'phone_number' => '+90 533 123 4567',
                'whatsapp_number' => '+90 533 123 4567',
                'email' => 'info@aydaivf.com',
            ],
        ];
    }
}
