'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import axios from '@/src/lib/axios'
import Image from 'next/image'
import {
    Search,
    Check,
    ChevronLeft,
    ChevronRight,
    Image as ImageIcon
} from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/src/components/ui/use-toast'

interface MediaFile {
    id: number
    name: string
    url: string
    mime_type: string
    size: number
    type: 'image' | 'video' | 'document' | 'other'
}

interface MediaPickerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSelect: (url: string) => void
    selectedUrl?: string
}

export default function MediaPicker({ open, onOpenChange, onSelect, selectedUrl }: MediaPickerProps) {
    const t = useTranslations('media')
    const tCommon = useTranslations('common')
    const { toast } = useToast()

    const [files, setFiles] = useState<MediaFile[]>([])
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedImage, setSelectedImage] = useState<string | null>(selectedUrl || null)
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        perPage: 12,
        total: 0,
    })

    useEffect(() => {
        if (open) {
            fetchMedia()
        }
    }, [open, pagination.currentPage, searchQuery])

    const fetchMedia = async () => {
        try {
            setLoading(true)
            const response = await axios.get('/media', {
                params: {
                    page: pagination.currentPage,
                    per_page: pagination.perPage,
                    search: searchQuery || undefined,
                    type: 'image', // Sadece resimleri getir
                },
            })

            setFiles(response.data.data)
            setPagination({
                ...pagination,
                total: response.data.meta.total,
                totalPages: response.data.meta.lastPage,
            })
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

    const handleSearch = () => {
        setPagination({ ...pagination, currentPage: 1 })
        fetchMedia()
    }

    const handleSelect = () => {
        if (selectedImage) {
            onSelect(selectedImage)
            onOpenChange(false)
        }
    }

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{t('selectImage')}</DialogTitle>
                </DialogHeader>

                {/* Search */}
                <div className="flex gap-2 mb-4">
                    <div className="flex-1 relative">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                        <Input
                            type="text"
                            placeholder={tCommon('search')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="pl-10"
                        />
                    </div>
                    <Button variant="outline" onClick={handleSearch}>
                        {tCommon('search')}
                    </Button>
                </div>

                {/* Media Grid */}
                <div className="flex-1 overflow-auto">
                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <Card key={i} className="aspect-square animate-pulse bg-gray-200" />
                            ))}
                        </div>
                    ) : files.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <ImageIcon className="w-16 h-16 mb-4" />
                            <p className="text-lg font-medium">{t('noFiles')}</p>
                            <p className="text-sm">{t('uploadFirstImage')}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {files.map((file) => (
                                <Card
                                    key={file.id}
                                    className={`relative aspect-square overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-primary-pink ${
                                        selectedImage === file.url ? 'ring-2 ring-primary-pink' : ''
                                    }`}
                                    onClick={() => setSelectedImage(file.url)}
                                >
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={file.url}
                                            alt={file.name}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement
                                                target.style.display = 'none'
                                            }}
                                        />
                                        {selectedImage === file.url && (
                                            <div className="absolute inset-0 bg-primary-pink/20 flex items-center justify-center">
                                                <div className="bg-primary-pink rounded-full p-2">
                                                    <Check className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                        <p className="text-xs text-white truncate">{file.name}</p>
                                        <p className="text-xs text-gray-300">{formatFileSize(file.size)}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {!loading && files.length > 0 && (
                    <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
                                disabled={pagination.currentPage === 1}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <span className="text-sm text-gray-600">
                                {pagination.currentPage} / {pagination.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
                                disabled={pagination.currentPage === pagination.totalPages}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-600">
                        {selectedImage && (
                            <Badge variant="secondary" className="bg-primary-pink text-white">
                                {t('imageSelected')}
                            </Badge>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            {tCommon('cancel')}
                        </Button>
                        <Button
                            onClick={handleSelect}
                            disabled={!selectedImage}
                            className="bg-primary-pink hover:bg-pink-700"
                        >
                            <Check className="w-4 h-4 mr-2" />
                            {t('selectImage')}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}