<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class MediaController extends Controller
{
    /**
     * Tüm medya dosyalarını listele
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Media::with('uploader:id,name,email');

            if ($request->filled('search')) {
                $query->search($request->search);
            }

            if ($request->filled('type') && $request->type !== 'all') {
                match ($request->type) {
                    'image' => $query->images(),
                    'video' => $query->videos(),
                    'document' => $query->documents(),
                    default => null,
                };
            }

            $sortBy = $request->input('sortBy', 'created_at');
            $sortOrder = $request->input('sortOrder', 'desc');

            $allowedSortColumns = ['id', 'name', 'size', 'created_at', 'updated_at'];
            if (in_array($sortBy, $allowedSortColumns)) {
                $query->orderBy($sortBy, $sortOrder);
            }

            $perPage = min($request->input('per_page', 20), 100);
            $media = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $media->items(),
                'meta' => [
                    'total' => $media->total(),
                    'perPage' => $media->perPage(),
                    'currentPage' => $media->currentPage(),
                    'lastPage' => $media->lastPage(),
                    'from' => $media->firstItem(),
                    'to' => $media->lastItem(),
                ],
                'links' => [
                    'first' => $media->url(1),
                    'last' => $media->url($media->lastPage()),
                    'prev' => $media->previousPageUrl(),
                    'next' => $media->nextPageUrl(),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Media index error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Medya dosyaları listelenirken bir hata oluştu',
            ], 500);
        }
    }

    /**
     * Dosya yükleme
     */
    public function upload(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'files' => 'required|array|max:10',
                'files.*' => [
                    'required',
                    'file',
                    'max:10240',
                    'mimes:jpg,jpeg,png,gif,webp,svg,pdf,doc,docx,xls,xlsx,ppt,pptx,txt,mp4,mov,avi,wmv,mkv,zip,rar',
                ],
            ], [
                'files.required' => 'Lütfen en az bir dosya seçin',
                'files.*.required' => 'Dosya gereklidir',
                'files.*.file' => 'Geçerli bir dosya yüklemelisiniz',
                'files.*.max' => 'Dosya boyutu en fazla 10MB olabilir',
                'files.*.mimes' => 'Desteklenmeyen dosya formatı',
            ]);

            $uploadedFiles = [];

            DB::beginTransaction();

            foreach ($request->file('files') as $file) {
                if (!$file->isValid()) {
                    throw ValidationException::withMessages([
                        'files' => 'Bir veya daha fazla dosya geçersiz',
                    ]);
                }

                $originalName = $file->getClientOriginalName();
                $extension = $file->getClientOriginalExtension();
                $filename = Str::uuid() . '.' . $extension;

                $path = $file->storeAs('media', $filename, 'public');

                if (!$path) {
                    throw new \Exception('Dosya kaydedilemedi');
                }

                $media = Media::create([
                    'name' => $originalName,
                    'file_name' => $filename,
                    'mime_type' => $file->getMimeType(),
                    'path' => $path,
                    'disk' => 'public',
                    'size' => $file->getSize(),
                    'uploaded_by' => $request->user()->id,
                ]);

                $uploadedFiles[] = $media->load('uploader:id,name,email');
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => count($uploadedFiles) . ' dosya başarıyla yüklendi',
                'data' => $uploadedFiles,
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
            Log::error('Media upload error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Dosya yüklenirken bir hata oluştu',
            ], 500);
        }
    }

    /**
     * Tek bir medya dosyasını göster
     */
    public function show(int $id): JsonResponse
    {
        try {
            $media = Media::with('uploader:id,name,email')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $media,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Medya dosyası bulunamadı',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Media show error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Medya dosyası getirilirken bir hata oluştu',
            ], 500);
        }
    }

    /**
     * Medya dosyasını sil
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $media = Media::findOrFail($id);

            DB::beginTransaction();

            if (Storage::disk($media->disk)->exists($media->path)) {
                Storage::disk($media->disk)->delete($media->path);
            }

            $media->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Medya dosyası başarıyla silindi',
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Medya dosyası bulunamadı',
            ], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Media destroy error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Medya dosyası silinirken bir hata oluştu',
            ], 500);
        }
    }

    /**
     * Toplu medya dosyası silme
     */
    public function bulkDelete(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'ids' => 'required|array|min:1|max:100',
                'ids.*' => 'required|integer|exists:media,id',
            ], [
                'ids.required' => 'Silinecek dosyaları seçin',
                'ids.array' => 'Geçersiz veri formatı',
                'ids.min' => 'En az bir dosya seçmelisiniz',
                'ids.max' => 'Aynı anda en fazla 100 dosya silebilirsiniz',
                'ids.*.exists' => 'Seçilen dosyalardan biri veya birkaçı bulunamadı',
            ]);

            DB::beginTransaction();

            $media = Media::whereIn('id', $validated['ids'])->get();
            $deletedCount = 0;

            foreach ($media as $item) {
                if (Storage::disk($item->disk)->exists($item->path)) {
                    Storage::disk($item->disk)->delete($item->path);
                }

                $item->delete();
                $deletedCount++;
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => $deletedCount . ' medya dosyası başarıyla silindi',
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
            Log::error('Media bulk delete error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Medya dosyası silinirken bir hata oluştu',
            ], 500);
        }
    }
}
