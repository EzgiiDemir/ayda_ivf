'use client';

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import axios from '@/src/lib/axios';
import Image from 'next/image';
import {
    Upload,
    Search,
    Grid3X3,
    List,
    Copy,
    Trash2,
    X,
    FileText,
    Image as ImageIcon,
    Video,
    File,
    Loader2,
    Download,
    Eye,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/src/components/ui/use-toast';

interface MediaFile {
    id: number;
    name: string;
    file_name: string;
    url: string;
    mime_type: string;
    size: number;
    type: 'image' | 'video' | 'document' | 'other';
    created_at: string;
    uploader?: {
        name: string;
    };
}

interface PaginationMeta {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
}

type ViewMode = 'grid' | 'list';

export default function MediaPage() {
    const t = useTranslations('admin');
    const tCommon = useTranslations('common');
    const tMedia = useTranslations('media');
    const { toast } = useToast();

    const [files, setFiles] = useState<MediaFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [error, setError] = useState<string | null>(null);
    const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);
    const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [pagination, setPagination] = useState<PaginationMeta>({
        total: 0,
        perPage: 20,
        currentPage: 1,
        lastPage: 1,
    });

    useEffect(() => {
        fetchMedia();
    }, [pagination.currentPage, pagination.perPage]);

    const fetchMedia = async () => {
        try {
            setLoading(true);
            setError(null);
            setImageErrors(new Set());
            const response = await axios.get('/media', {
                params: {
                    page: pagination.currentPage,
                    per_page: pagination.perPage,
                    search: searchQuery || undefined,
                },
            });

            console.log('📦 Media API Response:', response.data);
            console.log('🖼️ First file URL:', response.data.data[0]?.url);

            setFiles(response.data.data);
            setPagination({
                total: response.data.meta.total,
                perPage: response.data.meta.perPage,
                currentPage: response.data.meta.currentPage,
                lastPage: response.data.meta.lastPage,
            });
        } catch (err: any) {
            console.error('❌ Media fetch error:', err);
            setError(err.response?.data?.message || tCommon('error'));
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPagination({ ...pagination, currentPage: 1 });
        fetchMedia();
    };

    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles || selectedFiles.length === 0) return;

        setUploading(true);

        try {
            const formData = new FormData();
            Array.from(selectedFiles).forEach((file) => {
                formData.append('files[]', file);
            });

            const response = await axios.post('/media/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('✅ Upload response:', response.data);

            toast({
                title: tCommon('success'),
                description: tMedia('uploadSuccess'),
            });

            await fetchMedia();
        } catch (error: any) {
            console.error('❌ Upload error:', error);
            toast({
                title: tCommon('error'),
                description: error.response?.data?.message || tMedia('uploadError'),
                variant: 'destructive',
            });
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm(tMedia('deleteConfirm'))) return;

        try {
            await axios.delete(`/media/${id}`);
            setFiles(files.filter((file) => file.id !== id));
            toast({
                title: tCommon('success'),
                description: tMedia('deleteSuccess'),
            });
            fetchMedia();
        } catch (error: any) {
            toast({
                title: tCommon('error'),
                description: error.response?.data?.message || tCommon('error'),
                variant: 'destructive',
            });
        }
    };

    const handleBulkDelete = async () => {
        if (selectedFiles.length === 0) return;
        if (
            !confirm(
                tMedia('bulkDeleteConfirm').replace('{count}', selectedFiles.length.toString())
            )
        )
            return;

        try {
            await axios.post('/media/bulk-delete', { ids: selectedFiles });
            setFiles(files.filter((file) => !selectedFiles.includes(file.id)));
            setSelectedFiles([]);
            toast({
                title: tCommon('success'),
                description: tMedia('bulkDeleteSuccess'),
            });
            fetchMedia();
        } catch (error: any) {
            toast({
                title: tCommon('error'),
                description: error.response?.data?.message || tCommon('error'),
                variant: 'destructive',
            });
        }
    };

    const handleCopyUrl = (url: string) => {
        navigator.clipboard.writeText(url);
        toast({
            title: tCommon('success'),
            description: tMedia('urlCopied'),
        });
    };

    const handleDownload = async (file: MediaFile) => {
        try {
            const imageUrl = getImageUrl(file.url);
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.file_name;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('❌ Download error:', error);
            toast({
                title: tCommon('error'),
                description: tMedia('downloadError'),
                variant: 'destructive',
            });
        }
    };

    const handleImageError = (fileId: number, url: string) => {
        console.error(`❌ Image load error for file ID: ${fileId}`);
        console.error(`🔗 Failed URL: ${url}`);
        setImageErrors((prev) => new Set(prev).add(fileId));
    };

    const toggleSelectFile = (id: number) => {
        setSelectedFiles((prev) =>
            prev.includes(id) ? prev.filter((fileId) => fileId !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedFiles.length === files.length) {
            setSelectedFiles([]);
        } else {
            setSelectedFiles(files.map((f) => f.id));
        }
    };

    const handlePageChange = (newPage: number) => {
        setPagination({ ...pagination, currentPage: newPage });
    };

    const handlePerPageChange = (value: string) => {
        setPagination({ ...pagination, perPage: parseInt(value), currentPage: 1 });
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const getFileIcon = (type: string) => {
        if (type === 'image') return <ImageIcon className="w-6 h-6" />;
        if (type === 'video') return <Video className="w-6 h-6" />;
        if (type === 'document') return <FileText className="w-6 h-6" />;
        return <File className="w-6 h-6" />;
    };

    const getImageUrl = (url: string): string => {
        if (!url) return '';

        if (url.startsWith('http://') || url.startsWith('https://')) {
            console.log('✅ Full URL:', url);
            return url;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const fullUrl = url.startsWith('/') ? `${apiUrl}${url}` : `${apiUrl}/${url}`;

        console.log('🔗 Converted URL:', fullUrl);
        return fullUrl;
    };

    const filteredFiles = files.filter((file) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (error) {
        return (
            <div className="space-y-6">
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button onClick={fetchMedia}>{tCommon('retry')}</Button>
            </div>
        );
    }

    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.lastPage, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary-pink">{t('media')}</h1>
                </div>
                <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="bg-primary-pink hover:bg-pink-700"
                >
                    {uploading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {tCommon('uploading')}
                        </>
                    ) : (
                        <>
                            <Upload className="w-4 h-4 mr-2" />
                            {tMedia('uploadFile')}
                        </>
                    )}
                </Button>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,video/*,application/pdf,.doc,.docx"
                />
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 flex gap-2">
                            <div className="relative flex-1">
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

                        {/* View Mode */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant={viewMode === 'grid' ? 'default' : 'outline'}
                                size="icon"
                                onClick={() => setViewMode('grid')}
                                className={
                                    viewMode === 'grid' ? 'bg-primary-pink hover:bg-pink-700' : ''
                                }
                            >
                                <Grid3X3 className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'default' : 'outline'}
                                size="icon"
                                onClick={() => setViewMode('list')}
                                className={
                                    viewMode === 'list' ? 'bg-primary-pink hover:bg-pink-700' : ''
                                }
                            >
                                <List className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Bulk Actions */}
                    {selectedFiles.length > 0 && (
                        <div className="mt-4 flex items-center gap-4 p-3 bg-pink-50 rounded-lg">
                            <Badge variant="secondary" className="bg-primary-pink text-white">
                                {selectedFiles.length} {tMedia('filesSelected')}
                            </Badge>
                            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                {tCommon('delete')}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedFiles([])}
                            >
                                <X className="w-4 h-4 mr-2" />
                                {tCommon('cancel')}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Media Grid */}
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <Card key={i}>
                            <Skeleton className="aspect-square" />
                            <CardContent className="p-3">
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-3 w-16" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredFiles.map((file) => {
                        const imageUrl = getImageUrl(file.url);
                        return (
                            <Card
                                key={file.id}
                                className={`overflow-hidden hover:shadow-lg transition-shadow ${
                                    selectedFiles.includes(file.id)
                                        ? 'ring-2 ring-primary-pink'
                                        : ''
                                }`}
                            >
                                <div className="aspect-square bg-gray-100 flex items-center justify-center relative group">
                                    {file.type === 'image' && !imageErrors.has(file.id) ? (
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={imageUrl}
                                                alt={file.name}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                                onError={() => handleImageError(file.id, imageUrl)}
                                                onLoad={() =>
                                                    console.log('✅ Image loaded:', imageUrl)
                                                }
                                            />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <Button
                                                    variant="secondary"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setPreviewFile(file);
                                                    }}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-gray-400">{getFileIcon(file.type)}</div>
                                    )}
                                    <div className="absolute top-2 right-2">
                                        <Checkbox
                                            checked={selectedFiles.includes(file.id)}
                                            onCheckedChange={() => toggleSelectFile(file.id)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                    <div className="absolute top-2 left-2">
                                        <Badge
                                            variant="outline"
                                            className="bg-white font-mono text-xs"
                                        >
                                            #{file.id}
                                        </Badge>
                                    </div>
                                </div>
                                <CardContent className="p-3">
                                    <p
                                        className="text-sm font-medium text-gray-800 truncate"
                                        title={file.name}
                                    >
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500 mb-2">
                                        {formatFileSize(file.size)}
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 h-7 text-xs"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCopyUrl(imageUrl);
                                            }}
                                        >
                                            <Copy className="w-3 h-3 mr-1" />
                                            URL
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 px-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(file.id);
                                            }}
                                        >
                                            <Trash2 className="w-3 h-3 text-red-600" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <Card>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">
                                        <Checkbox
                                            checked={
                                                selectedFiles.length === filteredFiles.length &&
                                                filteredFiles.length > 0
                                            }
                                            onCheckedChange={toggleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead className="w-20">ID</TableHead>
                                    <TableHead>{tMedia('fileName')}</TableHead>
                                    <TableHead>{tMedia('fileType')}</TableHead>
                                    <TableHead>{tMedia('fileSize')}</TableHead>
                                    <TableHead>{tMedia('uploadDate')}</TableHead>
                                    <TableHead className="text-right">
                                        {tCommon('actions')}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredFiles.map((file) => {
                                    const imageUrl = getImageUrl(file.url);
                                    return (
                                        <TableRow key={file.id} className="hover:bg-gray-50">
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedFiles.includes(file.id)}
                                                    onCheckedChange={() => toggleSelectFile(file.id)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="font-mono">
                                                    #{file.id}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                                                        {file.type === 'image' &&
                                                        !imageErrors.has(file.id) ? (
                                                            <Image
                                                                src={imageUrl}
                                                                alt={file.name}
                                                                fill
                                                                className="object-cover"
                                                                unoptimized
                                                                onError={() =>
                                                                    handleImageError(
                                                                        file.id,
                                                                        imageUrl
                                                                    )
                                                                }
                                                            />
                                                        ) : (
                                                            <div className="text-gray-400">
                                                                {getFileIcon(file.type)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-gray-900 truncate">
                                                            {file.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {file.mime_type.split('/')[1]?.toUpperCase() ||
                                                        'FILE'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{formatFileSize(file.size)}</TableCell>
                                            <TableCell>
                                                {new Date(file.created_at).toLocaleDateString(
                                                    'tr-TR'
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-end gap-2">
                                                    {file.type === 'image' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setPreviewFile(file)}
                                                            title={tMedia('preview')}
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleCopyUrl(imageUrl)}
                                                        title={tMedia('copyUrl')}
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(file.id)}
                                                        title={tCommon('delete')}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-600" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            )}

            {/* Empty State */}
            {!loading && filteredFiles.length === 0 && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <ImageIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {tMedia('noFiles')}
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">{tMedia('noFilesDesc')}</p>
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-primary-pink hover:bg-pink-700"
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            {tMedia('uploadFile')}
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Pagination */}
            {!loading && files.length > 0 && (
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <Select
                                    value={pagination.perPage.toString()}
                                    onValueChange={handlePerPageChange}
                                >
                                    <SelectTrigger className="w-20">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="20">20</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                        <SelectItem value="100">100</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-1">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePageChange(1)}
                                    disabled={pagination.currentPage === 1}
                                >
                                    <ChevronsLeft className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    disabled={pagination.currentPage === 1}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>

                                {pageNumbers.map((pageNum) => (
                                    <Button
                                        key={pageNum}
                                        variant={
                                            pageNum === pagination.currentPage
                                                ? 'default'
                                                : 'outline'
                                        }
                                        size="icon"
                                        onClick={() => handlePageChange(pageNum)}
                                        className={
                                            pageNum === pagination.currentPage
                                                ? 'bg-primary-pink hover:bg-pink-700'
                                                : ''
                                        }
                                    >
                                        {pageNum}
                                    </Button>
                                ))}

                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    disabled={pagination.currentPage === pagination.lastPage}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePageChange(pagination.lastPage)}
                                    disabled={pagination.currentPage === pagination.lastPage}
                                >
                                    <ChevronsRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Image Preview Dialog */}
            <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>{previewFile?.name}</DialogTitle>
                    </DialogHeader>
                    {previewFile && previewFile.type === 'image' && (
                        <div className="relative w-full aspect-video">
                            <Image
                                src={getImageUrl(previewFile.url)}
                                alt={previewFile.name}
                                fill
                                className="object-contain"
                                unoptimized
                                onError={(e) => {
                                    console.error('❌ Preview image error:', getImageUrl(previewFile.url));
                                }}
                            />
                        </div>
                    )}
                    <div className="flex gap-2 justify-end">
                        <Button
                            variant="outline"
                            onClick={() => handleCopyUrl(getImageUrl(previewFile?.url || ''))}
                        >
                            <Copy className="w-4 h-4 mr-2" />
                            {tMedia('copyUrl')}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => previewFile && handleDownload(previewFile)}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            {tMedia('download')}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}