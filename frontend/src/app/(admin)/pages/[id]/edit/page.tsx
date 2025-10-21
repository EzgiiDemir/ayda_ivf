'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
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
    Trash2,
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

// Slug generator
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
    const t = useTranslations('pages')
    const tCommon = useTranslations('common')
    const { toast } = useToast()
    const pageId = params.id as string

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

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [errors, setErrors] = useState<Partial<PageFormData>>({})
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showPreview, setShowPreview] = useState(false)
    const [showMediaPicker, setShowMediaPicker] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const [editorKey, setEditorKey] = useState(0)

    // Client-side mount check
    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Fetch page data
    useEffect(() => {
        if (isMounted && pageId) {
            fetchPage()
        }
    }, [pageId, isMounted])

    const fetchPage = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`/pages/${pageId}`)
            const pageData = response.data.data || response.data

            console.log('Fetched page data:', pageData)

            const newFormData = {
                title: pageData.title || '',
                subtitle: pageData.subtitle || '',
                slug: pageData.slug || '',
                content: pageData.content || '',
                metaTitle: pageData.metaTitle || pageData.meta_title || '',
                metaDescription: pageData.metaDescription || pageData.meta_description || '',
                status: pageData.status || 'draft',
                heroImage: pageData.heroImage || pageData.hero_image || '',
            }

            setFormData(newFormData)
            setEditorKey(prev => prev + 1)
        } catch (error: any) {
            console.error('Page fetch error:', error)
            toast({
                title: tCommon('error'),
                description: error.response?.data?.message || tCommon('error'),
                variant: 'destructive',
            })
        } finally {
            setLoading(false)
        }
    }

    const handleTitleChange = (title: string) => {
        setFormData(prev => ({
            ...prev,
            title,
            slug: generateSlug(title),
            metaTitle: title
        }))
    }

    const handleContentChange = (content: string) => {
        console.log('Content updated:', content.substring(0, 100))
        setFormData(prev => ({
            ...prev,
            content
        }))
    }

    const validateForm = (): boolean => {
        const newErrors: Partial<PageFormData> = {}
        if (!formData.title.trim()) newErrors.title = t('validation.titleRequired')
        if (!formData.subtitle.trim()) newErrors.subtitle = t('validation.subtitleRequired')
        if (!formData.slug.trim()) newErrors.slug = t('validation.slugRequired')
        if (!formData.content.trim()) newErrors.content = t('validation.contentRequired')
        if (!formData.heroImage.trim()) newErrors.heroImage = t('validation.heroImageRequired')
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) {
            toast({
                title: tCommon('error'),
                description: 'Lütfen tüm zorunlu alanları doldurun',
                variant: 'destructive',
            })
            return
        }

        setSaving(true)
        try {
            console.log('Submitting data:', formData)
            await axios.put(`/pages/${pageId}`, formData)
            toast({ title: tCommon('success'), description: t('updateSuccess') })
            router.push('/pages')
        } catch (error: any) {
            console.error('Update error:', error)
            toast({
                title: tCommon('error'),
                description: error.response?.data?.message || tCommon('error'),
                variant: 'destructive',
            })
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        try {
            await axios.delete(`/pages/${pageId}`)
            toast({ title: tCommon('success'), description: t('deleteSuccess') })
            router.push('/pages')
        } catch (error: any) {
            toast({
                title: tCommon('error'),
                description: error.response?.data?.message || tCommon('error'),
                variant: 'destructive',
            })
        }
    }

    const handleMediaSelect = (url: string) => {
        setFormData(prev => ({ ...prev, heroImage: url }))
        setShowMediaPicker(false)
        toast({
            title: tCommon('success'),
            description: t('imageSelected'),
        })
    }

    if (!isMounted || loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-12 w-12 animate-spin text-primary-pink" />
            </div>
        )
    }

    return (
        <div className="w-full space-y-4 sm:space-y-6 px-2 sm:px-4 lg:px-0">
            {/* Header - Responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-primary-pink">
                    {t('edit.title')}
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setShowPreview(true)}
                        className="flex-1 sm:flex-none text-xs sm:text-sm"
                    >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        {t('preview')}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => setShowDeleteDialog(true)}
                        className="flex-1 sm:flex-none text-xs sm:text-sm"
                    >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        {tCommon('delete')}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => router.push('/pages')}
                        className="flex-1 sm:flex-none text-xs sm:text-sm"
                    >
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
                                {t('form.heroImage')} *
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 pt-0">
                            {formData.heroImage ? (
                                <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] rounded-lg overflow-hidden group">
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
                                            className="text-xs sm:text-sm"
                                        >
                                            <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                            {t('changeImage')}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => setFormData(prev => ({ ...prev, heroImage: '' }))}
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
                                    {t('form.title')} *
                                </Label>
                                <Input
                                    id="title"
                                    value={formData.title}
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
                                    {t('form.subtitle')} *
                                </Label>
                                <Input
                                    id="subtitle"
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
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
                                    {t('form.slug')} *
                                </Label>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                    <span className="text-gray-500 text-xs sm:text-sm whitespace-nowrap">
                                        yoursite.com/
                                    </span>
                                    <Input
                                        id="slug"
                                        value={formData.slug}
                                        onChange={(e) =>
                                            setFormData(prev => ({ ...prev, slug: e.target.value }))
                                        }
                                        placeholder={t('placeholders.slug')}
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
                                {t('form.content')} *
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 pt-0">
                            <div className="space-y-2">
                                <Tiptap
                                    key={editorKey}
                                    content={formData.content}
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
                                {t('form.seoSettings')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                            <div className="space-y-2">
                                <Label htmlFor="metaTitle" className="text-sm sm:text-base">
                                    {t('form.metaTitle')}
                                </Label>
                                <Input
                                    id="metaTitle"
                                    value={formData.metaTitle}
                                    onChange={(e) =>
                                        setFormData(prev => ({ ...prev, metaTitle: e.target.value }))
                                    }
                                    placeholder={t('placeholders.metaTitle')}
                                    className="text-sm sm:text-base"
                                />
                                <p className="text-xs text-gray-500">
                                    {formData.metaTitle.length}/60 {t('meta.titleLength')}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="metaDescription" className="text-sm sm:text-base">
                                    {t('form.metaDescription')}
                                </Label>
                                <Textarea
                                    id="metaDescription"
                                    value={formData.metaDescription}
                                    onChange={(e) =>
                                        setFormData(prev => ({ ...prev, metaDescription: e.target.value }))
                                    }
                                    rows={3}
                                    placeholder={t('placeholders.metaDescription')}
                                    className="text-sm sm:text-base"
                                />
                                <p className="text-xs text-gray-500">
                                    {formData.metaDescription.length}/160 {t('meta.descriptionLength')}
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
                                {t('form.publish')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-sm sm:text-base">
                                    {t('form.status')}
                                </Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) =>
                                        setFormData(prev => ({ ...prev, status: value as 'published' | 'draft' }))
                                    }
                                >
                                    <SelectTrigger className="text-sm sm:text-base">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft" className="text-sm sm:text-base">
                                            {t('status.draft')}
                                        </SelectItem>
                                        <SelectItem value="published" className="text-sm sm:text-base">
                                            {t('status.published')}
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
                                            {t('edit.saving')}
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                            {t('edit.save')}
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
                                {t('pageInfo')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-xs sm:text-sm p-4 sm:p-6 pt-0">
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

            {/* Preview Dialog - Responsive */}
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogContent className="max-w-[95vw] sm:max-w-6xl h-[90vh] p-4 sm:p-6">
                    <DialogHeader>
                        <DialogTitle className="text-base sm:text-lg">
                            {t('preview')}: {formData.title}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="overflow-auto h-full">
                        {/* Hero Section Preview */}
                        <section className="w-full relative h-[30vh] sm:h-[40vh] mb-4 sm:mb-8">
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
                                    <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-white p-4">
                                <h1 className="text-xl sm:text-3xl md:text-5xl font-bold mb-1 sm:mb-2 text-center">
                                    {formData.title || 'Başlık'}
                                </h1>
                                <p className="text-sm sm:text-lg md:text-2xl text-center">
                                    {formData.subtitle || 'Alt başlık'}
                                </p>
                            </div>
                        </section>

                        {/* Content Preview */}
                        <section className="max-w-5xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
                            <div
                                className="prose prose-sm sm:prose-base lg:prose-lg max-w-none"
                                dangerouslySetInnerHTML={{
                                    __html: formData.content || '<p>İçerik burada görünecek...</p>'
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
                            {t('edit.delete')}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-xs sm:text-sm">
                            {t('edit.deleteConfirm')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                        <AlertDialogCancel className="text-xs sm:text-sm">
                            {tCommon('cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 text-xs sm:text-sm"
                        >
                            {t('edit.delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}


