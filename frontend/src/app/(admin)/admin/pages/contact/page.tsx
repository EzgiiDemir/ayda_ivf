'use client';

import { useState, useEffect } from 'react';
import axios from '@/src/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/src/components/ui/use-toast';
import { Loader2, Save, Plus, Trash2, Image as ImageIcon, Languages } from 'lucide-react';
import MediaPicker from '@/src/components/MediaPicker';

interface ContactLocaleData {
    banner_image: string;
    form_top_title: string;
    form_title: string;
    form_subjects: string[];
    submit_button_text: string;
    submit_button_loading: string;
    fields: {
        name: {
            label: string;
            placeholder: string;
            required_message: string;
        };
        email: {
            label: string;
            placeholder: string;
            required_message: string;
            invalid_message: string;
        };
        subject: {
            label: string;
            placeholder: string;
            required_message: string;
        };
        message: {
            label: string;
            placeholder: string;
            required_message: string;
        };
    };
    messages: {
        success: string;
        error: string;
    };
}

interface ContactData {
    tr: ContactLocaleData;
    en: ContactLocaleData;
}

const DEFAULT_LOCALE_DATA: ContactLocaleData = {
    banner_image: '',
    form_top_title: '',
    form_title: '',
    form_subjects: [],
    submit_button_text: '',
    submit_button_loading: '',
    fields: {
        name: {
            label: '',
            placeholder: '',
            required_message: ''
        },
        email: {
            label: '',
            placeholder: '',
            required_message: '',
            invalid_message: ''
        },
        subject: {
            label: '',
            placeholder: '',
            required_message: ''
        },
        message: {
            label: '',
            placeholder: '',
            required_message: ''
        }
    },
    messages: {
        success: '',
        error: ''
    }
};

export default function ContactEditorPage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeLocale, setActiveLocale] = useState<'tr' | 'en'>('tr');
    const [showMediaPicker, setShowMediaPicker] = useState(false);

    const [contactData, setContactData] = useState<ContactData>({
        tr: { ...DEFAULT_LOCALE_DATA },
        en: { ...DEFAULT_LOCALE_DATA },
    });

    const [newSubject, setNewSubject] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            const [trResponse, enResponse] = await Promise.all([
                axios.get('/contact?locale=tr'),
                axios.get('/contact?locale=en'),
            ]);

            const processData = (data: any): ContactLocaleData => ({
                banner_image: data.banner_image || '',
                form_top_title: data.form_top_title || '',
                form_title: data.form_title || '',
                form_subjects: data.form_subjects || [],
                submit_button_text: data.submit_button_text || '',
                submit_button_loading: data.submit_button_loading || '',
                fields: data.fields || DEFAULT_LOCALE_DATA.fields,
                messages: data.messages || DEFAULT_LOCALE_DATA.messages,
            });

            setContactData({
                tr: trResponse.data.data ? processData(trResponse.data.data) : { ...DEFAULT_LOCALE_DATA },
                en: enResponse.data.data ? processData(enResponse.data.data) : { ...DEFAULT_LOCALE_DATA },
            });

            toast({
                title: '✅ Başarılı',
                description: 'İletişim verileri yüklendi',
            });
        } catch (error: any) {
            console.error('❌ Fetch error:', error);
            toast({
                title: '❌ Hata',
                description: 'Veriler yüklenirken hata oluştu',
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
            await Promise.all([
                axios.put('/contact', { ...contactData.tr, locale: 'tr' }),
                axios.put('/contact', { ...contactData.en, locale: 'en' }),
            ]);

            toast({
                title: '✅ Başarılı',
                description: 'İletişim ayarları her iki dil için kaydedildi',
            });

            await fetchData();
        } catch (error: any) {
            console.error('❌ Save error:', error.response?.data);
            toast({
                title: '❌ Hata',
                description: error.response?.data?.message || 'Kayıt sırasında hata oluştu',
                variant: 'destructive',
            });
        } finally {
            setSaving(false);
        }
    };

    const updateField = (field: keyof ContactLocaleData, value: any) => {
        setContactData({
            ...contactData,
            [activeLocale]: { ...contactData[activeLocale], [field]: value },
        });
    };

    const updateNestedField = (path: string[], value: any) => {
        const currentData = { ...contactData[activeLocale] };
        let obj: any = currentData;

        for (let i = 0; i < path.length - 1; i++) {
            obj = obj[path[i]];
        }

        obj[path[path.length - 1]] = value;

        setContactData({
            ...contactData,
            [activeLocale]: currentData,
        });
    };

    const addSubject = () => {
        if (newSubject.trim()) {
            const currentData = contactData[activeLocale];
            updateField('form_subjects', [...currentData.form_subjects, newSubject.trim()]);
            setNewSubject('');
        }
    };

    const removeSubject = (index: number) => {
        const currentData = contactData[activeLocale];
        updateField('form_subjects', currentData.form_subjects.filter((_, i) => i !== index));
    };

    const updateSubject = (index: number, value: string) => {
        const currentData = contactData[activeLocale];
        const newSubjects = [...currentData.form_subjects];
        newSubjects[index] = value;
        updateField('form_subjects', newSubjects);
    };

    const handleMediaSelect = (url: string) => {
        updateField('banner_image', url);
        setShowMediaPicker(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-12 w-12 animate-spin text-primary-pink" />
            </div>
        );
    }

    const currentData = contactData[activeLocale];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-primary-pink flex items-center gap-2">
                    Contact
                </h1>
                <div className="flex gap-2">
                    <Button
                        variant={activeLocale === 'tr' ? 'default' : 'outline'}
                        onClick={() => setActiveLocale('tr')}
                        className={activeLocale === 'tr' ? 'bg-primary-pink' : ''}
                    >
                        🇹🇷 Türkçe
                    </Button>
                    <Button
                        variant={activeLocale === 'en' ? 'default' : 'outline'}
                        onClick={() => setActiveLocale('en')}
                        className={activeLocale === 'en' ? 'bg-primary-pink' : ''}
                    >
                        🇬🇧 English
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {activeLocale === 'tr' ? '🇹🇷 Türkçe' : '🇬🇧 English'} İçerik
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-6">
                        {/* Banner Image */}
                        <div className="space-y-2">
                            <Label>Banner Görseli</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={currentData.banner_image}
                                    onChange={(e) => updateField('banner_image', e.target.value)}
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
                            {currentData.banner_image && (
                                <div className="mt-2">
                                    <img
                                        src={currentData.banner_image}
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
                                    value={currentData.form_top_title}
                                    onChange={(e) => updateField('form_top_title', e.target.value)}
                                    placeholder={activeLocale === 'tr' ? 'İLETİŞİM' : 'CONTACT'}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Ana Başlık</Label>
                                <Input
                                    value={currentData.form_title}
                                    onChange={(e) => updateField('form_title', e.target.value)}
                                    placeholder={activeLocale === 'tr' ? 'Bizimle İletişime Geçin' : 'Get In Touch With Us'}
                                />
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold">Form Alanları</h3>

                            {/* Name Field */}
                            <Card className="p-4">
                                <h4 className="font-medium mb-3">Ad-Soyad Alanı</h4>
                                <div className="space-y-3">
                                    <div className="space-y-2">
                                        <Label className="text-sm">Etiket</Label>
                                        <Input
                                            value={currentData.fields.name.label}
                                            onChange={(e) => updateNestedField(['fields', 'name', 'label'], e.target.value)}
                                            placeholder={activeLocale === 'tr' ? 'Ad - Soyad' : 'Full Name'}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm">Placeholder</Label>
                                        <Input
                                            value={currentData.fields.name.placeholder}
                                            onChange={(e) => updateNestedField(['fields', 'name', 'placeholder'], e.target.value)}
                                            placeholder={activeLocale === 'tr' ? 'Lütfen Ad - Soyad giriniz' : 'Please enter your full name'}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm">Hata Mesajı (Zorunlu)</Label>
                                        <Input
                                            value={currentData.fields.name.required_message}
                                            onChange={(e) => updateNestedField(['fields', 'name', 'required_message'], e.target.value)}
                                            placeholder={activeLocale === 'tr' ? 'Lütfen adınızı ve soyadınızı girin' : 'Please enter your full name'}
                                        />
                                    </div>
                                </div>
                            </Card>

                            {/* Email Field */}
                            <Card className="p-4">
                                <h4 className="font-medium mb-3">E-posta Alanı</h4>
                                <div className="space-y-3">
                                    <div className="space-y-2">
                                        <Label className="text-sm">Etiket</Label>
                                        <Input
                                            value={currentData.fields.email.label}
                                            onChange={(e) => updateNestedField(['fields', 'email', 'label'], e.target.value)}
                                            placeholder={activeLocale === 'tr' ? 'E-posta' : 'Email'}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm">Placeholder</Label>
                                        <Input
                                            value={currentData.fields.email.placeholder}
                                            onChange={(e) => updateNestedField(['fields', 'email', 'placeholder'], e.target.value)}
                                            placeholder={activeLocale === 'tr' ? 'Lütfen E-posta giriniz' : 'Please enter your email'}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm">Hata Mesajı (Zorunlu)</Label>
                                        <Input
                                            value={currentData.fields.email.required_message}
                                            onChange={(e) => updateNestedField(['fields', 'email', 'required_message'], e.target.value)}
                                            placeholder={activeLocale === 'tr' ? 'Lütfen e-posta adresinizi girin' : 'Please enter your email'}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm">Hata Mesajı (Geçersiz)</Label>
                                        <Input
                                            value={currentData.fields.email.invalid_message}
                                            onChange={(e) => updateNestedField(['fields', 'email', 'invalid_message'], e.target.value)}
                                            placeholder={activeLocale === 'tr' ? 'Geçerli bir e-posta adresi girin' : 'Please enter a valid email'}
                                        />
                                    </div>
                                </div>
                            </Card>

                            {/* Subject Field */}
                            <Card className="p-4">
                                <h4 className="font-medium mb-3">Konu Alanı</h4>
                                <div className="space-y-3">
                                    <div className="space-y-2">
                                        <Label className="text-sm">Etiket</Label>
                                        <Input
                                            value={currentData.fields.subject.label}
                                            onChange={(e) => updateNestedField(['fields', 'subject', 'label'], e.target.value)}
                                            placeholder={activeLocale === 'tr' ? 'Konu' : 'Subject'}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm">Placeholder</Label>
                                        <Input
                                            value={currentData.fields.subject.placeholder}
                                            onChange={(e) => updateNestedField(['fields', 'subject', 'placeholder'], e.target.value)}
                                            placeholder={activeLocale === 'tr' ? 'Lütfen bir konu seçin' : 'Please select a subject'}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm">Hata Mesajı (Zorunlu)</Label>
                                        <Input
                                            value={currentData.fields.subject.required_message}
                                            onChange={(e) => updateNestedField(['fields', 'subject', 'required_message'], e.target.value)}
                                            placeholder={activeLocale === 'tr' ? 'Lütfen bir konu seçin' : 'Please select a subject'}
                                        />
                                    </div>
                                </div>
                            </Card>

                            {/* Message Field */}
                            <Card className="p-4">
                                <h4 className="font-medium mb-3">Mesaj Alanı</h4>
                                <div className="space-y-3">
                                    <div className="space-y-2">
                                        <Label className="text-sm">Etiket</Label>
                                        <Input
                                            value={currentData.fields.message.label}
                                            onChange={(e) => updateNestedField(['fields', 'message', 'label'], e.target.value)}
                                            placeholder={activeLocale === 'tr' ? 'Mesaj' : 'Message'}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm">Placeholder</Label>
                                        <Input
                                            value={currentData.fields.message.placeholder}
                                            onChange={(e) => updateNestedField(['fields', 'message', 'placeholder'], e.target.value)}
                                            placeholder={activeLocale === 'tr' ? 'Lütfen mesajınızı giriniz' : 'Please enter your message'}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm">Hata Mesajı (Zorunlu)</Label>
                                        <Input
                                            value={currentData.fields.message.required_message}
                                            onChange={(e) => updateNestedField(['fields', 'message', 'required_message'], e.target.value)}
                                            placeholder={activeLocale === 'tr' ? 'Lütfen mesajınızı girin' : 'Please enter your message'}
                                        />
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Form Subjects */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Form Konuları</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={newSubject}
                                        onChange={(e) => setNewSubject(e.target.value)}
                                        placeholder={activeLocale === 'tr' ? 'Yeni konu ekle' : 'Add new subject'}
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

                            {currentData.form_subjects.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                                    Henüz konu eklenmemiş
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {currentData.form_subjects.map((subject, index) => (
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

                        {/* Button Texts */}
                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold">Buton Metinleri</h3>

                            <div className="space-y-2">
                                <Label>Gönder Butonu</Label>
                                <Input
                                    value={currentData.submit_button_text}
                                    onChange={(e) => updateField('submit_button_text', e.target.value)}
                                    placeholder={activeLocale === 'tr' ? 'Gönder' : 'Submit'}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Yükleniyor Metni</Label>
                                <Input
                                    value={currentData.submit_button_loading}
                                    onChange={(e) => updateField('submit_button_loading', e.target.value)}
                                    placeholder={activeLocale === 'tr' ? 'Gönderiliyor...' : 'Sending...'}
                                />
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold">Sistem Mesajları</h3>

                            <div className="space-y-2">
                                <Label>Başarı Mesajı</Label>
                                <Input
                                    value={currentData.messages.success}
                                    onChange={(e) => updateNestedField(['messages', 'success'], e.target.value)}
                                    placeholder={activeLocale === 'tr' ? 'Mesajınız başarıyla gönderildi!' : 'Your message has been sent successfully!'}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Hata Mesajı</Label>
                                <Input
                                    value={currentData.messages.error}
                                    onChange={(e) => updateNestedField(['messages', 'error'], e.target.value)}
                                    placeholder={activeLocale === 'tr' ? 'Bir hata oluştu. Lütfen tekrar deneyin.' : 'An error occurred. Please try again.'}
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t flex gap-4">
                            <Button type="submit" disabled={saving} className="bg-primary-pink hover:bg-pink-700">
                                {saving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Kaydediliyor...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Her İki Dili Kaydet
                                    </>
                                )}
                            </Button>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>🇹🇷 TR: {contactData.tr.form_subjects.length} konu</span>
                                <span>•</span>
                                <span>🇬🇧 EN: {contactData.en.form_subjects.length} konu</span>
                            </div>
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