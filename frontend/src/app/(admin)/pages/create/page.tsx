'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import axios from '@/src/lib/axios'
import Image from 'next/image'
import {
    ArrowLeft,
    Check,
    Loader2,
    Search,
    Upload,
    X,
    Eye,
    Image as ImageIcon
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
        .map((char) => turkishMap[char] || char)
        .join('')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

export default function CreatePagePage() {
    const router = useRouter()
    const locale = useLocale()
    const t = useTranslations('pages')
    const tCommon = useTranslations('common')
    const { toast } = useToast()

    const [activeLocale, setActiveLocale] = useState<'tr' | 'en'>('tr')
    const [pageData, setPageData] = useState<PageData>({
        status: 'draft',
        tr: { ...DEFAULT_LOCALE_DATA },
        en: { ...DEFAULT_LOCALE_DATA },
    })

    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<Partial<PageLocaleData>>({})
    const [showPreview, setShowPreview] = useState(false)
    const [showMediaPicker, setShowMediaPicker] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const [editorKey, setEditorKey] = useState(0)

    useEffect(() => {
        setIsMounted(true)
    }, [])

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
        updateField('content', content)
    }

    const validateForm = (): boolean => {
        const currentData = pageData[activeLocale]
        const newErrors: Partial<PageLocaleData> = {}

        if (!currentData.title?.trim()) {
            newErrors.title = t('validation.titleRequired')
        }

        if (!currentData.subtitle?.trim()) {
            newErrors.subtitle = t('validation.subtitleRequired')
        }

        if (!currentData.slug?.trim()) {
            newErrors.slug = t('validation.slugRequired')
        }

        if (!currentData.content?.trim()) {
            newErrors.content = t('validation.contentRequired')
        }

        if (!currentData.heroImage?.trim()) {
            newErrors.heroImage = t('validation.heroImageRequired')
        }

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

        setLoading(true)

        try {
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

            console.log('📤 Creating TR page:', trPayload)
            await axios.post('/pages', trPayload)

            console.log('📤 Creating EN page:', enPayload)
            await axios.post('/pages', enPayload)

            toast({
                title: tCommon('success'),
                description: t('createSuccess'),
            })
            router.push('/pages')
        } catch (error: any) {
            console.error('❌ Page creation failed:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            })

            toast({
                title: tCommon('error'),
                description: error.response?.data?.message || tCommon('error'),
                variant: 'destructive',
            })
        } finally {
            setLoading(false)
        }
    }

    const handleMediaSelect = (url: string) => {
        updateField('heroImage', url)
        toast({
            title: tCommon('success'),
            description: t('imageSelected'),
        })
    }

    if (!isMounted) {
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
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-primary-pink">{t('create.title')}</h1>
                    <p className="text-gray-600 mt-1">{t('subtitle')}</p>
                </div>
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
                    <Button variant="outline" onClick={() => setShowPreview(true)} className="flex-1 sm:flex-none text-xs sm:text-sm">
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        {t('preview')}
                    </Button>
                    <Button variant="outline" onClick={() => router.push('/pages')} className="flex-1 sm:flex-none text-xs sm:text-sm">
                        <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        {tCommon('back')}
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
                                {t('form.heroImage')} * ({activeLocale === 'tr' ? '🇹🇷' : '🇬🇧'})
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
                                            {t('changeImage')}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => updateField('heroImage', '')}
                                            className="text-xs sm:text-sm"
                                        >
                                            <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                            {tCommon('delete')}
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
                                    <p className="text-xs sm:text-sm text-gray-600">{t('form.selectHeroImage')}</p>
                                    <p className="text-xs text-gray-400 mt-1 sm:mt-2">Önerilen boyut: 1920x1080</p>
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
                                    {t('form.title')} * ({activeLocale === 'tr' ? '🇹🇷' : '🇬🇧'})
                                </Label>
                                <Input
                                    id="title"
                                    value={currentData.title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    placeholder={t('placeholders.title')}
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
                                    {t('form.subtitle')} * ({activeLocale === 'tr' ? '🇹🇷' : '🇬🇧'})
                                </Label>
                                <Input
                                    id="subtitle"
                                    value={currentData.subtitle}
                                    onChange={(e) => updateField('subtitle', e.target.value)}
                                    placeholder={t('placeholders.subtitle')}
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
                                    {t('form.slug')} * ({activeLocale === 'tr' ? '🇹🇷' : '🇬🇧'})
                                </Label>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                    <span className="text-gray-500 text-xs sm:text-sm whitespace-nowrap">
                                        yoursite.com/{activeLocale}/
                                    </span>
                                    <Input
                                        id="slug"
                                        value={currentData.slug}
                                        onChange={(e) => updateField('slug', e.target.value)}
                                        placeholder={t('placeholders.slug')}
                                        className={`text-sm sm:text-base ${errors.slug ? 'border-red-500' : ''}`}
                                    />
                                </div>
                                {errors.slug && (
                                    <p className="text-xs sm:text-sm text-red-600">{errors.slug}</p>
                                )}
                                <p className="text-xs text-gray-500">
                                    URL otomatik olarak başlıktan oluşturulur veya manuel düzenleyebilirsiniz.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="p-4">
                            <CardTitle className="text-base sm:text-lg">
                                {t('form.content')} * ({activeLocale === 'tr' ? '🇹🇷' : '🇬🇧'})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
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
                                {t('form.seoSettings')} ({activeLocale === 'tr' ? '🇹🇷' : '🇬🇧'})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                            <div className="space-y-2">
                                <Label htmlFor="metaTitle" className="text-sm sm:text-base">
                                    {t('form.metaTitle')}
                                </Label>
                                <Input
                                    id="metaTitle"
                                    value={currentData.metaTitle}
                                    onChange={(e) => updateField('metaTitle', e.target.value)}
                                    placeholder={t('placeholders.metaTitle')}
                                    className="text-sm sm:text-base"
                                />
                                <p className="text-xs text-gray-500">
                                    {currentData.metaTitle.length}/60 {t('meta.titleLength')}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="metaDescription" className="text-sm sm:text-base">
                                    {t('form.metaDescription')}
                                </Label>
                                <Textarea
                                    id="metaDescription"
                                    value={currentData.metaDescription}
                                    onChange={(e) => updateField('metaDescription', e.target.value)}
                                    rows={3}
                                    placeholder={t('placeholders.metaDescription')}
                                    className="text-sm sm:text-base"
                                />
                                <p className="text-xs text-gray-500">
                                    {currentData.metaDescription.length}/160 {t('meta.descriptionLength')}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-4 sm:space-y-6">
                    {/* Publish */}
                    <Card>
                        <CardHeader className="p-4">
                            <CardTitle className="text-base sm:text-lg">{t('form.publish')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-sm sm:text-base">{t('form.status')}</Label>
                                <Select
                                    value={pageData.status}
                                    onValueChange={(value) => setPageData({ ...pageData, status: value as 'published' | 'draft' })}
                                >
                                    <SelectTrigger className="text-sm sm:text-base">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft" className="text-sm sm:text-base">{t('status.draft')}</SelectItem>
                                        <SelectItem value="published" className="text-sm sm:text-base">{t('status.published')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="pt-4 border-t">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary-pink hover:bg-pink-700 text-sm sm:text-base"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-spin" />
                                            {t('create.saving')}
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
                            {t('preview')} ({activeLocale === 'tr' ? '🇹🇷 Türkçe' : '🇬🇧 English'}): {currentData.title || 'Yeni Sayfa'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="overflow-auto h-full">
                        {/* Hero Section Preview */}
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

                        {/* Content Preview */}
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
        </div>
    )
}