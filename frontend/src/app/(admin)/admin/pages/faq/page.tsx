'use client';

import { useState, useEffect } from 'react';
import axios from '@/src/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/src/components/ui/use-toast';
import { Loader2, Save, Plus, Trash2, Image as ImageIcon, HelpCircle, Languages, ChevronUp, ChevronDown } from 'lucide-react';
import MediaPicker from '@/src/components/MediaPicker';
import { Switch } from '@/components/ui/switch';

interface FAQItem {
    id?: number;
    question: string;
    answer: string;
    order: number;
    is_active: boolean;
}

interface FAQLocaleData {
    hero_image: string;
    page_title: string;
    page_subtitle: string;
    empty_message: string;
    faqs: FAQItem[];
}

interface FAQData {
    tr: FAQLocaleData;
    en: FAQLocaleData;
}

const DEFAULT_LOCALE_DATA: FAQLocaleData = {
    hero_image: '',
    page_title: '',
    page_subtitle: '',
    empty_message: '',
    faqs: [],
};

export default function FAQEditorPage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeLocale, setActiveLocale] = useState<'tr' | 'en'>('tr');
    const [showMediaPicker, setShowMediaPicker] = useState(false);

    const [faqData, setFaqData] = useState<FAQData>({
        tr: { ...DEFAULT_LOCALE_DATA },
        en: { ...DEFAULT_LOCALE_DATA },
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            const [trResponse, enResponse] = await Promise.all([
                axios.get('/faq?locale=tr'),
                axios.get('/faq?locale=en'),
            ]);

            const processData = (data: any): FAQLocaleData => ({
                hero_image: data.hero_image || '',
                page_title: data.page_title || '',
                page_subtitle: data.page_subtitle || '',
                empty_message: data.empty_message || '',
                faqs: data.faqs || [],
            });

            setFaqData({
                tr: trResponse.data.data ? processData(trResponse.data.data) : { ...DEFAULT_LOCALE_DATA },
                en: enResponse.data.data ? processData(enResponse.data.data) : { ...DEFAULT_LOCALE_DATA },
            });

            toast({
                title: '✅ Başarılı',
                description: 'FAQ verileri yüklendi',
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
            const orderedTr = faqData.tr.faqs.map((faq, index) => ({ ...faq, order: index + 1 }));
            const orderedEn = faqData.en.faqs.map((faq, index) => ({ ...faq, order: index + 1 }));

            await Promise.all([
                axios.put('/faq', { ...faqData.tr, faqs: orderedTr, locale: 'tr' }),
                axios.put('/faq', { ...faqData.en, faqs: orderedEn, locale: 'en' }),
            ]);

            toast({
                title: '✅ Başarılı',
                description: 'FAQ ayarları her iki dil için kaydedildi',
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

    const updateField = (field: keyof FAQLocaleData, value: any) => {
        setFaqData({
            ...faqData,
            [activeLocale]: { ...faqData[activeLocale], [field]: value },
        });
    };

    const addFAQ = () => {
        const currentData = faqData[activeLocale];
        updateField('faqs', [
            ...currentData.faqs,
            {
                question: '',
                answer: '',
                order: currentData.faqs.length + 1,
                is_active: true,
            },
        ]);
    };

    const removeFAQ = (index: number) => {
        const currentData = faqData[activeLocale];
        const newFaqs = currentData.faqs.filter((_, i) => i !== index);
        const reorderedFaqs = newFaqs.map((faq, i) => ({ ...faq, order: i + 1 }));
        updateField('faqs', reorderedFaqs);
    };

    const updateFAQ = (index: number, field: keyof FAQItem, value: any) => {
        const currentData = faqData[activeLocale];
        const newFaqs = [...currentData.faqs];
        newFaqs[index] = { ...newFaqs[index], [field]: value };
        updateField('faqs', newFaqs);
    };

    const moveFAQ = (index: number, direction: 'up' | 'down') => {
        const currentData = faqData[activeLocale];
        const newFaqs = [...currentData.faqs];
        const newIndex = direction === 'up' ? index - 1 : index + 1;

        if (newIndex < 0 || newIndex >= newFaqs.length) return;

        [newFaqs[index], newFaqs[newIndex]] = [newFaqs[newIndex], newFaqs[index]];
        newFaqs.forEach((faq, i) => { faq.order = i + 1; });

        updateField('faqs', newFaqs);
    };

    const handleMediaSelect = (url: string) => {
        updateField('hero_image', url);
        setShowMediaPicker(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-12 w-12 animate-spin text-primary-pink" />
            </div>
        );
    }

    const currentData = faqData[activeLocale];
    const activeCount = currentData.faqs.filter(f => f.is_active).length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-primary-pink flex items-center gap-2">
                    FAQ
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
                        {/* Hero Image */}
                        <div className="space-y-2">
                            <Label>Hero Görseli</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={currentData.hero_image}
                                    onChange={(e) => updateField('hero_image', e.target.value)}
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
                            {currentData.hero_image && (
                                <div className="mt-2">
                                    <img
                                        src={currentData.hero_image}
                                        alt="Hero Preview"
                                        className="w-full h-48 object-cover rounded-md"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Page Titles */}
                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold">Sayfa Başlıkları</h3>

                            <div className="space-y-2">
                                <Label>Sayfa Başlığı</Label>
                                <Input
                                    value={currentData.page_title}
                                    onChange={(e) => updateField('page_title', e.target.value)}
                                    placeholder={activeLocale === 'tr' ? 'Sıkça Sorulan Sorular' : 'Frequently Asked Questions'}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Sayfa Alt Başlığı</Label>
                                <Input
                                    value={currentData.page_subtitle}
                                    onChange={(e) => updateField('page_subtitle', e.target.value)}
                                    placeholder={activeLocale === 'tr' ? 'Merak ettikleriniz' : 'What you need to know'}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Boş Liste Mesajı</Label>
                                <Input
                                    value={currentData.empty_message}
                                    onChange={(e) => updateField('empty_message', e.target.value)}
                                    placeholder={activeLocale === 'tr' ? 'Henüz soru eklenmemiş.' : 'No questions added yet.'}
                                />
                            </div>
                        </div>

                        {/* FAQ Items */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-lg font-semibold">
                                    Sorular ve Cevaplar ({activeLocale === 'tr' ? '🇹🇷' : '🇬🇧'})
                                </Label>
                                <Button type="button" size="sm" onClick={addFAQ} className="bg-primary-pink hover:bg-pink-700">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Yeni Soru Ekle
                                </Button>
                            </div>

                            {currentData.faqs.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                                    <HelpCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                    <p className="text-gray-500 mb-4">Henüz soru eklenmemiş</p>
                                    <Button type="button" onClick={addFAQ} variant="outline">
                                        <Plus className="w-4 h-4 mr-2" />
                                        İlk Soruyu Ekle
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {currentData.faqs.map((faq, index) => (
                                        <Card key={index} className={`p-4 ${!faq.is_active ? 'opacity-60 bg-gray-50' : ''}`}>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm font-semibold text-gray-700">
                                                            Soru {index + 1}
                                                        </span>
                                                        {!faq.is_active && (
                                                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                                                                Pasif
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => moveFAQ(index, 'up')}
                                                            disabled={index === 0}
                                                        >
                                                            <ChevronUp className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => moveFAQ(index, 'down')}
                                                            disabled={index === currentData.faqs.length - 1}
                                                        >
                                                            <ChevronDown className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => removeFAQ(index)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>
                                                        Soru <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        value={faq.question}
                                                        onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                                                        placeholder={activeLocale === 'tr' ? 'Sorunuzu buraya yazın' : 'Write your question here'}
                                                        required
                                                        className="font-medium"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>
                                                        Cevap <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Textarea
                                                        value={faq.answer}
                                                        onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                                                        placeholder={activeLocale === 'tr' ? 'Cevabı buraya yazın' : 'Write your answer here'}
                                                        rows={6}
                                                        required
                                                        className="resize-none"
                                                    />
                                                    <p className="text-xs text-gray-500">
                                                        {faq.answer.length} karakter
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center gap-2">
                                                        <Label htmlFor={`active-${index}`} className="cursor-pointer font-normal">
                                                            Frontend'de Göster
                                                        </Label>
                                                        <span className="text-xs text-gray-500">
                                                            {faq.is_active ? '(Aktif)' : '(Pasif)'}
                                                        </span>
                                                    </div>
                                                    <Switch
                                                        id={`active-${index}`}
                                                        checked={faq.is_active}
                                                        onCheckedChange={(checked) => updateFAQ(index, 'is_active', checked)}
                                                    />
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="pt-4 border-t flex gap-3">
                            <Button
                                type="submit"
                                disabled={saving}
                                className="bg-primary-pink hover:bg-pink-700"
                            >
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
                                <span>🇹🇷 TR: {faqData.tr.faqs.length} soru ({faqData.tr.faqs.filter(f => f.is_active).length} aktif)</span>
                                <span>•</span>
                                <span>🇬🇧 EN: {faqData.en.faqs.length} soru ({faqData.en.faqs.filter(f => f.is_active).length} aktif)</span>
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