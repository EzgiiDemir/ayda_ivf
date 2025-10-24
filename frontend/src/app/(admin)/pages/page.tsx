'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import axios from '@/src/lib/axios';
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Eye,
    MoreHorizontal,
    FileText,
    X,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Zap,
    Loader2,
    CheckCircle2,
    XCircle,
    AlertCircle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
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
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/src/components/ui/use-toast';

interface Page {
    id: number;
    title: string;
    slug: string;
    status: 'published' | 'draft';
    author: {
        name: string;
    };
    created_at: string;
    updated_at: string;
}

interface PaginationMeta {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
}

interface BulkCreateResult {
    slug: string;
    title: string;
    status: 'success' | 'error' | 'skipped';
    message: string;
}

type StatusFilter = 'all' | 'published' | 'draft';
type SortField = 'id' | 'title' | 'updated_at' | 'created_at';
type SortOrder = 'asc' | 'desc';

const NAVBAR_PAGES = [
    { title: 'Neden Biz?', slug: 'why-us', subtitle: 'Ayda IVF olarak neden bizi tercih etmelisiniz?' },
    { title: 'Fiyatlarımız', slug: 'our-prices', subtitle: 'Şeffaf ve uygun fiyat politikamız' },
    { title: 'Ekibimiz', slug: 'our-team', subtitle: 'Uzman ve deneyimli kadromuz' },
    { title: 'Başarı Oranlarımız', slug: 'our-success-rates', subtitle: 'Yüksek başarı oranlarımız' },
    { title: 'IVF-ICSI', slug: 'ivf-icsi', subtitle: 'Tüp Bebek Tedavisi' },
    { title: 'Yumurta Donasyonu', slug: 'egg-donation', subtitle: 'Yumurta bağışı tedavisi' },
    { title: 'Sperm Donasyonu', slug: 'sperm-donation', subtitle: 'Sperm bağışı tedavisi' },
    { title: 'Embriyo Donasyonu', slug: 'embryo-donation', subtitle: 'Embriyo bağışı tedavisi' },
    { title: 'Yumurta Dondurma', slug: 'egg-freezing', subtitle: 'Yumurta dondurma işlemi' },
    { title: 'Ovarian Endometrial PRP', slug: 'ovarian-endometrial-prp', subtitle: 'PRP tedavisi' },
    { title: 'Akupunktur', slug: 'acupuncture', subtitle: 'Akupunktur desteği' },
    { title: 'Sıkça Sorulan Sorular', slug: 'faq', subtitle: 'Merak ettikleriniz' },
    { title: 'Seyahat', slug: 'travel', subtitle: 'Seyahat ve konaklama bilgileri' },
    { title: 'İletişim', slug: 'contact', subtitle: 'Bizimle iletişime geçin' },
];

export default function PagesListPage() {
    const router = useRouter();
    const t = useTranslations('admin');
    const tCommon = useTranslations('common');
    const tPages = useTranslations('pages');
    const { toast } = useToast();

    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');
    const [selectedPages, setSelectedPages] = useState<number[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [sortField, setSortField] = useState<SortField>('updated_at');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [pagination, setPagination] = useState<PaginationMeta>({
        total: 0,
        perPage: 10,
        currentPage: 1,
        lastPage: 1,
    });

    const [showBulkDialog, setShowBulkDialog] = useState(false);
    const [bulkCreating, setBulkCreating] = useState(false);
    const [bulkResults, setBulkResults] = useState<BulkCreateResult[]>([]);
    const [currentProcessing, setCurrentProcessing] = useState('');

    useEffect(() => {
        fetchPages();
    }, [pagination.currentPage, pagination.perPage, filterStatus, sortField, sortOrder]);

    const fetchPages = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('/pages', {
                params: {
                    page: pagination.currentPage,
                    per_page: pagination.perPage,
                    search: searchQuery || undefined,
                    status: filterStatus !== 'all' ? filterStatus : undefined,
                    sortBy: sortField,
                    sortOrder: sortOrder,
                },
            });

            setPages(response.data.data);
            setPagination({
                total: response.data.meta.total,
                perPage: response.data.meta.perPage,
                currentPage: response.data.meta.currentPage,
                lastPage: response.data.meta.lastPage,
            });
        } catch (err: any) {
            console.error('Pages fetch error:', err);
            setError(err.response?.data?.message || tCommon('error'));
        } finally {
            setLoading(false);
        }
    };

    const checkPageExists = async (slug: string): Promise<boolean> => {
        try {
            const response = await axios.get('/pages', {
                params: { search: slug }
            });
            return response.data.data.some((page: Page) => page.slug === slug);
        } catch {
            return false;
        }
    };

    const handleBulkCreate = async () => {
        setBulkCreating(true);
        setBulkResults([]);
        const results: BulkCreateResult[] = [];

        for (const page of NAVBAR_PAGES) {
            setCurrentProcessing(page.title);

            try {
                const exists = await checkPageExists(page.slug);

                if (exists) {
                    results.push({
                        slug: page.slug,
                        title: page.title,
                        status: 'skipped',
                        message: 'Sayfa zaten mevcut'
                    });
                    setBulkResults([...results]);
                    await new Promise(resolve => setTimeout(resolve, 100));
                    continue;
                }

                await axios.post('/pages', {
                    locale: 'tr',
                    title: page.title,
                    subtitle: page.subtitle,
                    slug: page.slug,
                    content: `<h1>${page.title}</h1><p>${page.subtitle}</p><p>Bu sayfa henüz düzenlenmemiş. Lütfen admin panelden içeriği ekleyin.</p>`,
                    heroImage: 'https://api.aydaivf.com/uploads/ayda_logo_9e8994bffd.png',
                    metaTitle: `${page.title} | Ayda IVF`,
                    metaDescription: page.subtitle,
                    status: 'draft',
                });

                await axios.post('/pages', {
                    locale: 'en',
                    title: page.title,
                    subtitle: page.subtitle,
                    slug: page.slug,
                    content: `<h1>${page.title}</h1><p>${page.subtitle}</p><p>This page has not been edited yet. Please add content from the admin panel.</p>`,
                    heroImage: 'https://api.aydaivf.com/uploads/ayda_logo_9e8994bffd.png',
                    metaTitle: `${page.title} | Ayda IVF`,
                    metaDescription: page.subtitle,
                    status: 'draft',
                });

                results.push({
                    slug: page.slug,
                    title: page.title,
                    status: 'success',
                    message: 'Başarıyla oluşturuldu (TR + EN)'
                });

            } catch (error: any) {
                const errorMessage = error.response?.data?.message || error.message || 'Bilinmeyen hata';

                results.push({
                    slug: page.slug,
                    title: page.title,
                    status: 'error',
                    message: errorMessage
                });
            }

            setBulkResults([...results]);
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        setBulkCreating(false);
        setCurrentProcessing('');

        const successCount = results.filter(r => r.status === 'success').length;
        const skippedCount = results.filter(r => r.status === 'skipped').length;
        const errorCount = results.filter(r => r.status === 'error').length;

        toast({
            title: 'İşlem Tamamlandı',
            description: `✅ ${successCount} oluşturuldu | ⏭️ ${skippedCount} atlandı | ❌ ${errorCount} hata`,
        });

        fetchPages();
    };

    const handleSearch = () => {
        setPagination({ ...pagination, currentPage: 1 });
        fetchPages();
    };

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm(tPages('deleteConfirm'))) return;

        try {
            await axios.delete(`/pages/${id}`);
            setPages(pages.filter((page) => page.id !== id));
            toast({
                title: tCommon('success'),
                description: tPages('deleteSuccess'),
            });
            fetchPages();
        } catch (error: any) {
            toast({
                title: tCommon('error'),
                description: error.response?.data?.message || tCommon('error'),
                variant: 'destructive',
            });
        }
    };

    const handleBulkDelete = async () => {
        if (selectedPages.length === 0) return;
        if (!confirm(tPages('bulkDeleteConfirm').replace('{count}', selectedPages.length.toString()))) return;

        try {
            await axios.post('/pages/bulk-delete', { ids: selectedPages });
            setPages(pages.filter((page) => !selectedPages.includes(page.id)));
            setSelectedPages([]);
            toast({
                title: tCommon('success'),
                description: tPages('bulkDeleteSuccess'),
            });
            fetchPages();
        } catch (error: any) {
            toast({
                title: tCommon('error'),
                description: error.response?.data?.message || tCommon('error'),
                variant: 'destructive',
            });
        }
    };

    const toggleSelectPage = (id: number) => {
        setSelectedPages((prev) =>
            prev.includes(id) ? prev.filter((pageId) => pageId !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedPages.length === pages.length) {
            setSelectedPages([]);
        } else {
            setSelectedPages(pages.map((page) => page.id));
        }
    };

    const handlePageChange = (newPage: number) => {
        setPagination({ ...pagination, currentPage: newPage });
    };

    const handlePerPageChange = (value: string) => {
        setPagination({ ...pagination, perPage: parseInt(value), currentPage: 1 });
    };

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) {
            return <ArrowUpDown className="w-4 h-4 ml-1 text-gray-400" />;
        }
        return sortOrder === 'asc' ? (
            <ArrowUp className="w-4 h-4 ml-1 text-primary-pink" />
        ) : (
            <ArrowDown className="w-4 h-4 ml-1 text-primary-pink" />
        );
    };

    if (error) {
        return (
            <div className="space-y-6">
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button onClick={fetchPages}>{tCommon('retry')}</Button>
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

    const successCount = bulkResults.filter(r => r.status === 'success').length;
    const skippedCount = bulkResults.filter(r => r.status === 'skipped').length;
    const errorCount = bulkResults.filter(r => r.status === 'error').length;

    return (
        <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-primary-pink">{t('pages')}</h1>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button
                        variant="outline"
                        onClick={() => setShowBulkDialog(true)}
                        className="border-primary-pink text-primary-pink hover:bg-pink-50 w-full sm:w-auto text-xs sm:text-sm"
                    >
                        <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        {t('bulkCreate')} ({NAVBAR_PAGES.length})
                    </Button>
                    <Button asChild className="bg-primary-pink hover:bg-pink-700 w-full sm:w-auto text-xs sm:text-sm">
                        <Link href="/pages/create">
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            {tPages('createNew')}
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col gap-3 sm:gap-4">
                        {/* Search */}
                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="relative flex-1">
                                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 top-2 sm:top-2.5" />
                                <Input
                                    type="text"
                                    placeholder={tCommon('search')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className="pl-9 sm:pl-10 text-sm"
                                />
                            </div>
                            <Button variant="outline" onClick={handleSearch} className="text-xs sm:text-sm">
                                {tCommon('search')}
                            </Button>
                        </div>

                        {/* Status Filter */}
                        <div className="flex gap-2 flex-wrap">
                            <Button
                                variant={filterStatus === 'all' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilterStatus('all')}
                                className={`text-xs ${filterStatus === 'all' ? 'bg-primary-pink hover:bg-pink-700' : ''}`}
                            >
                                {tPages('all')}
                            </Button>
                            <Button
                                variant={filterStatus === 'published' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilterStatus('published')}
                                className={`text-xs ${filterStatus === 'published' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                            >
                                {tCommon('published')}
                            </Button>
                            <Button
                                variant={filterStatus === 'draft' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilterStatus('draft')}
                                className={`text-xs ${filterStatus === 'draft' ? 'bg-yellow-400 hover:bg-yellow-500' : ''}`}
                            >
                                {tCommon('draft')}
                            </Button>
                        </div>

                        {/* Bulk Actions */}
                        {selectedPages.length > 0 && (
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-3 bg-pink-50 rounded-lg">
                                <Badge variant="secondary" className="bg-primary-pink text-white text-xs">
                                    {selectedPages.length} {tPages('itemsSelected')}
                                </Badge>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <Button variant="destructive" size="sm" onClick={handleBulkDelete} className="flex-1 sm:flex-none text-xs">
                                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                        {tCommon('delete')}
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => setSelectedPages([])} className="flex-1 sm:flex-none text-xs">
                                        <X className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                        {tCommon('cancel')}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-8 sm:w-12">
                                    <Checkbox
                                        checked={selectedPages.length === pages.length && pages.length > 0}
                                        onCheckedChange={toggleSelectAll}
                                    />
                                </TableHead>
                                <TableHead className="w-12 sm:w-20">
                                    <button
                                        onClick={() => handleSort('id')}
                                        className="flex items-center hover:text-primary-pink font-semibold text-xs sm:text-sm"
                                    >
                                        ID
                                        <SortIcon field="id" />
                                    </button>
                                </TableHead>
                                <TableHead className="min-w-[150px]">
                                    <button
                                        onClick={() => handleSort('title')}
                                        className="flex items-center hover:text-primary-pink font-semibold text-xs sm:text-sm"
                                    >
                                        {tPages('title')}
                                        <SortIcon field="title" />
                                    </button>
                                </TableHead>
                                <TableHead className="hidden sm:table-cell text-xs sm:text-sm">{tPages('slug')}</TableHead>
                                <TableHead className="text-xs sm:text-sm">{tPages('statusPage')}</TableHead>
                                <TableHead className="hidden md:table-cell text-xs sm:text-sm">{tPages('author')}</TableHead>
                                <TableHead className="hidden lg:table-cell">
                                    <button
                                        onClick={() => handleSort('updated_at')}
                                        className="flex items-center hover:text-primary-pink font-semibold text-xs sm:text-sm"
                                    >
                                        {tPages('updatedAt')}
                                        <SortIcon field="updated_at" />
                                    </button>
                                </TableHead>
                                <TableHead className="text-right text-xs sm:text-sm">{tCommon('actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-32 sm:w-48" /></TableCell>
                                        <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                                        <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-28" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                    </TableRow>
                                ))
                            ) : pages.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 sm:py-12">
                                        <FileText className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400 mb-2" />
                                        <h3 className="text-sm font-medium text-gray-900">{tPages('noPages')}</h3>
                                        <p className="text-xs sm:text-sm text-gray-500 mt-1">{tPages('noPagesDesc')}</p>
                                        <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
                                            <Button
                                                variant="outline"
                                                onClick={() => setShowBulkDialog(true)}
                                                className="border-primary-pink text-primary-pink text-xs sm:text-sm"
                                            >
                                                <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                                Toplu Oluştur
                                            </Button>
                                            <Button asChild className="bg-primary-pink hover:bg-pink-700 text-xs sm:text-sm">
                                                <Link href="/pages/create">
                                                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                                    {tPages('createNew')}
                                                </Link>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pages.map((page) => (
                                    <TableRow key={page.id} className="hover:bg-gray-50">
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedPages.includes(page.id)}
                                                onCheckedChange={() => toggleSelectPage(page.id)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-mono text-xs">
                                                #{page.id}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-pink-100 rounded flex items-center justify-center flex-shrink-0">
                                                    <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-primary-pink" />
                                                </div>
                                                <div className="font-semibold text-gray-900 text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">{page.title}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <span className="text-xs text-gray-600 font-mono">/{page.slug}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={page.status === 'published' ? 'default' : 'secondary'}
                                                className={`text-xs ${
                                                    page.status === 'published'
                                                        ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                                        : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                                                }`}
                                            >
                                                {page.status === 'published' ? tCommon('published') : tCommon('draft')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <span className="text-xs text-gray-600">{page.author.name}</span>
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            <div className="text-xs text-gray-600">
                                                <div>{new Date(page.updated_at).toLocaleDateString('tr-TR')}</div>
                                                <div className="text-xs text-gray-400">
                                                    {new Date(page.updated_at).toLocaleTimeString('tr-TR', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                                                            <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/pages/${page.id}/edit`} className="cursor-pointer text-xs sm:text-sm">
                                                                <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                                                {tCommon('edit')}
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/${page.slug}`} target="_blank" className="cursor-pointer text-xs sm:text-sm">
                                                                <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                                                {tCommon('view')}
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(page.id)}
                                                            className="text-red-600 cursor-pointer text-xs sm:text-sm"
                                                        >
                                                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                                            {tCommon('delete')}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {!loading && pages.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 px-3 sm:px-6 py-3 sm:py-4 border-t">
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
                            <span className="text-xs sm:text-sm text-gray-600">{tPages('showPerPage')}</span>
                            <Select value={pagination.perPage.toString()} onValueChange={handlePerPageChange}>
                                <SelectTrigger className="w-16 sm:w-20 text-xs sm:text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-1 overflow-x-auto max-w-full">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(1)}
                                disabled={pagination.currentPage === 1}
                                className="h-7 w-7 sm:h-9 sm:w-9 flex-shrink-0"
                            >
                                <ChevronsLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                disabled={pagination.currentPage === 1}
                                className="h-7 w-7 sm:h-9 sm:w-9 flex-shrink-0"
                            >
                                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>

                            {pageNumbers.map((pageNum) => (
                                <Button
                                    key={pageNum}
                                    variant={pageNum === pagination.currentPage ? 'default' : 'outline'}
                                    size="icon"
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`h-7 w-7 sm:h-9 sm:w-9 flex-shrink-0 text-xs sm:text-sm ${
                                        pageNum === pagination.currentPage ? 'bg-primary-pink hover:bg-pink-700' : ''
                                    }`}
                                >
                                    {pageNum}
                                </Button>
                            ))}

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                disabled={pagination.currentPage === pagination.lastPage}
                                className="h-7 w-7 sm:h-9 sm:w-9 flex-shrink-0"
                            >
                                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(pagination.lastPage)}
                                disabled={pagination.currentPage === pagination.lastPage}
                                className="h-7 w-7 sm:h-9 sm:w-9 flex-shrink-0"
                            >
                                <ChevronsRight className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Bulk Create Dialog */}
            <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
                <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="text-base sm:text-lg">Toplu Sayfa Oluştur</DialogTitle>
                    </DialogHeader>

                    {/* Pages List */}
                    {!bulkCreating && bulkResults.length === 0 && (
                        <div className="space-y-2 max-h-[40vh] overflow-y-auto px-1">
                            {NAVBAR_PAGES.map((page) => (
                                <div key={page.slug} className="border rounded p-2 sm:p-3">
                                    <h4 className="font-semibold text-xs sm:text-sm">{page.title}</h4>
                                    <p className="text-xs text-gray-600">{page.subtitle}</p>
                                    <p className="text-xs text-gray-400 font-mono">/{page.slug}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Progress */}
                    {bulkCreating && (
                        <div className="space-y-3 sm:space-y-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-primary-pink h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(bulkResults.length / NAVBAR_PAGES.length) * 100}%` }}
                                />
                            </div>
                            <div className="text-center">
                                <p className="text-xs sm:text-sm text-gray-600 font-medium">
                                    {bulkResults.length} / {NAVBAR_PAGES.length} işlendi
                                </p>
                                {currentProcessing && (
                                    <p className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-2">
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        {currentProcessing}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Results */}
                    {bulkResults.length > 0 && (
                        <div className="space-y-2 max-h-[40vh] overflow-y-auto px-1">
                            {/* Summary */}
                            <div className="grid grid-cols-3 gap-2 mb-3">
                                <div className="bg-green-50 border border-green-200 rounded p-2 text-center">
                                    <div className="flex items-center justify-center gap-1 text-green-700">
                                        <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span className="text-xs sm:text-sm font-semibold">{successCount}</span>
                                    </div>
                                    <p className="text-xs text-green-600 mt-1">Başarılı</p>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded p-2 text-center">
                                    <div className="flex items-center justify-center gap-1 text-blue-700">
                                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span className="text-xs sm:text-sm font-semibold">{skippedCount}</span>
                                    </div>
                                    <p className="text-xs text-blue-600 mt-1">Atlandı</p>
                                </div>
                                <div className="bg-red-50 border border-red-200 rounded p-2 text-center">
                                    <div className="flex items-center justify-center gap-1 text-red-700">
                                        <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span className="text-xs sm:text-sm font-semibold">{errorCount}</span>
                                    </div>
                                    <p className="text-xs text-red-600 mt-1">Hata</p>
                                </div>
                            </div>

                            {/* Detailed Results */}
                            {bulkResults.map((result, index) => (
                                <div
                                    key={index}
                                    className={`border rounded p-2 sm:p-3 ${
                                        result.status === 'success'
                                            ? 'bg-green-50 border-green-200'
                                            : result.status === 'skipped'
                                                ? 'bg-blue-50 border-blue-200'
                                                : 'bg-red-50 border-red-200'
                                    }`}
                                >
                                    <div className="flex items-start gap-2">
                                        {result.status === 'success' && (
                                            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        )}
                                        {result.status === 'skipped' && (
                                            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        )}
                                        {result.status === 'error' && (
                                            <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-xs sm:text-sm truncate">{result.title}</h4>
                                            <p className="text-xs text-gray-600 font-mono truncate">/{result.slug}</p>
                                            <p
                                                className={`text-xs mt-1 ${
                                                    result.status === 'success'
                                                        ? 'text-green-700'
                                                        : result.status === 'skipped'
                                                            ? 'text-blue-700'
                                                            : 'text-red-700'
                                                }`}
                                            >
                                                {result.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowBulkDialog(false);
                                setBulkResults([]);
                                setCurrentProcessing('');
                            }}
                            disabled={bulkCreating}
                            className="w-full sm:w-auto text-xs sm:text-sm"
                        >
                            {bulkResults.length > 0 ? 'Kapat' : 'İptal'}
                        </Button>
                        {bulkResults.length === 0 && (
                            <Button
                                onClick={handleBulkCreate}
                                disabled={bulkCreating}
                                className="bg-primary-pink hover:bg-pink-700 w-full sm:w-auto text-xs sm:text-sm"
                            >
                                {bulkCreating ? (
                                    <>
                                        <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-spin" />
                                        Oluşturuluyor... ({bulkResults.length}/{NAVBAR_PAGES.length})
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                        {NAVBAR_PAGES.length} Sayfayı Oluştur
                                    </>
                                )}
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}