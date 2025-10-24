<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ContactFormMail;
use App\Models\ContactPage;
use App\Models\ContactSubmission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class ContactController extends Controller
{
    /**
     * İletişim sayfası yapılandırmasını getir (Public)
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $locale = $request->input('locale', 'tr');
            $contactPage = ContactPage::where('locale', $locale)->first();

            return response()->json([
                'success' => true,
                'data' => $contactPage,
            ]);
        } catch (\Exception $e) {
            Log::error('Contact index error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'İletişim yapılandırması yüklenirken hata oluştu',
            ], 500);
        }
    }

    /**
     * İletişim sayfası yapılandırmasını güncelle (Admin)
     */
    public function update(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'locale' => 'required|string|in:tr,en',
                'banner_image' => 'nullable|string',
                'form_top_title' => 'nullable|string',
                'form_title' => 'nullable|string',
                'form_subjects' => 'nullable|array',
                'submit_button_text' => 'nullable|string',
                'submit_button_loading' => 'nullable|string',
                'fields' => 'nullable|array',
                'messages' => 'nullable|array',
            ]);

            DB::beginTransaction();

            $contactPage = ContactPage::updateOrCreate(
                ['locale' => $validated['locale']],
                array_filter($validated, fn($key) => $key !== 'locale', ARRAY_FILTER_USE_KEY)
            );

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'İletişim sayfası başarıyla güncellendi',
                'data' => $contactPage,
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
            Log::error('Contact update error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'İletişim sayfası güncellenirken hata oluştu',
            ], 500);
        }
    }

    /**
     * İletişim formu gönderimi (Public)
     */
    public function submit(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'subject' => 'required|string|max:255',
                'message' => 'required|string|max:5000',
                'locale' => 'nullable|string|in:tr,en',
            ]);

            DB::beginTransaction();

            $submission = ContactSubmission::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'subject' => $validated['subject'],
                'message' => $validated['message'],
                'locale' => $validated['locale'] ?? 'tr',
                'ip_address' => $request->ip(),
                'is_read' => false,
            ]);

            try {
                Mail::to(config('mail.admin_email'))
                    ->send(new ContactFormMail($submission));
            } catch (\Exception $mailError) {
                Log::error('Contact form mail error: ' . $mailError->getMessage());
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Mesajınız başarıyla gönderildi',
                'data' => [
                    'id' => $submission->id,
                    'created_at' => $submission->created_at,
                ],
            ], 201);

        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Doğrulama hatası',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Contact submit error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Mesaj gönderilirken hata oluştu',
            ], 500);
        } }
    /**
     * Tüm mesajları listele (Admin)
     */
    public function submissions(Request $request): JsonResponse
    {
        try {
            $query = ContactSubmission::orderBy('created_at', 'desc');

            if ($request->boolean('unread_only')) {
                $query->where('is_read', false);
            }

            if ($request->filled('locale')) {
                $query->where('locale', $request->input('locale'));
            }

            $perPage = min($request->input('per_page', 20), 100);
            $submissions = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $submissions->items(),
                'meta' => [
                    'total' => $submissions->total(),
                    'per_page' => $submissions->perPage(),
                    'current_page' => $submissions->currentPage(),
                    'last_page' => $submissions->lastPage(),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Contact submissions error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Mesajlar listelenirken hata oluştu',
            ], 500);
        }
    }

    /**
     * Mesajı okundu olarak işaretle (Admin)
     */
    public function markAsRead(int $id): JsonResponse
    {
        try {
            $submission = ContactSubmission::findOrFail($id);
            $submission->update(['is_read' => true]);

            return response()->json([
                'success' => true,
                'message' => 'Mesaj okundu olarak işaretlendi',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Mesaj bulunamadı',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Contact mark as read error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'İşlem sırasında hata oluştu',
            ], 500);
        }
    }

    /**
     * Mesajı sil (Admin)
     */
    public function deleteSubmission(int $id): JsonResponse
    {
        try {
            $submission = ContactSubmission::findOrFail($id);
            $submission->delete();

            return response()->json([
                'success' => true,
                'message' => 'Mesaj başarıyla silindi',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Mesaj bulunamadı',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Contact delete error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Mesaj silinirken hata oluştu',
            ], 500);
        }
    }
}
