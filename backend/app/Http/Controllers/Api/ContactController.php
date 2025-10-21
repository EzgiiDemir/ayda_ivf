<?php
// app/Http/Controllers/Api/ContactController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactPage;
use App\Models\ContactSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    // Public: Get contact page config
    public function index(Request $request)
    {
        $locale = $request->get('locale', 'tr');
        $contactPage = ContactPage::where('locale', $locale)->first();

        if (!$contactPage) {
            $contactPage = ContactPage::where('locale', 'tr')->first();
        }

        if (!$contactPage) {
            return response()->json([
                'success' => true,
                'data' => [
                    'locale' => $locale,
                    'banner_image' => 'https://api.aydaivf.com/uploads/elitebig_7bc1166778.jpg',
                    'form_top_title' => 'Aşağıdaki formu doldurarak',
                    'form_title' => 'bizimle iletişime geçebilirsiniz',
                    'form_subjects' => [
                        'Genel Bilgi',
                        'Randevu Talebi',
                        'Tedavi Hakkında',
                        'Fiyat Bilgisi',
                        'Diğer'
                    ],
                    'submit_button_text' => 'Gönder',
                ]
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'locale' => $contactPage->locale,
                'banner_image' => $contactPage->banner_image ?? 'https://api.aydaivf.com/uploads/elitebig_7bc1166778.jpg',
                'form_top_title' => $contactPage->form_top_title ?? 'Aşağıdaki formu doldurarak',
                'form_title' => $contactPage->form_title ?? 'bizimle iletişime geçebilirsiniz',
                'form_subjects' => $contactPage->form_subjects ?? [
                        'Genel Bilgi',
                        'Randevu Talebi',
                        'Tedavi Hakkında',
                        'Fiyat Bilgisi',
                        'Diğer'
                    ],
                'submit_button_text' => $contactPage->submit_button_text ?? 'Gönder',
            ]
        ]);
    }

    // Admin: Update contact page config
    public function update(Request $request)
    {
        $validated = $request->validate([
            'locale' => 'nullable|string|size:2',
            'banner_image' => 'nullable|string',
            'form_top_title' => 'nullable|string',
            'form_title' => 'nullable|string',
            'form_subjects' => 'nullable|array',
            'submit_button_text' => 'nullable|string',
        ]);

        $locale = $validated['locale'] ?? 'tr';
        unset($validated['locale']);

        $validated = array_filter($validated, function($value) {
            return $value !== null && $value !== '';
        });

        $contactPage = ContactPage::updateOrCreate(
            ['locale' => $locale],
            $validated
        );

        return response()->json([
            'success' => true,
            'message' => 'Contact page güncellendi',
            'data' => $contactPage
        ]);
    }

    // Public: Submit contact form
    public function submit(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'locale' => 'nullable|string|size:2',
        ]);

        $submission = ContactSubmission::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'locale' => $validated['locale'] ?? 'tr',
            'ip_address' => $request->ip(),
        ]);

        // TODO: Send email notification here
        // Mail::to('info@aydaivf.com')->send(new ContactFormMail($submission));

        return response()->json([
            'success' => true,
            'message' => 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.',
        ]);
    }

    // Admin: Get all submissions
    public function submissions(Request $request)
    {
        $query = ContactSubmission::orderBy('created_at', 'desc');

        if ($request->has('unread_only')) {
            $query->where('is_read', false);
        }

        $submissions = $query->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $submissions
        ]);
    }

    // Admin: Mark as read
    public function markAsRead(Request $request, $id)
    {
        $submission = ContactSubmission::findOrFail($id);
        $submission->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Mesaj okundu olarak işaretlendi'
        ]);
    }

    // Admin: Delete submission
    public function deleteSubmission($id)
    {
        $submission = ContactSubmission::findOrFail($id);
        $submission->delete();

        return response()->json([
            'success' => true,
            'message' => 'Mesaj silindi'
        ]);
    }
}
