'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
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

// TipTap dynamic import
const Tiptap = dynamic(() => import('@/src/components/Tiptap'), {
    ssr: false,
    loading: () => (
        <div className="border rounded-lg p-4 min-h-[300px] flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
    )
})

interface PageFormData {
    title: string
    subtitle: string
    slug: string
    content: string
    metaTitle: string
    metaDescription: string
    status: 'published' | 'draft'
    heroImage: string
}

// Slug generator utility
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
    const t = useTranslations('pages')
    const tCommon = useTranslations('common')
    const { toast } = useToast()

    const [formData, setFormData] = useState<PageFormData>({
        title: '',
        subtitle: '',
        slug: '',
        content: '',
        metaTitle: '',
        metaDescription: '',
        status: 'draft',
        heroImage: '',
    })

    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<Partial<PageFormData>>({})
    const [showPreview, setShowPreview] = useState(false)
    const [showMediaPicker, setShowMediaPicker] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    // Client-side mount check
    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Handle title change with auto slug generation
    const handleTitleChange = (title: string) => {
        setFormData({
            ...formData,
            title,
            slug: generateSlug(title),
            metaTitle: title,
        })
    }

    // Form validation
    const validateForm = (): boolean => {
        const newErrors: Partial<PageFormData> = {}

        if (!formData.title.trim()) {
            newErrors.title = t('validation.titleRequired')
        }

        if (!formData.subtitle.trim()) {
            newErrors.subtitle = t('validation.subtitleRequired')
        }

        if (!formData.slug.trim()) {
            newErrors.slug = t('validation.slugRequired')
        }

        if (!formData.content.trim()) {
            newErrors.content = t('validation.contentRequired')
        }

        if (!formData.heroImage.trim()) {
            newErrors.heroImage = t('validation.heroImageRequired')
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setLoading(true)

        try {
            await axios.post('/pages', formData)
            toast({
                title: tCommon('success'),
                description: t('createSuccess'),
            })
            router.push('/pages')
        } catch (error: any) {
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
        setFormData({ ...formData, heroImage: url })
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary-pink">{t('create.title')}</h1>
                    <p className="text-gray-600 mt-1">{t('subtitle')}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => setShowPreview(true)}>
                        <Eye className="w-4 h-4 mr-2" />
                        {t('preview')}
                    </Button>
                    <Button variant="outline" onClick={() => router.push('/pages')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {tCommon('back')}
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Hero Image */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <ImageIcon className="w-5 h-5 mr-2" />
                                {t('form.heroImage')} *
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {formData.heroImage ? (
                                <div className="relative w-full h-[300px] rounded-lg overflow-hidden group">
                                    <Image
                                        src={formData.heroImage}
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
                                        >
                                            <Upload className="w-4 h-4 mr-2" />
                                            {t('changeImage')}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => setFormData({ ...formData, heroImage: '' })}
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            {tCommon('delete')}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setShowMediaPicker(true)}
                                    className="w-full h-[300px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-primary-pink hover:bg-pink-50 transition"
                                >
                                    <Upload className="h-16 w-16 text-gray-400 mb-4" />
                                    <p className="text-sm text-gray-600">{t('form.selectHeroImage')}</p>
                                    <p className="text-xs text-gray-400 mt-2">Önerilen boyut: 1920x1080</p>
                                </button>
                            )}
                            {errors.heroImage && (
                                <p className="text-sm text-red-600 mt-2">{errors.heroImage}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Title */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">{t('form.title')} *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    placeholder={t('placeholders.title')}
                                    className={errors.title ? 'border-red-500' : ''}
                                />
                                {errors.title && (
                                    <p className="text-sm text-red-600">{errors.title}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Subtitle */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-2">
                                <Label htmlFor="subtitle">{t('form.subtitle')} *</Label>
                                <Input
                                    id="subtitle"
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                    placeholder={t('placeholders.subtitle')}
                                    className={errors.subtitle ? 'border-red-500' : ''}
                                />
                                {errors.subtitle && (
                                    <p className="text-sm text-red-600">{errors.subtitle}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Slug */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-2">
                                <Label htmlFor="slug">{t('form.slug')} *</Label>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500 text-sm">yoursite.com/</span>
                                    <Input
                                        id="slug"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        placeholder={t('placeholders.slug')}
                                        className={errors.slug ? 'border-red-500' : ''}
                                    />
                                </div>
                                {errors.slug && (
                                    <p className="text-sm text-red-600">{errors.slug}</p>
                                )}
                                <p className="text-xs text-gray-500">
                                    URL otomatik olarak başlıktan oluşturulur veya manuel düzenleyebilirsiniz.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Content - TipTap */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('form.content')} *</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Tiptap
                                    content={formData.content}
                                    onChange={(content) => setFormData({ ...formData, content })}
                                />
                                {errors.content && (
                                    <p className="text-sm text-red-600 mt-2">{errors.content}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* SEO Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Search className="w-5 h-5 mr-2" />
                                {t('form.seoSettings')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="metaTitle">{t('form.metaTitle')}</Label>
                                <Input
                                    id="metaTitle"
                                    value={formData.metaTitle}
                                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                    placeholder={t('placeholders.metaTitle')}
                                />
                                <p className="text-xs text-gray-500">
                                    {formData.metaTitle.length}/60 {t('meta.titleLength')}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="metaDescription">{t('form.metaDescription')}</Label>
                                <Textarea
                                    id="metaDescription"
                                    value={formData.metaDescription}
                                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                    rows={3}
                                    placeholder={t('placeholders.metaDescription')}
                                />
                                <p className="text-xs text-gray-500">
                                    {formData.metaDescription.length}/160 {t('meta.descriptionLength')}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Publish */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('form.publish')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="status">{t('form.status')}</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => setFormData({ ...formData, status: value as 'published' | 'draft' })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">{t('status.draft')}</SelectItem>
                                        <SelectItem value="published">{t('status.published')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="pt-4 border-t">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary-pink hover:bg-pink-700"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            {t('create.saving')}
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4 mr-2" />
                                            {t('create.save')}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">{t('pageInfo')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">{t('wordCount')}:</span>
                                <span className="font-medium">
                                    {formData.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">{t('charCount')}:</span>
                                <span className="font-medium">
                                    {formData.content.replace(/<[^>]*>/g, '').length}
                                </span>
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
                selectedUrl={formData.heroImage}
            />

            {/* Preview Dialog */}
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogContent className="max-w-6xl h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>{t('preview')}: {formData.title || 'Yeni Sayfa'}</DialogTitle>
                    </DialogHeader>
                    <div className="overflow-auto h-full">
                        {/* Hero Section Preview */}
                        <section className="w-full relative h-[40vh] mb-8">
                            {formData.heroImage ? (
                                <Image
                                    src={formData.heroImage}
                                    alt={formData.title}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <ImageIcon className="w-16 h-16 text-gray-400" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-white p-4">
                                <h1 className="text-3xl md:text-5xl font-bold mb-2">{formData.title || 'Başlık'}</h1>
                                <p className="text-lg md:text-2xl">{formData.subtitle || 'Alt başlık'}</p>
                            </div>
                        </section>

                        {/* Content Preview */}
                        <section className="max-w-5xl mx-auto px-4 py-8">
                            <div
                                className="prose prose-lg max-w-none text-center"
                                dangerouslySetInnerHTML={{ __html: formData.content || '<p>İçerik burada görünecek...</p>' }}
                            />
                        </section>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}