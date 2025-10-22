'use client';

import { useState, useEffect } from 'react';
import axios from '@/src/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/src/components/ui/use-toast';
import { Loader2, Save, Plus, Trash2, Image as ImageIcon, Languages, ChevronUp, ChevronDown } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import MediaPicker from '@/src/components/MediaPicker';

interface HeroSlide {
    image: { url: string; alt: string };
    title?: string;
    subtitle?: string;
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
    title_top: string;
    title: string;
    paragraphs: string[];
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
    description1: string;
    description2: string;
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
    title_top: '',
    title: '',
    paragraphs: ['', '', '', '', ''],
    signature_name: '',
    signature_title: '',
};

const DEFAULT_TREATMENTS: TreatmentsLocaleData = {
    background_logo: '',
    treatments: [],
    top_title: '',
    title: '',
    description1: '',
    description2: '',
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
            toast({ title: '✅ Başarılı', description: `${section} bölümü her iki dil için kaydedildi` });
        } catch (error: any) {
            console.error('❌ Save error:', error);
            toast({ title: '❌ Hata', description: 'Kayıt başarısız', variant: 'destructive' });
        } finally {
            setSaving(false);
        }
    };

    // Hero Functions
    const addSlide = () => {
        const current = homeData.hero[activeLocale];
        setHomeData({
            ...homeData,
            hero: {
                ...homeData.hero,
                [activeLocale]: {
                    ...current,
                    slides: [...current.slides, { image: { url: '', alt: '' } }],
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

    const updateSlide = (index: number, field: string, value: string) => {
        const current = homeData.hero[activeLocale];
        const newSlides = [...current.slides];
        if (field === 'url') newSlides[index].image.url = value;
        else if (field === 'alt') newSlides[index].image.alt = value;
        else if (field === 'title') newSlides[index].title = value;
        else if (field === 'subtitle') newSlides[index].subtitle = value;

        setHomeData({
            ...homeData,
            hero: { ...homeData.hero, [activeLocale]: { ...current, slides: newSlides } },
        });
    };

    // Treatment Functions
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

    // Media Picker Handler
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
                <h1 className="text-3xl font-bold text-primary-pink flex items-center gap-2">
                    Home
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

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="hero">Hero</TabsTrigger>
                    <TabsTrigger value="welcome">Welcome</TabsTrigger>
                    <TabsTrigger value="treatments">Treatments</TabsTrigger>
                    <TabsTrigger value="contact">Contact Map</TabsTrigger>
                </TabsList>

                {/* HERO SECTION */}
                <TabsContent value="hero">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                Hero Section ({activeLocale === 'tr' ? '🇹🇷 Türkçe' : '🇬🇧 English'})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={(e) => { e.preventDefault(); handleSave('hero'); }} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label>Slides *</Label>
                                        <Button type="button" size="sm" onClick={addSlide} variant="outline">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Slide Ekle
                                        </Button>
                                    </div>

                                    {currentHero.slides.map((slide, index) => (
                                        <Card key={index} className="p-4">
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <Label>Slide {index + 1}</Label>
                                                    <Button type="button" size="sm" variant="destructive" onClick={() => removeSlide(index)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Görsel URL</Label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            value={slide.image.url}
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
                                                    value={slide.image.alt}
                                                    onChange={(e) => updateSlide(index, 'alt', e.target.value)}
                                                    placeholder="Alt text"
                                                />

                                                <Input
                                                    value={slide.title || ''}
                                                    onChange={(e) => updateSlide(index, 'title', e.target.value)}
                                                    placeholder={activeLocale === 'tr' ? 'Merkez Başlık' : 'Center Title'}
                                                />

                                                <Input
                                                    value={slide.subtitle || ''}
                                                    onChange={(e) => updateSlide(index, 'subtitle', e.target.value)}
                                                    placeholder={activeLocale === 'tr' ? 'Alt Başlık' : 'Subtitle'}
                                                />
                                            </div>
                                        </Card>
                                    ))}
                                </div>

                                <div className="space-y-2">
                                    <Label>Dots Pattern URL</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={currentHero.dots_pattern}
                                            onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, [activeLocale]: { ...currentHero, dots_pattern: e.target.value } } })}
                                        />
                                        <Button type="button" variant="outline" onClick={() => { setMediaTarget('hero-dots'); setShowMediaPicker(true); }}>
                                            <ImageIcon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        value={currentHero.right_text}
                                        onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, [activeLocale]: { ...currentHero, right_text: e.target.value } } })}
                                        placeholder={activeLocale === 'tr' ? 'Sağ Yazı' : 'Right Text'}
                                    />

                                    <Input
                                        value={currentHero.bottom_text}
                                        onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, [activeLocale]: { ...currentHero, bottom_text: e.target.value } } })}
                                        placeholder={activeLocale === 'tr' ? 'Alt Yazı' : 'Bottom Text'}
                                    />

                                    <div className="flex items-center justify-between">
                                        <Label>Otomatik Oynat</Label>
                                        <Switch
                                            checked={currentHero.auto_play}
                                            onCheckedChange={(checked) => setHomeData({ ...homeData, hero: { ...homeData.hero, [activeLocale]: { ...currentHero, auto_play: checked } } })}
                                        />
                                    </div>

                                    <Input
                                        type="number"
                                        value={currentHero.auto_play_interval}
                                        onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, [activeLocale]: { ...currentHero, auto_play_interval: parseInt(e.target.value) || 5000 } } })}
                                        min="1000"
                                        step="1000"
                                    />
                                </div>

                                <Button type="submit" disabled={saving} className="bg-primary-pink hover:bg-pink-700">
                                    {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Kaydediliyor...</> : <><Save className="w-4 h-4 mr-2" />Her İki Dili Kaydet</>}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* WELCOME SECTION */}
                <TabsContent value="welcome">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                Welcome Section ({activeLocale === 'tr' ? '🇹🇷 Türkçe' : '🇬🇧 English'})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={(e) => { e.preventDefault(); handleSave('welcome'); }} className="space-y-4">
                                <Input
                                    value={currentWelcome.title_top}
                                    onChange={(e) => setHomeData({ ...homeData, welcome: { ...homeData.welcome, [activeLocale]: { ...currentWelcome, title_top: e.target.value } } })}
                                    placeholder={activeLocale === 'tr' ? 'Üst Başlık' : 'Top Title'}
                                />

                                <Input
                                    value={currentWelcome.title}
                                    onChange={(e) => setHomeData({ ...homeData, welcome: { ...homeData.welcome, [activeLocale]: { ...currentWelcome, title: e.target.value } } })}
                                    placeholder={activeLocale === 'tr' ? 'Ana Başlık' : 'Main Title'}
                                />

                                {currentWelcome.paragraphs.map((p, idx) => (
                                    <Textarea
                                        key={idx}
                                        value={p}
                                        onChange={(e) => {
                                            const newParagraphs = [...currentWelcome.paragraphs];
                                            newParagraphs[idx] = e.target.value;
                                            setHomeData({ ...homeData, welcome: { ...homeData.welcome, [activeLocale]: { ...currentWelcome, paragraphs: newParagraphs } } });
                                        }}
                                        placeholder={`Paragraf ${idx + 1}`}
                                        rows={2}
                                    />
                                ))}

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        value={currentWelcome.signature_name}
                                        onChange={(e) => setHomeData({ ...homeData, welcome: { ...homeData.welcome, [activeLocale]: { ...currentWelcome, signature_name: e.target.value } } })}
                                        placeholder={activeLocale === 'tr' ? 'İmza - İsim' : 'Signature - Name'}
                                    />

                                    <Input
                                        value={currentWelcome.signature_title}
                                        onChange={(e) => setHomeData({ ...homeData, welcome: { ...homeData.welcome, [activeLocale]: { ...currentWelcome, signature_title: e.target.value } } })}
                                        placeholder={activeLocale === 'tr' ? 'İmza - Ünvan' : 'Signature - Title'}
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <Input
                                        value={currentWelcome.image.url}
                                        onChange={(e) => setHomeData({ ...homeData, welcome: { ...homeData.welcome, [activeLocale]: { ...currentWelcome, image: { ...currentWelcome.image, url: e.target.value } } } })}
                                        placeholder="Görsel URL"
                                    />
                                    <Button type="button" variant="outline" onClick={() => { setMediaTarget('welcome-image'); setShowMediaPicker(true); }}>
                                        <ImageIcon className="w-4 h-4" />
                                    </Button>
                                </div>

                                <Button type="submit" disabled={saving} className="bg-primary-pink hover:bg-pink-700">
                                    {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Kaydediliyor...</> : <><Save className="w-4 h-4 mr-2" />Her İki Dili Kaydet</>}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TREATMENTS SECTION */}
                <TabsContent value="treatments">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                Treatments Section ({activeLocale === 'tr' ? '🇹🇷 Türkçe' : '🇬🇧 English'})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={(e) => { e.preventDefault(); handleSave('treatments'); }} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        value={currentTreatments.top_title}
                                        onChange={(e) => setHomeData({ ...homeData, treatments: { ...homeData.treatments, [activeLocale]: { ...currentTreatments, top_title: e.target.value } } })}
                                        placeholder={activeLocale === 'tr' ? 'Üst Başlık' : 'Top Title'}
                                    />

                                    <Input
                                        value={currentTreatments.title}
                                        onChange={(e) => setHomeData({ ...homeData, treatments: { ...homeData.treatments, [activeLocale]: { ...currentTreatments, title: e.target.value } } })}
                                        placeholder={activeLocale === 'tr' ? 'Ana Başlık' : 'Main Title'}
                                    />
                                </div>

                                <Textarea
                                    value={currentTreatments.description1}
                                    onChange={(e) => setHomeData({ ...homeData, treatments: { ...homeData.treatments, [activeLocale]: { ...currentTreatments, description1: e.target.value } } })}
                                    placeholder={activeLocale === 'tr' ? 'Açıklama 1' : 'Description 1'}
                                    rows={2}
                                />

                                <Textarea
                                    value={currentTreatments.description2}
                                    onChange={(e) => setHomeData({ ...homeData, treatments: { ...homeData.treatments, [activeLocale]: { ...currentTreatments, description2: e.target.value } } })}
                                    placeholder={activeLocale === 'tr' ? 'Açıklama 2' : 'Description 2'}
                                    rows={2}
                                />

                                <Input
                                    value={currentTreatments.contact_button_text}
                                    onChange={(e) => setHomeData({ ...homeData, treatments: { ...homeData.treatments, [activeLocale]: { ...currentTreatments, contact_button_text: e.target.value } } })}
                                    placeholder={activeLocale === 'tr' ? 'Buton Yazısı' : 'Button Text'}
                                />

                                <div className="flex gap-2">
                                    <Input
                                        value={currentTreatments.background_logo}
                                        onChange={(e) => setHomeData({ ...homeData, treatments: { ...homeData.treatments, [activeLocale]: { ...currentTreatments, background_logo: e.target.value } } })}
                                        placeholder="Background Logo URL"
                                    />
                                    <Button type="button" variant="outline" onClick={() => { setMediaTarget('treatments-logo'); setShowMediaPicker(true); }}>
                                        <ImageIcon className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label>Tedavi Listesi</Label>
                                        <Button type="button" size="sm" onClick={addTreatment} variant="outline">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Tedavi Ekle
                                        </Button>
                                    </div>

                                    {currentTreatments.treatments.map((treatment, idx) => (
                                        <Card key={idx} className="p-4">
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <Label>Tedavi {idx + 1}</Label>
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
                                                    <Input
                                                        value={treatment.label}
                                                        onChange={(e) => updateTreatment(idx, 'label', e.target.value)}
                                                        placeholder={activeLocale === 'tr' ? 'Etiket' : 'Label'}
                                                    />

                                                    <Input
                                                        value={treatment.href}
                                                        onChange={(e) => updateTreatment(idx, 'href', e.target.value)}
                                                        placeholder="/ivf"
                                                    />

                                                    <div className="flex items-center justify-between">
                                                        <Label className="text-sm">Aktif</Label>
                                                        <Switch
                                                            checked={treatment.isActive}
                                                            onCheckedChange={(checked) => updateTreatment(idx, 'isActive', checked)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>

                                <Button type="submit" disabled={saving} className="bg-primary-pink hover:bg-pink-700">
                                    {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Kaydediliyor...</> : <><Save className="w-4 h-4 mr-2" />Her İki Dili Kaydet</>}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* CONTACT MAP SECTION */}
                <TabsContent value="contact">
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Map Section (Ortak - Common)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={(e) => { e.preventDefault(); handleSave('contactMap'); }} className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <Label>Google Maps Iframe Kullan</Label>
                                    <Switch
                                        checked={homeData.contactMap.show_iframe}
                                        onCheckedChange={(checked) => setHomeData({ ...homeData, contactMap: { ...homeData.contactMap, show_iframe: checked } })}
                                    />
                                </div>

                                {homeData.contactMap.show_iframe ? (
                                    <div className="space-y-2">
                                        <Label>Google Maps Embed URL</Label>
                                        <Textarea
                                            value={homeData.contactMap.map_url}
                                            onChange={(e) => setHomeData({ ...homeData, contactMap: { ...homeData.contactMap, map_url: e.target.value } })}
                                            placeholder="https://www.google.com/maps/embed?pb=..."
                                            rows={3}
                                        />
                                        <p className="text-xs text-gray-500">
                                            Google Maps → Share → Embed a map → Copy HTML → Sadece iframe src içindeki URL'yi yapıştırın
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Label>Statik Görsel URL (Alternatif)</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={homeData.contactMap.image}
                                                onChange={(e) => setHomeData({ ...homeData, contactMap: { ...homeData.contactMap, image: e.target.value } })}
                                                placeholder="https://..."
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => { setMediaTarget('contact-image'); setShowMediaPicker(true); }}
                                            >
                                                <ImageIcon className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                <Button type="submit" disabled={saving} className="bg-primary-pink hover:bg-pink-700">
                                    {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Kaydediliyor...</> : <><Save className="w-4 h-4 mr-2" />Kaydet</>}
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