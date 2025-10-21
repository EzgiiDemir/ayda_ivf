// src/app/(admin)/admin/pages/contact/page.tsx
'use client';

import { useState, useEffect } from 'react';
import axios from '@/src/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/src/components/ui/use-toast';
import { Loader2, Save, Plus, Trash2, Image as ImageIcon, Mail } from 'lucide-react';
import MediaPicker from '@/src/components/MediaPicker';

interface ContactData {
    locale: string;
    banner_image: string;
    form_top_title: string;
    form_title: string;
    form_subjects: string[];
    submit_button_text: string;
}

export default function ContactEditorPage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showMediaPicker, setShowMediaPicker] = useState(false);

    const [contactData, setContactData] = useState<ContactData>({
        locale: 'tr',
        banner_image: '',
        form_top_title: '',
        form_title: '',
        form_subjects: [],
        submit_button_text: '',
    });

    const [newSubject, setNewSubject] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/contact?locale=tr');

            if (response.data.data) {
                setContactData(response.data.data);
            }
        } catch (error: any) {
            console.error('Fetch error:', error);
            toast({
                title: 'Hata',
                description: 'Veriler yüklenirken bir hata oluştu',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.put('/contact', contactData);
            toast({ title: 'Başarılı', description: 'Contact page güncellendi' });
        } catch (error: any) {
            console.error('Save error:', error.response?.data);
            toast({
                title: 'Hata',
                description: error.response?.data?.message || 'Güncelleme başarısız',
                variant: 'destructive',
            });
        } finally {
            setSaving(false);
        }
    };

    const addSubject = () => {
        if (newSubject.trim()) {
            setContactData({
                ...contactData,
                form_subjects: [...contactData.form_subjects, newSubject.trim()],
            });
            setNewSubject('');
        }
    };

    const removeSubject = (index: number) => {
        setContactData({
            ...contactData,
            form_subjects: contactData.form_subjects.filter((_, i) => i !== index),
        });
    };

    const updateSubject = (index: number, value: string) => {
        const newSubjects = [...contactData.form_subjects];
        newSubjects[index] = value;
        setContactData({ ...contactData, form_subjects: newSubjects });
    };

    const handleMediaSelect = (url: string) => {
        setContactData({ ...contactData, banner_image: url });
        setShowMediaPicker(false);
    };

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
                    İletişim
                </h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>İletişim Sayfası Ayarları</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-6">
                        {/* Banner Image */}
                        <div className="space-y-2">
                            <Label>Banner Görseli</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={contactData.banner_image || ''}
                                    onChange={(e) => setContactData({ ...contactData, banner_image: e.target.value })}
                                    placeholder="https://..."
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowMediaPicker(true)}
                                >
                                    <ImageIcon className="w-4 h-4" />
                                </Button>
                            </div>
                            {contactData.banner_image && (
                                <div className="mt-2">
                                    <img
                                        src={contactData.banner_image}
                                        alt="Banner Preview"
                                        className="w-full h-48 object-cover rounded-md"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Form Titles */}
                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold">Form Başlıkları</h3>

                            <div className="space-y-2">
                                <Label>Üst Başlık</Label>
                                <Input
                                    value={contactData.form_top_title || ''}
                                    onChange={(e) => setContactData({ ...contactData, form_top_title: e.target.value })}
                                    placeholder="Aşağıdaki formu doldurarak"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Ana Başlık</Label>
                                <Input
                                    value={contactData.form_title || ''}
                                    onChange={(e) => setContactData({ ...contactData, form_title: e.target.value })}
                                    placeholder="bizimle iletişime geçebilirsiniz"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Gönder Butonu Yazısı</Label>
                                <Input
                                    value={contactData.submit_button_text || ''}
                                    onChange={(e) => setContactData({ ...contactData, submit_button_text: e.target.value })}
                                    placeholder="Gönder"
                                />
                            </div>
                        </div>

                        {/* Form Subjects */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Form Konu Seçenekleri</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={newSubject}
                                        onChange={(e) => setNewSubject(e.target.value)}
                                        placeholder="Yeni konu ekle"
                                        className="w-64"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addSubject();
                                            }
                                        }}
                                    />
                                    <Button type="button" size="sm" onClick={addSubject} variant="outline">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Ekle
                                    </Button>
                                </div>
                            </div>

                            {contactData.form_subjects.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                                    Henüz konu eklenmedi. Yukarıdan konu ekleyebilirsiniz.
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {contactData.form_subjects.map((subject, index) => (
                                        <div key={index} className="flex gap-2 items-center">
                                            <Input
                                                value={subject}
                                                onChange={(e) => updateSubject(index, e.target.value)}
                                                placeholder="Konu adı"
                                            />
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => removeSubject(index)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="pt-4 border-t">
                            <Button type="submit" disabled={saving} className="bg-primary-pink hover:bg-pink-700">
                                {saving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Kaydediliyor...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Kaydet
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <MediaPicker
                open={showMediaPicker}
                onOpenChange={setShowMediaPicker}
                onSelect={handleMediaSelect}
            />
        </div>
    );
}