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
import { Loader2, Save, Home, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import MediaPicker from '@/src/components/MediaPicker';

interface HeroSlide {
    image: {
        url: string;
        alt: string;
    };
    title?: string;
    subtitle?: string;
}

interface HeroData {
    locale: string;
    slides: HeroSlide[];
    dots_pattern: string;
    auto_play: boolean;
    auto_play_interval: number;
    show_indicators: boolean;
    right_text: string;
    bottom_text: string;
}

interface WelcomeData {
    locale: string;
    image: {
        url: string;
        alt: string;
        width: number;
        height: number;
    };
    gradient: {
        from: string;
        via: string;
        to: string;
    };
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

interface TreatmentsData {
    locale: string;
    background_logo: string;
    treatments: TreatmentItem[];
    top_title: string;
    title: string;
    description1: string;
    description2: string;
    contact_button_text: string;
}

interface ContactMapData {
    locale: string;
    show_iframe: boolean;
    map_url: string;
    image: string;
}

export default function HomeEditorPage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('hero');

    // Media Picker
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [mediaTarget, setMediaTarget] = useState<string>('');

    // Hero State
    const [heroData, setHeroData] = useState<HeroData>({
        locale: 'tr',
        slides: [],
        dots_pattern: '',
        auto_play: true,
        auto_play_interval: 5000,
        show_indicators: true,
        right_text: '',
        bottom_text: '',
    });

    // Welcome State
    const [welcomeData, setWelcomeData] = useState<WelcomeData>({
        locale: 'tr',
        image: { url: '', alt: '', width: 400, height: 400 },
        gradient: { from: '#F7DFE6', via: '#FFFFFF', to: '#FFFFFF' },
        title_top: '',
        title: '',
        paragraphs: ['', '', '', '', ''],
        signature_name: '',
        signature_title: '',
    });

    // Treatments State
    const [treatmentsData, setTreatmentsData] = useState<TreatmentsData>({
        locale: 'tr',
        background_logo: '',
        treatments: [],
        top_title: '',
        title: '',
        description1: '',
        description2: '',
        contact_button_text: '',
    });

    // Contact Map State
    const [contactMapData, setContactMapData] = useState<ContactMapData>({
        locale: 'tr',
        show_iframe: true,
        map_url: '',
        image: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [heroRes, welcomeRes, treatmentsRes, contactMapRes] = await Promise.all([
                axios.get('/hero?locale=tr').catch(() => ({ data: { data: null } })),
                axios.get('/welcome?locale=tr').catch(() => ({ data: { data: null } })),
                axios.get('/treatments?locale=tr').catch(() => ({ data: { data: null } })),
                axios.get('/contact-map?locale=tr').catch(() => ({ data: { data: null } })),
            ]);

            // Hero Data
            if (heroRes.data.data) {
                setHeroData({
                    ...heroData,
                    ...heroRes.data.data,
                    slides: heroRes.data.data.slides || [],
                });
            }

            // Welcome Data
            if (welcomeRes.data.data) {
                setWelcomeData({
                    ...welcomeData,
                    ...welcomeRes.data.data,
                    paragraphs: welcomeRes.data.data.paragraphs || ['', '', '', '', ''],
                    image: welcomeRes.data.data.image || { url: '', alt: '', width: 400, height: 400 },
                    gradient: welcomeRes.data.data.gradient || { from: '#F7DFE6', via: '#FFFFFF', to: '#FFFFFF' },
                });
            }

            // Treatments Data
            if (treatmentsRes.data.data) {
                setTreatmentsData({
                    ...treatmentsData,
                    ...treatmentsRes.data.data,
                    treatments: treatmentsRes.data.data.treatments || [],
                });
            }

            // Contact Map Data
            if (contactMapRes.data.data) {
                setContactMapData({
                    ...contactMapData,
                    ...contactMapRes.data.data,
                });
            }
        } catch (error: any) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleSaveHero = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            console.log('Sending hero data:', JSON.stringify(heroData, null, 2));
            await axios.put('/hero', heroData);
            toast({ title: 'Başarılı', description: 'Hero section güncellendi' });
        } catch (error: any) {
            console.error('Hero save error:', error.response?.data);
            toast({
                title: 'Hata',
                description: error.response?.data?.message || 'Güncelleme başarısız',
                variant: 'destructive',
            });
        } finally {
            setSaving(false);
        }
    };

    const handleSaveWelcome = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.put('/welcome', welcomeData);
            toast({ title: 'Başarılı', description: 'Welcome section güncellendi' });
        } catch (error: any) {
            toast({
                title: 'Hata',
                description: error.response?.data?.message || 'Güncelleme başarısız',
                variant: 'destructive',
            });
        } finally {
            setSaving(false);
        }
    };

    const handleSaveTreatments = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.put('/treatments', treatmentsData);
            toast({ title: 'Başarılı', description: 'Treatments section güncellendi' });
        } catch (error: any) {
            toast({
                title: 'Hata',
                description: error.response?.data?.message || 'Güncelleme başarısız',
                variant: 'destructive',
            });
        } finally {
            setSaving(false);
        }
    };

    const handleSaveContactMap = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.put('/contact-map', contactMapData);
            toast({ title: 'Başarılı', description: 'Contact Map section güncellendi' });
        } catch (error: any) {
            toast({
                title: 'Hata',
                description: error.response?.data?.message || 'Güncelleme başarısız',
                variant: 'destructive',
            });
        } finally {
            setSaving(false);
        }
    };

    // Hero: Add Slide
    const addSlide = () => {
        setHeroData({
            ...heroData,
            slides: [...heroData.slides, { image: { url: '', alt: '' } }],
        });
    };

    // Hero: Remove Slide
    const removeSlide = (index: number) => {
        setHeroData({
            ...heroData,
            slides: heroData.slides.filter((_, i) => i !== index),
        });
    };

    // Hero: Update Slide
    const updateSlide = (index: number, field: string, value: string) => {
        const newSlides = [...heroData.slides];
        if (field === 'url') {
            newSlides[index].image.url = value;
        } else if (field === 'alt') {
            newSlides[index].image.alt = value;
        } else if (field === 'title') {
            newSlides[index].title = value;
        } else if (field === 'subtitle') {
            newSlides[index].subtitle = value;
        }
        setHeroData({ ...heroData, slides: newSlides });
    };

    // Treatments: Add Treatment
    const addTreatment = () => {
        setTreatmentsData({
            ...treatmentsData,
            treatments: [
                ...treatmentsData.treatments,
                { id: '', href: '', label: '', order: treatmentsData.treatments.length + 1, isActive: true },
            ],
        });
    };

    // Treatments: Remove Treatment
    const removeTreatment = (index: number) => {
        setTreatmentsData({
            ...treatmentsData,
            treatments: treatmentsData.treatments.filter((_, i) => i !== index),
        });
    };

    // Treatments: Update Treatment
    const updateTreatment = (index: number, field: keyof TreatmentItem, value: any) => {
        const newTreatments = [...treatmentsData.treatments];
        newTreatments[index][field] = value as never;
        setTreatmentsData({ ...treatmentsData, treatments: newTreatments });
    };

    // Media Picker Handler
    const handleMediaSelect = (url: string) => {
        if (mediaTarget.startsWith('hero-slide-')) {
            const index = parseInt(mediaTarget.replace('hero-slide-', ''));
            updateSlide(index, 'url', url);
        } else if (mediaTarget === 'hero-dots') {
            setHeroData({ ...heroData, dots_pattern: url });
        } else if (mediaTarget === 'welcome-image') {
            setWelcomeData({ ...welcomeData, image: { ...welcomeData.image, url } });
        } else if (mediaTarget === 'treatments-logo') {
            setTreatmentsData({ ...treatmentsData, background_logo: url });
        } else if (mediaTarget === 'contact-image') {
            setContactMapData({ ...contactMapData, image: url });
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-primary-pink flex items-center gap-2">
                    Ana Sayfa
                </h1>
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
                            <CardTitle>Hero Section</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSaveHero} className="space-y-6">
                                {/* Slides */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label>Slides *</Label>
                                        <Button type="button" size="sm" onClick={addSlide} variant="outline">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Slide Ekle
                                        </Button>
                                    </div>

                                    {heroData.slides.map((slide, index) => (
                                        <Card key={index} className="p-4">
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <Label>Slide {index + 1}</Label>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => removeSlide(index)}
                                                    >
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
                                                            onClick={() => {
                                                                setMediaTarget(`hero-slide-${index}`);
                                                                setShowMediaPicker(true);
                                                            }}
                                                        >
                                                            <ImageIcon className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Alt Text</Label>
                                                    <Input
                                                        value={slide.image.alt || ''}
                                                        onChange={(e) => updateSlide(index, 'alt', e.target.value)}
                                                        placeholder="Görsel açıklaması"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Merkez Başlık (Opsiyonel)</Label>
                                                    <Input
                                                        value={slide.title || ''}
                                                        onChange={(e) => updateSlide(index, 'title', e.target.value)}
                                                        placeholder="Ana başlık"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Merkez Alt Başlık (Opsiyonel)</Label>
                                                    <Input
                                                        value={slide.subtitle || ''}
                                                        onChange={(e) => updateSlide(index, 'subtitle', e.target.value)}
                                                        placeholder="Alt başlık"
                                                    />
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>

                                {/* Dots Pattern */}
                                <div className="space-y-2">
                                    <Label>Dots Pattern URL</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={heroData.dots_pattern || ''}
                                            onChange={(e) => setHeroData({ ...heroData, dots_pattern: e.target.value })}
                                            placeholder="https://..."
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setMediaTarget('hero-dots');
                                                setShowMediaPicker(true);
                                            }}
                                        >
                                            <ImageIcon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Settings */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Sağ Taraf Yazısı</Label>
                                        <Input
                                            value={heroData.right_text || ''}
                                            onChange={(e) => setHeroData({ ...heroData, right_text: e.target.value })}
                                            placeholder="FERTILITY CLINIC"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Alt Yazı</Label>
                                        <Input
                                            value={heroData.bottom_text || ''}
                                            onChange={(e) => setHeroData({ ...heroData, bottom_text: e.target.value })}
                                            placeholder="creating miracles"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <Label>Otomatik Oynat</Label>
                                        <Switch
                                            checked={heroData.auto_play}
                                            onCheckedChange={(checked) => setHeroData({ ...heroData, auto_play: checked })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Oynatma Süresi (ms)</Label>
                                        <Input
                                            type="number"
                                            value={heroData.auto_play_interval || 5000}
                                            onChange={(e) => setHeroData({ ...heroData, auto_play_interval: parseInt(e.target.value) || 5000 })}
                                            min="1000"
                                            step="1000"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <Label>Göstergeleri Göster</Label>
                                        <Switch
                                            checked={heroData.show_indicators}
                                            onCheckedChange={(checked) => setHeroData({ ...heroData, show_indicators: checked })}
                                        />
                                    </div>
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
                </TabsContent>

                {/* WELCOME SECTION */}
                <TabsContent value="welcome">
                    <Card>
                        <CardHeader>
                            <CardTitle>Welcome Section</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSaveWelcome} className="space-y-4">
                                {/* Text Fields */}
                                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                                    <h3 className="font-semibold">Yazı İçerikleri</h3>

                                    <div className="space-y-2">
                                        <Label>Üst Başlık</Label>
                                        <Input
                                            value={welcomeData.title_top || ''}
                                            onChange={(e) => setWelcomeData({ ...welcomeData, title_top: e.target.value })}
                                            placeholder="HOŞGELDİNİZ"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Ana Başlık</Label>
                                        <Input
                                            value={welcomeData.title || ''}
                                            onChange={(e) => setWelcomeData({ ...welcomeData, title: e.target.value })}
                                            placeholder="AYDA IVF"
                                        />
                                    </div>

                                    {welcomeData.paragraphs.map((p, index) => (
                                        <div key={index} className="space-y-2">
                                            <Label>Paragraf {index + 1}</Label>
                                            <Textarea
                                                value={p || ''}
                                                onChange={(e) => {
                                                    const newParagraphs = [...welcomeData.paragraphs];
                                                    newParagraphs[index] = e.target.value;
                                                    setWelcomeData({ ...welcomeData, paragraphs: newParagraphs });
                                                }}
                                                placeholder={`Paragraf ${index + 1} içeriği...`}
                                                rows={2}
                                            />
                                        </div>
                                    ))}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>İmza - İsim</Label>
                                            <Input
                                                value={welcomeData.signature_name || ''}
                                                onChange={(e) => setWelcomeData({ ...welcomeData, signature_name: e.target.value })}
                                                placeholder="Dr. Ayda Yılmaz"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>İmza - Ünvan</Label>
                                            <Input
                                                value={welcomeData.signature_title || ''}
                                                onChange={(e) => setWelcomeData({ ...welcomeData, signature_title: e.target.value })}
                                                placeholder="Kurucu Doktor"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Görsel URL</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={welcomeData.image.url || ''}
                                            onChange={(e) => setWelcomeData({ ...welcomeData, image: { ...welcomeData.image, url: e.target.value } })}
                                            placeholder="https://..."
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setMediaTarget('welcome-image');
                                                setShowMediaPicker(true);
                                            }}
                                        >
                                            <ImageIcon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Alt Text</Label>
                                    <Input
                                        value={welcomeData.image.alt || ''}
                                        onChange={(e) => setWelcomeData({ ...welcomeData, image: { ...welcomeData.image, alt: e.target.value } })}
                                        placeholder="Görsel açıklaması"
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label>Gradient From</Label>
                                        <Input
                                            type="color"
                                            value={welcomeData.gradient.from || '#F7DFE6'}
                                            onChange={(e) => setWelcomeData({ ...welcomeData, gradient: { ...welcomeData.gradient, from: e.target.value } })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Gradient Via</Label>
                                        <Input
                                            type="color"
                                            value={welcomeData.gradient.via || '#FFFFFF'}
                                            onChange={(e) => setWelcomeData({ ...welcomeData, gradient: { ...welcomeData.gradient, via: e.target.value } })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Gradient To</Label>
                                        <Input
                                            type="color"
                                            value={welcomeData.gradient.to || '#FFFFFF'}
                                            onChange={(e) => setWelcomeData({ ...welcomeData, gradient: { ...welcomeData.gradient, to: e.target.value } })}
                                        />
                                    </div>
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
                </TabsContent>

                {/* TREATMENTS SECTION */}
                <TabsContent value="treatments">
                    <Card>
                        <CardHeader>
                            <CardTitle>Treatments Section</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSaveTreatments} className="space-y-6">
                                {/* Text Fields */}
                                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                                    <h3 className="font-semibold">Yazı İçerikleri</h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Üst Başlık</Label>
                                            <Input
                                                value={treatmentsData.top_title || ''}
                                                onChange={(e) => setTreatmentsData({ ...treatmentsData, top_title: e.target.value })}
                                                placeholder="TEDAVİLERİMİZ"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Ana Başlık</Label>
                                            <Input
                                                value={treatmentsData.title || ''}
                                                onChange={(e) => setTreatmentsData({ ...treatmentsData, title: e.target.value })}
                                                placeholder="Tedavi Yöntemlerimiz"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Açıklama 1</Label>
                                        <Textarea
                                            value={treatmentsData.description1 || ''}
                                            onChange={(e) => setTreatmentsData({ ...treatmentsData, description1: e.target.value })}
                                            placeholder="İlk açıklama paragrafı..."
                                            rows={2}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Açıklama 2</Label>
                                        <Textarea
                                            value={treatmentsData.description2 || ''}
                                            onChange={(e) => setTreatmentsData({ ...treatmentsData, description2: e.target.value })}
                                            placeholder="İkinci açıklama paragrafı..."
                                            rows={2}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>İletişim Butonu Yazısı</Label>
                                        <Input
                                            value={treatmentsData.contact_button_text || ''}
                                            onChange={(e) => setTreatmentsData({ ...treatmentsData, contact_button_text: e.target.value })}
                                            placeholder="İletişime Geçin"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Background Logo URL</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={treatmentsData.background_logo || ''}
                                            onChange={(e) => setTreatmentsData({ ...treatmentsData, background_logo: e.target.value })}
                                            placeholder="https://..."
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setMediaTarget('treatments-logo');
                                                setShowMediaPicker(true);
                                            }}
                                        >
                                            <ImageIcon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label>Tedavi Yöntemleri</Label>
                                        <Button type="button" size="sm" onClick={addTreatment} variant="outline">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Tedavi Ekle
                                        </Button>
                                    </div>

                                    {treatmentsData.treatments.map((treatment, index) => (
                                        <Card key={index} className="p-4">
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <Label>Tedavi {index + 1}</Label>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => removeTreatment(index)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="space-y-2">
                                                        <Label>ID</Label>
                                                        <Input
                                                            value={treatment.id || ''}
                                                            onChange={(e) => updateTreatment(index, 'id', e.target.value)}placeholder="ivf"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Href</Label>
                                                        <Input
                                                            value={treatment.href || ''}
                                                            onChange={(e) => updateTreatment(index, 'href', e.target.value)}
                                                            placeholder="/ivf-icsi"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Label</Label>
                                                        <Input
                                                            value={treatment.label || ''}
                                                            onChange={(e) => updateTreatment(index, 'label', e.target.value)}
                                                            placeholder="IVF-ICSI"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Sıra</Label>
                                                        <Input
                                                            type="number"
                                                            value={treatment.order || 0}
                                                            onChange={(e) => updateTreatment(index, 'order', parseInt(e.target.value) || 0)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <Label>Aktif</Label>
                                                    <Switch
                                                        checked={treatment.isActive}
                                                        onCheckedChange={(checked) => updateTreatment(index, 'isActive', checked)}
                                                    />
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
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
                </TabsContent>

                {/* CONTACT MAP SECTION */}
                <TabsContent value="contact">
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Map Section</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSaveContactMap} className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <Label>Google Maps Iframe Kullan</Label>
                                    <Switch
                                        checked={contactMapData.show_iframe}
                                        onCheckedChange={(checked) => setContactMapData({ ...contactMapData, show_iframe: checked })}
                                    />
                                </div>

                                {contactMapData.show_iframe ? (
                                    <div className="space-y-2">
                                        <Label>Google Maps Embed URL</Label>
                                        <Textarea
                                            value={contactMapData.map_url || ''}
                                            onChange={(e) => setContactMapData({ ...contactMapData, map_url: e.target.value })}
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
                                                value={contactMapData.image || ''}
                                                onChange={(e) => setContactMapData({ ...contactMapData, image: e.target.value })}
                                                placeholder="https://..."
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setMediaTarget('contact-image');
                                                    setShowMediaPicker(true);
                                                }}
                                            >
                                                <ImageIcon className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            Harita yerine gösterilecek statik görsel (screenshot veya custom görsel)
                                        </p>
                                    </div>
                                )}

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
                </TabsContent>
            </Tabs>

            {/* Media Picker */}
            <MediaPicker
                open={showMediaPicker}
                onOpenChange={setShowMediaPicker}
                onSelect={handleMediaSelect}
            />
        </div>
    );
}