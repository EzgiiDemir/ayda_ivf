<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NavbarConfig;
use App\Models\NavbarDropdown;
use App\Models\NavbarLink;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class NavbarController extends Controller
{
    /**
     * Navbar yapılandırmasını getir (Public)
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $locale = $request->input('locale', 'tr');

            $config = NavbarConfig::where('locale', $locale)
                ->with(['dropdowns.links' => fn($q) => $q->where('is_active', true)->orderBy('order')])
                ->with(['links' => fn($q) => $q->whereNull('dropdown_id')->where('is_active', true)->orderBy('order')])
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
            Log::error('Navbar index error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Navbar verileri yüklenirken hata oluştu',
            ], 500);
        }
    }

    /**
     * Navbar yapılandırmasını güncelle (Admin)
     */
    public function update(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'locale' => 'required|string|in:tr,en',
                'logo_url' => 'nullable|string',
                'logo_alt' => 'nullable|string',
                'logo_width' => 'nullable|integer|min:1|max:500',
                'logo_height' => 'nullable|integer|min:1|max:500',
                'phone_number' => 'nullable|string',
                'whatsapp_number' => 'nullable|string',
                'email' => 'nullable|email',
                'about' => 'nullable|array',
                'about.label' => 'required_with:about|string',
                'about.links' => 'nullable|array',
                'about.links.*.label' => 'required|string|max:255',
                'about.links.*.href' => 'required|string|max:255',
                'about.links.*.order' => 'required|integer|min:1',
                'about.links.*.is_active' => 'required|boolean',
                'treatments' => 'nullable|array',
                'treatments.label' => 'required_with:treatments|string',
                'treatments.links' => 'nullable|array',
                'treatments.links.*.label' => 'required|string|max:255',
                'treatments.links.*.href' => 'required|string|max:255',
                'treatments.links.*.order' => 'required|integer|min:1',
                'treatments.links.*.is_active' => 'required|boolean',
                'links' => 'nullable|array',
                'links.*.label' => 'required|string|max:255',
                'links.*.href' => 'required|string|max:255',
                'links.*.order' => 'required|integer|min:1',
                'links.*.is_active' => 'required|boolean',
            ]);

            DB::beginTransaction();

            // Navbar Config güncelle/oluştur
            $config = NavbarConfig::updateOrCreate(
                ['locale' => $validated['locale']],
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

            // Mevcut dropdown ve linkleri sil
            $config->dropdowns()->delete();
            $config->links()->delete();

            // About dropdown ve linklerini ekle
            if (!empty($validated['about']['links'])) {
                $aboutDropdown = $config->dropdowns()->create([
                    'type' => 'about',
                    'label' => $validated['about']['label'],
                    'order' => 1,
                    'is_active' => true,
                ]);

                foreach ($validated['about']['links'] as $link) {
                    NavbarLink::create([
                        'navbar_config_id' => $config->id,
                        'dropdown_id' => $aboutDropdown->id,
                        'label' => $link['label'],
                        'href' => $link['href'],
                        'order' => $link['order'],
                        'is_active' => $link['is_active'],
                    ]);
                }
            }

            // Treatments dropdown ve linklerini ekle
            if (!empty($validated['treatments']['links'])) {
                $treatmentsDropdown = $config->dropdowns()->create([
                    'type' => 'treatments',
                    'label' => $validated['treatments']['label'],
                    'order' => 2,
                    'is_active' => true,
                ]);

                foreach ($validated['treatments']['links'] as $link) {
                    NavbarLink::create([
                        'navbar_config_id' => $config->id,
                        'dropdown_id' => $treatmentsDropdown->id,
                        'label' => $link['label'],
                        'href' => $link['href'],
                        'order' => $link['order'],
                        'is_active' => $link['is_active'],
                    ]);
                }
            }

            // Ana menü linklerini ekle
            if (!empty($validated['links'])) {
                foreach ($validated['links'] as $link) {
                    NavbarLink::create([
                        'navbar_config_id' => $config->id,
                        'dropdown_id' => null,
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
                'message' => 'Navbar başarıyla güncellendi',
                'data' => [
                    'about_links_count' => count($validated['about']['links'] ?? []),
                    'treatments_links_count' => count($validated['treatments']['links'] ?? []),
                    'main_links_count' => count($validated['links'] ?? []),
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
            Log::error('Navbar update error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Navbar güncellenirken hata oluştu',
            ], 500);
        }
    }

    /**
     * Config'i frontend için uygun formata dönüştür
     */
    private function transformConfig(NavbarConfig $config): array
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
                'label' => $about?->label,
                'links' => $about?->links->sortBy('order')->map(fn($link) => [
                        'id' => $link->id,
                        'label' => $link->label,
                        'href' => $link->href,
                        'order' => $link->order,
                        'is_active' => $link->is_active,
                    ])->values()->toArray() ?? [],
            ],
            'treatments' => [
                'label' => $treatments?->label,
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
}
