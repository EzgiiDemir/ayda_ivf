'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from '@/src/lib/axios'
import Image from 'next/image'
import {
    ArrowLeft,
    Check,
    Loader2,
    Search,
    Upload,
    X,
    Trash2,
    Eye,
    Image as ImageIcon,
    Languages
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/src/components/ui/use-toast'
import dynamic from 'next/dynamic'
import MediaPicker from '@/src/components/MediaPicker'

const Tiptap = dynamic(() => import('@/src/components/Tiptap'), {
    ssr: false,
    loading: () => (
        <div className="border rounded-lg p-4 min-h-[300px] flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
    )
})

interface PageLocaleData {
    title: string
    subtitle: string
    slug: string
    content: string
    metaTitle: string
    metaDescription: string
    heroImage: string
}

interface PageData {
    status: 'published' | 'draft'
    tr: PageLocaleData
    en: PageLocaleData
}

const DEFAULT_LOCALE_DATA: PageLocaleData = {
    title: '',
    subtitle: '',
    slug: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    heroImage: '',
}

const generateSlug = (title: string): string => {
    const turkishMap: { [key: string]: string } = {
        ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u',
        Ç: 'c', Ğ: 'g', İ: 'i', Ö: 'o', Ş: 's', Ü: 'u',
    }
    return title
        .toLowerCase()
        .split('')
        .map((c) => turkishMap[c] || c)
        .join('')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

export default function EditPagePage() {
    const router = useRouter()
    const params = useParams()
    const { toast } = useToast()
    const pageId = params.id as string

    const [activeLocale, setActiveLocale] = useState<'tr' | 'en'>('tr')
    const [pageData, setPageData] = useState<PageData>({
        status: 'draft',
        tr: { ...DEFAULT_LOCALE_DATA },
        en: { ...DEFAULT_LOCALE_DATA },
    })

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [errors, setErrors] = useState<Partial<PageLocaleData>>({})
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showPreview, setShowPreview] = useState(false)
    const [showMediaPicker, setShowMediaPicker] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const [editorKey, setEditorKey] = useState(0)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (isMounted && pageId) {
            fetchPage()
        }
    }, [pageId, isMounted])

    const fetchPage = async () => {
        try {
            setLoading(true)

            const [trResponse, enResponse] = await Promise.all([
                axios.get(`/pages/${pageId}?locale=tr`),
                axios.get(`/pages/${pageId}?locale=en`),
            ])

            const processData = (data: any): PageLocaleData => ({
                title: data.title || '',
                subtitle: data.subtitle || '',
                slug: data.slug || '',
                content: data.content || '',
                metaTitle: data.metaTitle || data.meta_title || '',
                metaDescription: data.metaDescription || data.meta_description || '',
                heroImage: data.heroImage || data.hero_image || '',
            })

            const trData = trResponse.data.data || trResponse.data
            const enData = enResponse.data.data || enResponse.data

            setPageData({
                status: trData.status || 'draft',
                tr: processData(trData),
                en: processData(enData),
            })

            setEditorKey(prev => prev + 1)

            toast({
                title: '✅ Başarılı',
                description: 'Sayfa verileri yüklendi',
            })
        } catch (error: any) {
            console.error('❌ Page fetch error:', error)
            toast({
                title: '❌ Hata',
                description: error.response?.data?.message || 'Veriler yüklenirken hata oluştu',
                variant: 'destructive',
            })
        } finally {
            setLoading(false)
        }
    }

    const updateField = (field: keyof PageLocaleData, value: any) => {
        setPageData({
            ...pageData,
            [activeLocale]: { ...pageData[activeLocale], [field]: value },
        })
    }

    const handleTitleChange = (title: string) => {
        const currentData = pageData[activeLocale]
        setPageData({
            ...pageData,
            [activeLocale]: {
                ...currentData,
                title,
                slug: generateSlug(title),
                metaTitle: title
            }
        })
    }

    const handleContentChange = (content: string) => {
        console.log('✅ Content updated:', content.substring(0, 100))
        updateField('content', content)
    }

    const validateForm = (): boolean => {
        const currentData = pageData[activeLocale]
        const newErrors: Partial<PageLocaleData> = {}

        // Required fields
        if (!currentData.title?.trim()) {
            newErrors.title = 'Başlık zorunludur'
        }

        if (!currentData.subtitle?.trim()) {
            newErrors.subtitle = 'Alt başlık zorunludur'
        }

        if (!currentData.slug?.trim()) {
            newErrors.slug = 'Slug zorunludur'
        }

        if (!currentData.content?.trim()) {
            newErrors.content = 'İçerik zorunludur'
        }

        if (!currentData.heroImage?.trim()) {
            newErrors.heroImage = 'Hero görsel zorunludur'
        }

        // Validate both locales before submitting
        const otherLocale = activeLocale === 'tr' ? 'en' : 'tr'
        const otherData = pageData[otherLocale]

        const hasMissingOtherLocale =
            !otherData.title?.trim() ||
            !otherData.subtitle?.trim() ||
            !otherData.slug?.trim() ||
            !otherData.content?.trim() ||
            !otherData.heroImage?.trim()

        if (hasMissingOtherLocale) {
            toast({
                title: '⚠️ Dikkat',
                description: `${otherLocale.toUpperCase()} dilinde eksik alanlar var!`,
                variant: 'destructive',
            })
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            toast({
                title: '❌ Hata',
                description: `[${activeLocale.toUpperCase()}] Lütfen tüm zorunlu alanları doldurun`,
                variant: 'destructive',
            })
            return
        }

        setSaving(true)

        try {
            // ✅ TR Payload
            const trPayload = {
                locale: 'tr',
                title: pageData.tr.title.trim(),
                subtitle: pageData.tr.subtitle.trim(),
                slug: pageData.tr.slug.trim(),
                content: pageData.tr.content.trim(),
                heroImage: pageData.tr.heroImage.trim(),
                metaTitle: pageData.tr.metaTitle.trim() || pageData.tr.title.trim(),
                metaDescription: pageData.tr.metaDescription.trim() || pageData.tr.subtitle.trim(),
                status: pageData.status,
            }

            // ✅ EN Payload
            const enPayload = {
                locale: 'en',
                title: pageData.en.title.trim(),
                subtitle: pageData.en.subtitle.trim(),
                slug: pageData.en.slug.trim(),
                content: pageData.en.content.trim(),
                heroImage: pageData.en.heroImage.trim(),
                metaTitle: pageData.en.metaTitle.trim() || pageData.en.title.trim(),
                metaDescription: pageData.en.metaDescription.trim() || pageData.en.subtitle.trim(),
                status: pageData.status,
            }

            console.log('📤 Sending TR:', trPayload)
            console.log('📤 Sending EN:', enPayload)

            // ✅ Send requests sequentially to see which one fails
            console.log('🔄 Updating TR...')
            await axios.put(`/pages/${pageId}`, trPayload)
            console.log('✅ TR Updated')

            console.log('🔄 Updating EN...')
            await axios.put(`/pages/${pageId}`, enPayload)
            console.log('✅ EN Updated')

            toast({
                title: '✅ Başarılı',
                description: 'Sayfa her iki dil için güncellendi',
            })

            router.push('/pages')

        } catch (error: any) {
            console.error('❌ Update error:', error)
            console.error('❌ Response:', error.response)
            console.error('❌ Response data:', error.response?.data)

            // ✅ Handle 422 Validation Errors
            if (error.response?.status === 422) {
                const errors = error.response.data?.errors || {}
                const errorMessages = Object.entries(errors)
                    .map(([field, messages]) => {
                        const msgs = Array.isArray(messages) ? messages : [messages]
                        return `• ${field}: ${msgs.join(', ')}`
                    })
                    .join('\n')

                console.error('❌ Validation Errors:', errors)

                toast({
                    title: '❌ Validation Hatası',
                    description: errorMessages || 'Lütfen formu kontrol edin',
                    variant: 'destructive',
                })
            } else if (error.response?.status === 401) {
                toast({
                    title: '❌ Oturum Hatası',
                    description: 'Lütfen tekrar giriş yapın',
                    variant: 'destructive',
                })
            } else if (error.response?.status === 404) {
                toast({
                    title: '❌ Sayfa Bulunamadı',
                    description: 'Güncellenecek sayfa bulunamadı',
                    variant: 'destructive',
                })
            } else {
                toast({
                    title: '❌ Hata',
                    description: error.response?.data?.message || error.message || 'Güncelleme sırasında hata oluştu',
                    variant: 'destructive',
                })
            }
        } finally {
            setSaving(false)
        }
    }
    const handleDelete = async () => {
        try {
            await axios.delete(`/pages/${pageId}`)
            toast({
                title: '✅ Başarılı',
                description: 'Sayfa silindi',
            })
            router.push('/pages')
        } catch (error: any) {
            toast({
                title: '❌ Hata',
                description: error.response?.data?.message || 'Silme sırasında hata oluştu',
                variant: 'destructive',
            })
        }
    }

    const handleMediaSelect = (url: string) => {
        updateField('heroImage', url)
        setShowMediaPicker(false)
        toast({
            title: '✅ Başarılı',
            description: 'Görsel seçildi',
        })
    }

    if (!isMounted || loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-12 w-12 animate-spin text-primary-pink" />
            </div>
        )
    }

    const currentData = pageData[activeLocale]

    return (
        <div className="w-full space-y-4 sm:space-y-6 px-2 sm:px-4 lg:px-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-primary-pink flex items-center gap-2">
                    Page Edit
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        variant={activeLocale === 'tr' ? 'default' : 'outline'}
                        onClick={() => setActiveLocale('tr')}
                        className={`flex-1 sm:flex-none text-xs sm:text-sm ${activeLocale === 'tr' ? 'bg-primary-pink' : ''}`}
                    >
                        🇹🇷 Türkçe
                    </Button>
                    <Button
                        variant={activeLocale === 'en' ? 'default' : 'outline'}
                        onClick={() => setActiveLocale('en')}
                        className={`flex-1 sm:flex-none text-xs sm:text-sm ${activeLocale === 'en' ? 'bg-primary-pink' : ''}`}
                    >
                        🇬🇧 English
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setShowPreview(true)}
                        className="flex-1 sm:flex-none text-xs sm:text-sm"
                    >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Önizle
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => setShowDeleteDialog(true)}
                        className="flex-1 sm:flex-none text-xs sm:text-sm"
                    >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Sil
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => router.push('/pages')}
                        className="flex-1 sm:flex-none text-xs sm:text-sm"
                    >
                        <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Geri
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    {/* Hero Image */}
                    <Card>
                        <CardHeader className="p-4 sm:p-6">
                            <CardTitle className="flex items-center text-base sm:text-lg">
                                <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                Hero Görsel * ({activeLocale === 'tr' ? '🇹🇷' : '🇬🇧'})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 pt-0">
                            {currentData.heroImage ? (
                                <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] rounded-lg overflow-hidden group">
                                    <Image
                                        src={currentData.heroImage}
                                        alt="Hero"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => setShowMediaPicker(true)}
                                            className="text-xs sm:text-sm"
                                        >
                                            <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                            Değiştir
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => updateField('heroImage', '')}
                                            className="text-xs sm:text-sm"
                                        >
                                            <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                            Sil
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setShowMediaPicker(true)}
                                    className="w-full h-[200px] sm:h-[250px] md:h-[300px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-primary-pink hover:bg-pink-50 transition"
                                >
                                    <Upload className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-2 sm:mb-4" />
                                    <p className="text-xs sm:text-sm text-gray-600">Hero görsel seçin</p>
                                    <p className="text-xs text-gray-400 mt-1 sm:mt-2">Önerilen: 1920x1080</p>
                                </button>
                            )}
                            {errors.heroImage && (
                                <p className="text-xs sm:text-sm text-red-600 mt-2">{errors.heroImage}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Title */}
                    <Card>
                        <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm sm:text-base">
                                    Başlık * ({activeLocale === 'tr' ? '🇹🇷' : '🇬🇧'})
                                </Label>
                                <Input
                                    id="title"
                                    value={currentData.title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    placeholder={activeLocale === 'tr' ? 'Sayfa başlığı' : 'Page title'}
                                    className={`text-sm sm:text-base ${errors.title ? 'border-red-500' : ''}`}
                                />
                                {errors.title && (
                                    <p className="text-xs sm:text-sm text-red-600">{errors.title}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Subtitle */}
                    <Card>
                        <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                            <div className="space-y-2">
                                <Label htmlFor="subtitle" className="text-sm sm:text-base">
                                    Alt Başlık * ({activeLocale === 'tr' ? '🇹🇷' : '🇬🇧'})
                                </Label>
                                <Input
                                    id="subtitle"
                                    value={currentData.subtitle}
                                    onChange={(e) => updateField('subtitle', e.target.value)}
                                    placeholder={activeLocale === 'tr' ? 'Sayfa alt başlığı' : 'Page subtitle'}
                                    className={`text-sm sm:text-base ${errors.subtitle ? 'border-red-500' : ''}`}
                                />
                                {errors.subtitle && (
                                    <p className="text-xs sm:text-sm text-red-600">{errors.subtitle}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Slug */}
                    <Card>
                        <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                            <div className="space-y-2">
                                <Label htmlFor="slug" className="text-sm sm:text-base">
                                    Slug * ({activeLocale === 'tr' ? '🇹🇷' : '🇬🇧'})
                                </Label>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                    <span className="text-gray-500 text-xs sm:text-sm whitespace-nowrap">
                                        yoursite.com/{activeLocale}/
                                    </span>
                                    <Input
                                        id="slug"
                                        value={currentData.slug}
                                        onChange={(e) => updateField('slug', e.target.value)}
                                        placeholder={activeLocale === 'tr' ? 'sayfa-slug' : 'page-slug'}
                                        className={`text-sm sm:text-base ${errors.slug ? 'border-red-500' : ''}`}
                                    />
                                </div>
                                {errors.slug && (
                                    <p className="text-xs sm:text-sm text-red-600">{errors.slug}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Content - TipTap */}
                    <Card>
                        <CardHeader className="p-4 sm:p-6">
                            <CardTitle className="text-base sm:text-lg">
                                İçerik * ({activeLocale === 'tr' ? '🇹🇷' : '🇬🇧'})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 pt-0">
                            <div className="space-y-2">
                                <Tiptap
                                    key={`${editorKey}-${activeLocale}`}
                                    content={currentData.content}
                                    onChange={handleContentChange}
                                />
                                {errors.content && (
                                    <p className="text-xs sm:text-sm text-red-600 mt-2">{errors.content}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* SEO Section */}
                    <Card>
                        <CardHeader className="p-4 sm:p-6">
                            <CardTitle className="flex items-center text-base sm:text-lg">
                                <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                SEO Ayarları ({activeLocale === 'tr' ? '🇹🇷' : '🇬🇧'})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                            <div className="space-y-2">
                                <Label htmlFor="metaTitle" className="text-sm sm:text-base">
                                    Meta Başlık
                                </Label>
                                <Input
                                    id="metaTitle"
                                    value={currentData.metaTitle}
                                    onChange={(e) => updateField('metaTitle', e.target.value)}
                                    placeholder={activeLocale === 'tr' ? 'Meta başlık' : 'Meta title'}
                                    className="text-sm sm:text-base"
                                />
                                <p className="text-xs text-gray-500">
                                    {currentData.metaTitle.length}/60 karakter
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="metaDescription" className="text-sm sm:text-base">
                                    Meta Açıklama
                                </Label>
                                <Textarea
                                    id="metaDescription"
                                    value={currentData.metaDescription}
                                    onChange={(e) => updateField('metaDescription', e.target.value)}
                                    rows={3}
                                    placeholder={activeLocale === 'tr' ? 'Meta açıklama' : 'Meta description'}
                                    className="text-sm sm:text-base"
                                />
                                <p className="text-xs text-gray-500">
                                    {currentData.metaDescription.length}/160 karakter
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-4 sm:space-y-6">
                    {/* Publish */}
                    <Card>
                        <CardHeader className="p-4 sm:p-6">
                            <CardTitle className="text-base sm:text-lg">
                                Yayınlama
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-sm sm:text-base">
                                    Durum
                                </Label>
                                <Select
                                    value={pageData.status}
                                    onValueChange={(value) =>
                                        setPageData({ ...pageData, status: value as 'published' | 'draft' })
                                    }
                                >
                                    <SelectTrigger className="text-sm sm:text-base">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft" className="text-sm sm:text-base">
                                            Taslak
                                        </SelectItem>
                                        <SelectItem value="published" className="text-sm sm:text-base">
                                            Yayında
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="pt-4 border-t">
                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-primary-pink hover:bg-pink-700 text-sm sm:text-base"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-spin" />
                                            Kaydediliyor...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                            Her İki Dili Kaydet
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Info */}
                    <Card>
                        <CardHeader className="p-4 sm:p-6">
                            <CardTitle className="text-sm sm:text-base">
                                Sayfa Bilgisi
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-xs sm:text-sm p-4 sm:p-6 pt-0">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Kelime:</span>
                                <span className="font-medium">
                                    {currentData.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Karakter:</span>
                                <span className="font-medium">
                                    {currentData.content.replace(/<[^>]*>/g, '').length}
                                </span>
                            </div>
                            <div className="pt-2 border-t">
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <span>🇹🇷 TR: {pageData.tr.content.length > 0 ? '✓' : '○'}</span>
                                    <span>•</span>
                                    <span>🇬🇧 EN: {pageData.en.content.length > 0 ? '✓' : '○'}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </form>

            {/* Media Picker Modal */}
            <MediaPicker
                open={showMediaPicker}
                onOpenChange={setShowMediaPicker}
                onSelect={handleMediaSelect}
                selectedUrl={currentData.heroImage}
            />

            {/* Preview Dialog */}
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogContent className="max-w-[95vw] sm:max-w-6xl h-[90vh] p-4 sm:p-6">
                    <DialogHeader>
                        <DialogTitle className="text-base sm:text-lg">
                            Önizleme ({activeLocale === 'tr' ? '🇹🇷 Türkçe' : '🇬🇧 English'}): {currentData.title}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="overflow-auto h-full">
                        <section className="w-full relative h-[30vh] sm:h-[40vh] mb-4 sm:mb-8">
                            {currentData.heroImage ? (
                                <Image
                                    src={currentData.heroImage}
                                    alt={currentData.title}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-white p-4">
                                <h1 className="text-xl sm:text-3xl md:text-5xl font-bold mb-1 sm:mb-2 text-center">
                                    {currentData.title || 'Başlık'}
                                </h1>
                                <p className="text-sm sm:text-lg md:text-2xl text-center">
                                    {currentData.subtitle || 'Alt başlık'}
                                </p>
                            </div>
                        </section>

                        <section className="max-w-5xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
                            <div
                                className="prose prose-sm sm:prose-base lg:prose-lg max-w-none"
                                dangerouslySetInnerHTML={{
                                    __html: currentData.content || '<p>İçerik burada görünecek...</p>'
                                }}
                            />
                        </section>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-base sm:text-lg">
                            Sayfayı Sil
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-xs sm:text-sm">
                            Bu işlem geri alınamaz. Sayfa her iki dilde de silinecek.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                        <AlertDialogCancel className="text-xs sm:text-sm">
                            İptal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 text-xs sm:text-sm"
                        >
                            Sil
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}