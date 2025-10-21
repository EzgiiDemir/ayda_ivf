'use client';

import { useState, useEffect } from 'react';
import axios from '@/src/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/src/components/ui/use-toast';
import { Loader2, Save, Plus, Trash2, Image as ImageIcon, HelpCircle, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import MediaPicker from '@/src/components/MediaPicker';
import { Switch } from '@/components/ui/switch';

interface FAQItem {
    id?: number;
    question: string;
    answer: string;
    order: number;
    is_active: boolean;
}

interface FAQData {
    locale: string;
    hero_image: string;
    faqs: FAQItem[];
}

export default function FAQEditorPage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showMediaPicker, setShowMediaPicker] = useState(false);

    const [faqData, setFaqData] = useState<FAQData>({
        locale: 'tr',
        hero_image: '',
        faqs: [],
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/faq?locale=tr');

            if (response.data.data) {
                setFaqData({
                    locale: 'tr',
                    hero_image: response.data.data.hero_image || '',
                    faqs: response.data.data.faqs || [],
                });
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
            // Reorder FAQs based on current array order
            const orderedFaqs = faqData.faqs.map((faq, index) => ({
                ...faq,
                order: index + 1,
            }));

            await axios.put('/faq', {
                ...faqData,
                faqs: orderedFaqs,
            });

            toast({ title: 'Başarılı', description: 'FAQ sayfası güncellendi' });
            fetchData(); // Refresh to get IDs from backend
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

    const addFAQ = () => {
        setFaqData({
            ...faqData,
            faqs: [
                ...faqData.faqs,
                {
                    question: '',
                    answer: '',
                    order: faqData.faqs.length + 1,
                    is_active: true,
                },
            ],
        });
    };

    const removeFAQ = (index: number) => {
        const newFaqs = faqData.faqs.filter((_, i) => i !== index);
        // Reorder remaining FAQs
        const reorderedFaqs = newFaqs.map((faq, i) => ({
            ...faq,
            order: i + 1,
        }));
        setFaqData({ ...faqData, faqs: reorderedFaqs });
    };

    const updateFAQ = (index: number, field: keyof FAQItem, value: any) => {
        const newFaqs = [...faqData.faqs];
        newFaqs[index] = { ...newFaqs[index], [field]: value };
        setFaqData({ ...faqData, faqs: newFaqs });
    };

    const moveFAQ = (index: number, direction: 'up' | 'down') => {
        const newFaqs = [...faqData.faqs];
        const newIndex = direction === 'up' ? index - 1 : index + 1;

        if (newIndex < 0 || newIndex >= newFaqs.length) return;

        // Swap items
        [newFaqs[index], newFaqs[newIndex]] = [newFaqs[newIndex], newFaqs[index]];

        // Update order
        newFaqs.forEach((faq, i) => {
            faq.order = i + 1;
        });

        setFaqData({ ...faqData, faqs: newFaqs });
    };

    const handleMediaSelect = (url: string) => {
        setFaqData({ ...faqData, hero_image: url });
        setShowMediaPicker(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-12 w-12 animate-spin text-primary-pink" />
            </div>
        );
    }

    const activeCount = faqData.faqs.filter(f => f.is_active).length;
    const inactiveCount = faqData.faqs.length - activeCount;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-primary-pink flex items-center gap-2">
                    FAQ
                </h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>FAQ Ayarları</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-6">
                        {/* Hero Image */}
                        <div className="space-y-2">
                            <Label>Hero Banner Görseli</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={faqData.hero_image || ''}
                                    onChange={(e) => setFaqData({ ...faqData, hero_image: e.target.value })}
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
                            {faqData.hero_image && (
                                <div className="mt-2">
                                    <img
                                        src={faqData.hero_image}
                                        alt="Hero Preview"
                                        className="w-full h-48 object-cover rounded-md"
                                    />
                                </div>
                            )}
                        </div>

                        {/* FAQs */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-lg font-semibold">Sorular ve Cevaplar</Label>
                                <Button type="button" size="sm" onClick={addFAQ} className="bg-primary-pink hover:bg-pink-700">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Yeni Soru Ekle
                                </Button>
                            </div>

                            {faqData.faqs.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                                    <HelpCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                    <p className="text-gray-500 mb-4">Henüz soru eklenmedi</p>
                                    <Button type="button" onClick={addFAQ} variant="outline">
                                        <Plus className="w-4 h-4 mr-2" />
                                        İlk Soruyu Ekle
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {faqData.faqs.map((faq, index) => (
                                        <Card key={index} className={`p-4 ${!faq.is_active ? 'opacity-60 bg-gray-50' : ''}`}>
                                            <div className="space-y-4">
                                                {/* Header */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-semibold text-gray-700">
                                                                Soru {index + 1}
                                                            </span>
                                                            {!faq.is_active && (
                                                                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                                                                    Pasif
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => removeFAQ(index)}
                                                            title="Sil"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Question */}
                                                <div className="space-y-2">
                                                    <Label>
                                                        Soru <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        value={faq.question}
                                                        onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                                                        placeholder="Soruyu buraya yazın (örn: IVF tedavisi nedir?)"
                                                        required
                                                        className="font-medium"
                                                    />
                                                </div>

                                                {/* Answer */}
                                                <div className="space-y-2">
                                                    <Label>
                                                        Cevap <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Textarea
                                                        value={faq.answer}
                                                        onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                                                        placeholder="Cevabı buraya yazın (detaylı ve açıklayıcı olun)"
                                                        rows={6}
                                                        required
                                                        className="resize-none"
                                                    />
                                                    <p className="text-xs text-gray-500">
                                                        {faq.answer.length} karakter
                                                    </p>
                                                </div>

                                                {/* Active Toggle */}
                                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center gap-2">
                                                        <Label htmlFor={`active-${index}`} className="cursor-pointer font-normal">
                                                            Frontend'de göster
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

                        {/* Save Button */}
                        <div className="pt-4 border-t flex gap-3">
                            <Button
                                type="submit"
                                disabled={saving || faqData.faqs.length === 0}
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
                                        Kaydet
                                    </>
                                )}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={fetchData}
                                disabled={saving}
                            >
                                İptal
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Media Picker */}
            <MediaPicker
                open={showMediaPicker}
                onOpenChange={setShowMediaPicker}
                onSelect={handleMediaSelect}
            />
        </div>
    );
}