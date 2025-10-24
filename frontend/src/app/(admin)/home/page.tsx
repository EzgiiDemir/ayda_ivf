'use client';

import { useState, useEffect } from 'react';
import axios from '@/src/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/src/components/ui/use-toast';
import { Loader2, Save, Plus, Trash2, Image as ImageIcon, ChevronUp, ChevronDown } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import MediaPicker from '@/src/components/MediaPicker';
import RawEditor from "@/src/components/Tiptap";

interface HeroSlide {
    image: { url: string; alt: string };
    title?: string;
    subtitle?: string;
    duration?: number;
}

interface HeroLocaleData {
    slides: HeroSlide[];
    dots_pattern: string;
    auto_play: boolean;
    auto_play_interval: number;
    show_indicators: boolean;
    right_text: string;
    bottom_text: string;
}

interface WelcomeLocaleData {
    image: { url: string; alt: string; width: number; height: number };
    gradient: { from: string; via: string; to: string };
    background_image: string;
    title_top: string;
    title: string;
    content: string;
    signature_name: string;
    signature_title: string;
}

interface TreatmentItem {
    id: string;
    href: string;
    label: string;
    order: number;
    isActive: boolean;
}

interface TreatmentsLocaleData {
    background_logo: string;
    treatments: TreatmentItem[];
    top_title: string;
    title: string;
    content: string;
    contact_button_text: string;
}

interface ContactMapData {
    show_iframe: boolean;
    map_url: string;
    image: string;
}

interface HomeData {
    hero: { tr: HeroLocaleData; en: HeroLocaleData };
    welcome: { tr: WelcomeLocaleData; en: WelcomeLocaleData };
    treatments: { tr: TreatmentsLocaleData; en: TreatmentsLocaleData };
    contactMap: ContactMapData;
}

const DEFAULT_HERO: HeroLocaleData = {
    slides: [],
    dots_pattern: '',
    auto_play: true,
    auto_play_interval: 5000,
    show_indicators: true,
    right_text: '',
    bottom_text: '',
};

const DEFAULT_WELCOME: WelcomeLocaleData = {
    image: { url: '', alt: '', width: 400, height: 400 },
    gradient: { from: '#F7DFE6', via: '#FFFFFF', to: '#FFFFFF' },
    background_image: '',
    title_top: '',
    title: '',
    content: '',
    signature_name: '',
    signature_title: '',
};

const DEFAULT_TREATMENTS: TreatmentsLocaleData = {
    background_logo: '',
    treatments: [],
    top_title: '',
    title: '',
    content: '',
    contact_button_text: '',
};

export default function HomeEditorPage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('hero');
    const [activeLocale, setActiveLocale] = useState<'tr' | 'en'>('tr');
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [mediaTarget, setMediaTarget] = useState<string>('');

    const [homeData, setHomeData] = useState<HomeData>({
        hero: { tr: { ...DEFAULT_HERO }, en: { ...DEFAULT_HERO } },
        welcome: { tr: { ...DEFAULT_WELCOME }, en: { ...DEFAULT_WELCOME } },
        treatments: { tr: { ...DEFAULT_TREATMENTS }, en: { ...DEFAULT_TREATMENTS } },
        contactMap: { show_iframe: true, map_url: '', image: '' },
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [heroTr, heroEn, welcomeTr, welcomeEn, treatmentsTr, treatmentsEn, contactMap] = await Promise.all([
                axios.get('/hero?locale=tr').catch(() => ({ data: { data: null } })),
                axios.get('/hero?locale=en').catch(() => ({ data: { data: null } })),
                axios.get('/welcome?locale=tr').catch(() => ({ data: { data: null } })),
                axios.get('/welcome?locale=en').catch(() => ({ data: { data: null } })),
                axios.get('/treatments?locale=tr').catch(() => ({ data: { data: null } })),
                axios.get('/treatments?locale=en').catch(() => ({ data: { data: null } })),
                axios.get('/contact-map').catch(() => ({ data: { data: null } })),
            ]);

            setHomeData({
                hero: {
                    tr: heroTr.data.data || { ...DEFAULT_HERO },
                    en: heroEn.data.data || { ...DEFAULT_HERO },
                },
                welcome: {
                    tr: welcomeTr.data.data || { ...DEFAULT_WELCOME },
                    en: welcomeEn.data.data || { ...DEFAULT_WELCOME },
                },
                treatments: {
                    tr: treatmentsTr.data.data || { ...DEFAULT_TREATMENTS },
                    en: treatmentsEn.data.data || { ...DEFAULT_TREATMENTS },
                },
                contactMap: contactMap.data.data || { show_iframe: true, map_url: '', image: '' },
            });

            toast({ title: '✅ Başarılı', description: 'Ana sayfa verileri yüklendi' });
        } catch (error: any) {
            console.error('❌ Fetch error:', error);
            toast({ title: '❌ Hata', description: 'Veriler yüklenirken hata oluştu', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (section: 'hero' | 'welcome' | 'treatments' | 'contactMap') => {
        setSaving(true);
        try {
            if (section === 'contactMap') {
                await axios.put('/contact-map', homeData.contactMap);
            } else {
                await Promise.all([
                    axios.put(`/${section}`, { ...homeData[section].tr, locale: 'tr' }),
                    axios.put(`/${section}`, { ...homeData[section].en, locale: 'en' }),
                ]);
            }
            toast({ title: '✅ Başarılı', description: `${section} bölümü kaydedildi` });
        } catch (error: any) {
            console.error('❌ Save error:', error);
            toast({ title: '❌ Hata', description: 'Kayıt başarısız', variant: 'destructive' });
        } finally {
            setSaving(false);
        }
    };

    const addSlide = () => {
        const current = homeData.hero[activeLocale];
        setHomeData({
            ...homeData,
            hero: {
                ...homeData.hero,
                [activeLocale]: {
                    ...current,
                    slides: [...current.slides, { image: { url: '', alt: '' }, duration: 5000 }],
                },
            },
        });
    };

    const removeSlide = (index: number) => {
        const current = homeData.hero[activeLocale];
        setHomeData({
            ...homeData,
            hero: {
                ...homeData.hero,
                [activeLocale]: {
                    ...current,
                    slides: current.slides.filter((_, i) => i !== index),
                },
            },
        });
    };

    const updateSlide = (index: number, field: string, value: any) => {
        const current = homeData.hero[activeLocale];
        const newSlides = [...current.slides];
        if (field === 'url') newSlides[index].image.url = value;
        else if (field === 'alt') newSlides[index].image.alt = value;
        else if (field === 'title') newSlides[index].title = value;
        else if (field === 'subtitle') newSlides[index].subtitle = value;
        else if (field === 'duration') newSlides[index].duration = parseInt(value) || 5000;

        setHomeData({
            ...homeData,
            hero: { ...homeData.hero, [activeLocale]: { ...current, slides: newSlides } },
        });
    };

    const addTreatment = () => {
        const current = homeData.treatments[activeLocale];
        setHomeData({
            ...homeData,
            treatments: {
                ...homeData.treatments,
                [activeLocale]: {
                    ...current,
                    treatments: [...current.treatments, { id: '', href: '', label: '', order: current.treatments.length + 1, isActive: true }],
                },
            },
        });
    };

    const removeTreatment = (index: number) => {
        const current = homeData.treatments[activeLocale];
        setHomeData({
            ...homeData,
            treatments: {
                ...homeData.treatments,
                [activeLocale]: {
                    ...current,
                    treatments: current.treatments.filter((_, i) => i !== index),
                },
            },
        });
    };

    const updateTreatment = (index: number, field: keyof TreatmentItem, value: any) => {
        const current = homeData.treatments[activeLocale];
        const newTreatments = [...current.treatments];
        newTreatments[index][field] = value as never;
        setHomeData({
            ...homeData,
            treatments: { ...homeData.treatments, [activeLocale]: { ...current, treatments: newTreatments } },
        });
    };

    const moveTreatment = (index: number, direction: 'up' | 'down') => {
        const current = homeData.treatments[activeLocale];
        const newTreatments = [...current.treatments];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= newTreatments.length) return;
        [newTreatments[index], newTreatments[newIndex]] = [newTreatments[newIndex], newTreatments[index]];
        newTreatments.forEach((t, i) => t.order = i + 1);
        setHomeData({
            ...homeData,
            treatments: { ...homeData.treatments, [activeLocale]: { ...current, treatments: newTreatments } },
        });
    };

    const handleMediaSelect = (url: string) => {
        if (mediaTarget.startsWith('hero-slide-')) {
            const index = parseInt(mediaTarget.replace('hero-slide-', ''));
            updateSlide(index, 'url', url);
        } else if (mediaTarget === 'hero-dots') {
            const current = homeData.hero[activeLocale];
            setHomeData({ ...homeData, hero: { ...homeData.hero, [activeLocale]: { ...current, dots_pattern: url } } });
        } else if (mediaTarget === 'welcome-image') {
            const current = homeData.welcome[activeLocale];
            setHomeData({ ...homeData, welcome: { ...homeData.welcome, [activeLocale]: { ...current, image: { ...current.image, url } } } });
        } else if (mediaTarget === 'welcome-bg') {
            const current = homeData.welcome[activeLocale];
            setHomeData({ ...homeData, welcome: { ...homeData.welcome, [activeLocale]: { ...current, background_image: url } } });
        } else if (mediaTarget === 'treatments-logo') {
            const current = homeData.treatments[activeLocale];
            setHomeData({ ...homeData, treatments: { ...homeData.treatments, [activeLocale]: { ...current, background_logo: url } } });
        } else if (mediaTarget === 'contact-image') {
            setHomeData({ ...homeData, contactMap: { ...homeData.contactMap, image: url } });
        }
        setShowMediaPicker(false);
        setMediaTarget('');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-12 w-12 animate-spin text-primary-pink" />
            </div>
        );
    }

    const currentHero = homeData.hero[activeLocale];
    const currentWelcome = homeData.welcome[activeLocale];
    const currentTreatments = homeData.treatments[activeLocale];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-primary-pink">Ana Sayfa</h1>
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

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="hero">Hero</TabsTrigger>
                    <TabsTrigger value="welcome">Welcome</TabsTrigger>
                    <TabsTrigger value="treatments">Treatments</TabsTrigger>
                    <TabsTrigger value="contact">Contact Map</TabsTrigger>
                </TabsList>

                <TabsContent value="hero">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Hero Section ({activeLocale === 'tr' ? '🇹🇷 Türkçe' : '🇬🇧 English'})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={(e) => { e.preventDefault(); handleSave('hero'); }} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-lg font-semibold">Slides</Label>
                                        <Button type="button" size="sm" onClick={addSlide} variant="outline">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Slide Ekle
                                        </Button>
                                    </div>

                                    {currentHero.slides.map((slide, index) => (
                                        <Card key={index} className="p-4 bg-gray-50">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <Label className="font-semibold">Slide {index + 1}</Label>
                                                    <Button type="button" size="sm" variant="destructive" onClick={() => removeSlide(index)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Görsel URL</Label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            value={slide.image.url || ''}
                                                            onChange={(e) => updateSlide(index, 'url', e.target.value)}
                                                            placeholder="https://..."
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() => { setMediaTarget(`hero-slide-${index}`); setShowMediaPicker(true); }}
                                                        >
                                                            <ImageIcon className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <Input
                                                    value={slide.image.alt || ''}
                                                    onChange={(e) => updateSlide(index, 'alt', e.target.value)}
                                                    placeholder="Alt text"
                                                />

                                                <div className="space-y-2">
                                                    <Label>Merkez Başlık (Title)</Label>
                                                    <RawEditor
                                                        content={slide.title || ''}
                                                        onChange={(html) => updateSlide(index, 'title', html)}
                                                        placeholder="Başlık buraya..."
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Alt Başlık (Subtitle)</Label>
                                                    <RawEditor
                                                        content={slide.subtitle || ''}
                                                        onChange={(html) => updateSlide(index, 'subtitle', html)}
                                                        placeholder="Alt başlık buraya..."
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Gösterim Süresi (ms)</Label>
                                                    <Input
                                                        type="number"
                                                        value={slide.duration || 5000}
                                                        onChange={(e) => updateSlide(index, 'duration', e.target.value)}
                                                        min="1000"
                                                        step="500"
                                                        placeholder="5000"
                                                    />
                                                    <p className="text-xs text-gray-500">
                                                        Her slide için ayrı süre belirleyebilirsiniz (örn: 5000 = 5 saniye)
                                                    </p>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>

                                <div className="space-y-2">
                                    <Label>Dots Pattern URL</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={currentHero.dots_pattern || ''}
                                            onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, [activeLocale]: { ...currentHero, dots_pattern: e.target.value } } })}
                                        />
                                        <Button type="button" variant="outline" onClick={() => { setMediaTarget('hero-dots'); setShowMediaPicker(true); }}>
                                            <ImageIcon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Sağ Yazı</Label>
                                        <Input
                                            value={currentHero.right_text || ''}
                                            onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, [activeLocale]: { ...currentHero, right_text: e.target.value } } })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Alt Yazı</Label>
                                        <Input
                                            value={currentHero.bottom_text || ''}
                                            onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, [activeLocale]: { ...currentHero, bottom_text: e.target.value } } })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <Label>Otomatik Oynat</Label>
                                        <Switch
                                            checked={currentHero.auto_play}
                                            onCheckedChange={(checked) => setHomeData({ ...homeData, hero: { ...homeData.hero, [activeLocale]: { ...currentHero, auto_play: checked } } })}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <Label>Göstergeleri Göster</Label>
                                        <Switch
                                            checked={currentHero.show_indicators}
                                            onCheckedChange={(checked) => setHomeData({ ...homeData, hero: { ...homeData.hero, [activeLocale]: { ...currentHero, show_indicators: checked } } })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Varsayılan Geçiş Süresi (ms)</Label>
                                    <Input
                                        type="number"
                                        value={currentHero.auto_play_interval}
                                        onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, [activeLocale]: { ...currentHero, auto_play_interval: parseInt(e.target.value) || 5000 } } })}
                                        min="1000"
                                        step="500"
                                    />
                                    <p className="text-xs text-gray-500">
                                        Slide'ların kendi süresi yoksa bu süre kullanılır
                                    </p>
                                </div>

                                <Button type="submit" disabled={saving} className="w-full bg-primary-pink hover:bg-pink-700">
                                    {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Kaydediliyor...</> : <><Save className="w-4 h-4 mr-2" />Her İki Dili Kaydet</>}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="welcome">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Welcome Section ({activeLocale === 'tr' ? '🇹🇷 Türkçe' : '🇬🇧 English'})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={(e) => { e.preventDefault(); handleSave('welcome'); }} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Üst Başlık</Label>
                                        <Input
                                            value={currentWelcome.title_top || ''}
                                            onChange={(e) => setHomeData({ ...homeData, welcome: { ...homeData.welcome, [activeLocale]: { ...currentWelcome, title_top: e.target.value } } })}
                                            placeholder="Üst başlık..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Ana Başlık</Label>
                                        <Input
                                            value={currentWelcome.title || ''}
                                            onChange={(e) => setHomeData({ ...homeData, welcome: { ...homeData.welcome, [activeLocale]: { ...currentWelcome, title: e.target.value } } })}
                                            placeholder="Ana başlık..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>İçerik</Label>
                                    <RawEditor
                                        content={currentWelcome.content || ''}
                                        onChange={(html) => setHomeData({ ...homeData, welcome: { ...homeData.welcome, [activeLocale]: { ...currentWelcome, content: html } } })}
                                        placeholder="Hoş geldiniz içeriğini buraya yazın..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>İmza - İsim</Label>
                                        <Input
                                            value={currentWelcome.signature_name || ''}
                                            onChange={(e) => setHomeData({ ...homeData, welcome: { ...homeData.welcome, [activeLocale]: { ...currentWelcome, signature_name: e.target.value } } })}
                                            placeholder="Dr. İsim Soyisim"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>İmza - Ünvan</Label>
                                        <Input
                                            value={currentWelcome.signature_title || ''}
                                            onChange={(e) => setHomeData({ ...homeData, welcome: { ...homeData.welcome, [activeLocale]: { ...currentWelcome, signature_title: e.target.value } } })}
                                            placeholder="Kurucu Doktor"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Profil Görseli</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={currentWelcome.image.url || ''}
                                                onChange={(e) => setHomeData({ ...homeData, welcome: { ...homeData.welcome, [activeLocale]: { ...currentWelcome, image: { ...currentWelcome.image, url: e.target.value } } } })}
                                                placeholder="Profil resmi URL"
                                            />
                                            <Button type="button" variant="outline" onClick={() => { setMediaTarget('welcome-image'); setShowMediaPicker(true); }}>
                                                <ImageIcon className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Arka Plan Görseli (Yuvarlak Gradient için)</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={currentWelcome.background_image || ''}
                                                onChange={(e) => setHomeData({ ...homeData, welcome: { ...homeData.welcome, [activeLocale]: { ...currentWelcome, background_image: e.target.value } } })}
                                                placeholder="Arka plan resmi URL"
                                            />
                                            <Button type="button" variant="outline" onClick={() => { setMediaTarget('welcome-bg'); setShowMediaPicker(true); }}>
                                                <ImageIcon className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            Yuvarlak gradient efekti için kullanılacak arka plan resmi
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-lg font-semibold">Gradient Renkleri</Label>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label>From (Başlangıç)</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="color"
                                                    value={currentWelcome.gradient.from || '#F7DFE6'}
                                                    onChange={(e) => setHomeData({ ...homeData, welcome: { ...homeData.welcome, [activeLocale]: { ...currentWelcome, gradient: { ...currentWelcome.gradient, from: e.target.value } } } })}
                                                    className="w-16 h-10"
                                                />
                                                <Input
                                                    value={currentWelcome.gradient.from || ''}
                                                    onChange={(e) => setHomeData({ ...homeData, welcome: { ...homeData.welcome, [activeLocale]: { ...currentWelcome, gradient: { ...currentWelcome.gradient, from: e.target.value } } } })}
                                                    placeholder="#F7DFE6"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Via (Orta)</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="color"
                                                    value={currentWelcome.gradient.via || '#FFFFFF'}
                                                    onChange={(e) => setHomeData({ ...homeData, welcome: { ...homeData.welcome, [activeLocale]: { ...currentWelcome, gradient: { ...currentWelcome.gradient, via: e.target.value } } } })}
                                                    className="w-16 h-10"
                                                />
                                                <Input
                                                    value={currentWelcome.gradient.via || ''}
                                                    onChange={(e) => setHomeData({ ...homeData, welcome: { ...homeData.welcome, [activeLocale]: { ...currentWelcome, gradient: { ...currentWelcome.gradient, via: e.target.value } } } })}
                                                    placeholder="#FFFFFF"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>To (Bitiş)</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="color"
                                                    value={currentWelcome.gradient.to || '#FFFFFF'}onChange={(e) => setHomeData({ ...homeData, welcome: { ...homeData.welcome, [activeLocale]: { ...currentWelcome, gradient: { ...currentWelcome.gradient, to: e.target.value } } } })}
                                                    className="w-16 h-10"
                                                />
                                                <Input
                                                    value={currentWelcome.gradient.to || ''}
                                                    onChange={(e) => setHomeData({ ...homeData, welcome: { ...homeData.welcome, [activeLocale]: { ...currentWelcome, gradient: { ...currentWelcome.gradient, to: e.target.value } } } })}
                                                    placeholder="#FFFFFF"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Button type="submit" disabled={saving} className="w-full bg-primary-pink hover:bg-pink-700">
                                    {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Kaydediliyor...</> : <><Save className="w-4 h-4 mr-2" />Her İki Dili Kaydet</>}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="treatments">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Treatments Section ({activeLocale === 'tr' ? '🇹🇷 Türkçe' : '🇬🇧 English'})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={(e) => { e.preventDefault(); handleSave('treatments'); }} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Üst Başlık</Label>
                                        <Input
                                            value={currentTreatments.top_title || ''}
                                            onChange={(e) => setHomeData({ ...homeData, treatments: { ...homeData.treatments, [activeLocale]: { ...currentTreatments, top_title: e.target.value } } })}
                                            placeholder="Üst başlık..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Ana Başlık</Label>
                                        <Input
                                            value={currentTreatments.title || ''}
                                            onChange={(e) => setHomeData({ ...homeData, treatments: { ...homeData.treatments, [activeLocale]: { ...currentTreatments, title: e.target.value } } })}
                                            placeholder="Ana başlık..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>İçerik</Label>
                                    <RawEditor
                                        content={currentTreatments.content || ''}
                                        onChange={(html) => setHomeData({ ...homeData, treatments: { ...homeData.treatments, [activeLocale]: { ...currentTreatments, content: html } } })}
                                        placeholder="Tedaviler hakkında içerik yazın..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>İletişim Butonu Yazısı</Label>
                                    <Input
                                        value={currentTreatments.contact_button_text || ''}
                                        onChange={(e) => setHomeData({ ...homeData, treatments: { ...homeData.treatments, [activeLocale]: { ...currentTreatments, contact_button_text: e.target.value } } })}
                                        placeholder="İletişime Geç"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Arka Plan Logo</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={currentTreatments.background_logo || ''}
                                            onChange={(e) => setHomeData({ ...homeData, treatments: { ...homeData.treatments, [activeLocale]: { ...currentTreatments, background_logo: e.target.value } } })}
                                            placeholder="Logo URL"
                                        />
                                        <Button type="button" variant="outline" onClick={() => { setMediaTarget('treatments-logo'); setShowMediaPicker(true); }}>
                                            <ImageIcon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-lg font-semibold">Tedavi Listesi</Label>
                                        <Button type="button" size="sm" onClick={addTreatment} variant="outline">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Tedavi Ekle
                                        </Button>
                                    </div>

                                    {currentTreatments.treatments.map((treatment, idx) => (
                                        <Card key={idx} className="p-4 bg-gray-50">
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <Label className="font-semibold">Tedavi {idx + 1}</Label>
                                                    <div className="flex gap-2">
                                                        <Button type="button" size="sm" variant="outline" onClick={() => moveTreatment(idx, 'up')} disabled={idx === 0}>
                                                            <ChevronUp className="w-4 h-4" />
                                                        </Button>
                                                        <Button type="button" size="sm" variant="outline" onClick={() => moveTreatment(idx, 'down')} disabled={idx === currentTreatments.treatments.length - 1}>
                                                            <ChevronDown className="w-4 h-4" />
                                                        </Button>
                                                        <Button type="button" size="sm" variant="destructive" onClick={() => removeTreatment(idx)}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-3 gap-3">
                                                    <div className="space-y-1">
                                                        <Label className="text-xs">Etiket</Label>
                                                        <Input
                                                            value={treatment.label || ''}
                                                            onChange={(e) => updateTreatment(idx, 'label', e.target.value)}
                                                            placeholder="IVF Tedavisi"
                                                        />
                                                    </div>

                                                    <div className="space-y-1">
                                                        <Label className="text-xs">Link (href)</Label>
                                                        <Input
                                                            value={treatment.href || ''}
                                                            onChange={(e) => updateTreatment(idx, 'href', e.target.value)}
                                                            placeholder="/ivf"
                                                        />
                                                    </div>

                                                    <div className="space-y-1">
                                                        <Label className="text-xs">ID</Label>
                                                        <Input
                                                            value={treatment.id || ''}
                                                            onChange={(e) => updateTreatment(idx, 'id', e.target.value)}
                                                            placeholder="ivf-treatment"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                                    <Label className="text-sm">Aktif</Label>
                                                    <Switch
                                                        checked={treatment.isActive}
                                                        onCheckedChange={(checked) => updateTreatment(idx, 'isActive', checked)}
                                                    />
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>

                                <Button type="submit" disabled={saving} className="w-full bg-primary-pink hover:bg-pink-700">
                                    {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Kaydediliyor...</> : <><Save className="w-4 h-4 mr-2" />Her İki Dili Kaydet</>}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="contact">
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Map Section</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSave("contactMap");
                                }}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Statik Görsel URL</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={homeData.contactMap.image || ''}
                                                onChange={(e) =>
                                                    setHomeData({
                                                        ...homeData,
                                                        contactMap: {
                                                            ...homeData.contactMap,
                                                            image: e.target.value,
                                                        },
                                                    })
                                                }
                                                placeholder="https://..."
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setMediaTarget("contact-image");
                                                    setShowMediaPicker(true);
                                                }}
                                            >
                                                <ImageIcon className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            Google Maps yerine gösterilecek statik harita görseli
                                        </p>
                                    </div>

                                    {homeData.contactMap.image && (
                                        <div className="space-y-2">
                                            <Label>Önizleme</Label>
                                            <div className="w-full h-64 border rounded-lg overflow-hidden bg-gray-100">
                                                <img
                                                    src={homeData.contactMap.image}
                                                    alt="Contact Map"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-primary-pink hover:bg-pink-700"
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
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <MediaPicker
                open={showMediaPicker}
                onOpenChange={setShowMediaPicker}
                onSelect={handleMediaSelect}
            />
        </div>
    );
}