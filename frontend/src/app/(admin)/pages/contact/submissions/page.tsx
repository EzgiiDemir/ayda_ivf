'use client';

import { useState, useEffect } from 'react';
import axios from '@/src/lib/axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/src/components/ui/use-toast';
import { Mail, Trash2, Eye, Loader2, Inbox, CheckCircle2, Clock } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface Submission {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    locale: string;
    ip_address: string;
    is_read: boolean;
    created_at: string;
    updated_at: string;
}

export default function ContactSubmissionsPage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [showDetailDialog, setShowDetailDialog] = useState(false);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/contact/submissions');

            console.log('📦 API Response:', response.data);

            const submissionsData = response.data.data || [];

            console.log('📋 Submissions:', submissionsData);

            setSubmissions(submissionsData);

            if (submissionsData.length > 0) {
                toast({
                    title: '✅ Başarılı',
                    description: `${submissionsData.length} mesaj yüklendi`,
                });
            }
        } catch (error: any) {
            console.error('❌ Fetch error:', error);
            console.error('❌ Response:', error.response?.data);
            toast({
                title: '❌ Hata',
                description: error.response?.data?.message || 'Mesajlar yüklenirken bir hata oluştu',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id: number) => {
        try {
            await axios.patch(`/contact/submissions/${id}/read`);
            setSubmissions(submissions.map(s =>
                s.id === id ? { ...s, is_read: true } : s
            ));
            toast({
                title: '✅ Başarılı',
                description: 'Mesaj okundu olarak işaretlendi'
            });
        } catch (error: any) {
            console.error('❌ Mark as read error:', error);
            toast({
                title: '❌ Hata',
                description: 'İşlem başarısız',
                variant: 'destructive',
            });
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Bu mesajı silmek istediğinizden emin misiniz?')) return;

        try {
            await axios.delete(`/contact/submissions/${id}`);
            setSubmissions(submissions.filter(s => s.id !== id));
            toast({
                title: '✅ Başarılı',
                description: 'Mesaj silindi'
            });
        } catch (error: any) {
            console.error('❌ Delete error:', error);
            toast({
                title: '❌ Hata',
                description: 'Silme işlemi başarısız',
                variant: 'destructive',
            });
        }
    };

    const handleViewDetails = (submission: Submission) => {
        setSelectedSubmission(submission);
        setShowDetailDialog(true);
        if (!submission.is_read) {
            handleMarkAsRead(submission.id);
        }
    };

    const unreadCount = submissions.filter(s => !s.is_read).length;
    const todayCount = submissions.filter(s => {
        const today = new Date().toDateString();
        const msgDate = new Date(s.created_at).toDateString();
        return today === msgDate;
    }).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-12 w-12 animate-spin text-primary-pink" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-primary-pink flex items-center gap-2">
                    İletişim Mesajları
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <Inbox className="w-10 h-10 text-primary-pink" />
                            <div>
                                <p className="text-2xl font-bold">{submissions.length}</p>
                                <p className="text-sm text-gray-600">Toplam Mesaj</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <Clock className="w-10 h-10 text-yellow-500" />
                            <div>
                                <p className="text-2xl font-bold">{unreadCount}</p>
                                <p className="text-sm text-gray-600">Okunmamış</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                            <div>
                                <p className="text-2xl font-bold">{todayCount}</p>
                                <p className="text-sm text-gray-600">Bugün Gelen</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-24">Durum</TableHead>
                                    <TableHead>İsim</TableHead>
                                    <TableHead>E-posta</TableHead>
                                    <TableHead>Konu</TableHead>
                                    <TableHead className="w-32">Tarih</TableHead>
                                    <TableHead className="text-right w-32">İşlemler</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {submissions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12">
                                            <Inbox className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                                            <p className="text-gray-500">Henüz mesaj yok</p>
                                            <Button
                                                variant="outline"
                                                onClick={fetchSubmissions}
                                                className="mt-4"
                                            >
                                                Yenile
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    submissions.map((submission) => (
                                        <TableRow
                                            key={submission.id}
                                            className={!submission.is_read ? 'bg-pink-50' : ''}
                                        >
                                            <TableCell>
                                                <Badge
                                                    variant={submission.is_read ? 'secondary' : 'default'}
                                                    className={submission.is_read ? '' : 'bg-primary-pink'}
                                                >
                                                    {submission.is_read ? 'Okundu' : 'Yeni'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {submission.name}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {submission.email}
                                            </TableCell>
                                            <TableCell>{submission.subject}</TableCell>
                                            <TableCell className="text-sm text-gray-600">
                                                {new Date(submission.created_at).toLocaleDateString('tr-TR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-2 justify-end">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleViewDetails(submission)}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleDelete(submission.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Detail Dialog */}
            <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Mesaj Detayı</DialogTitle>
                        <DialogDescription>
                            {selectedSubmission &&
                                new Date(selectedSubmission.created_at).toLocaleString('tr-TR')}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedSubmission && (
                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm font-semibold text-gray-600">İsim</Label>
                                <p className="text-lg mt-1">{selectedSubmission.name}</p>
                            </div>

                            <div>
                                <Label className="text-sm font-semibold text-gray-600">E-posta</Label>
                                <p className="text-lg mt-1">
                                    <a
                                        href={`mailto:${selectedSubmission.email}`}
                                        className="text-primary-pink hover:underline"
                                    >
                                        {selectedSubmission.email}
                                    </a>
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-semibold text-gray-600">Konu</Label>
                                <p className="text-lg mt-1">{selectedSubmission.subject}</p>
                            </div>

                            <div>
                                <Label className="text-sm font-semibold text-gray-600">Mesaj</Label>
                                <div className="mt-2 p-4 bg-gray-50 rounded-lg border">
                                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                                        {selectedSubmission.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDetailDialog(false)}
                        >
                            Kapat
                        </Button>
                        {selectedSubmission && (
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    handleDelete(selectedSubmission.id);
                                    setShowDetailDialog(false);
                                }}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Sil
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
    return <label className={className}>{children}</label>;
}