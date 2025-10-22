'use client';

import { useState, useEffect } from 'react';
import axios from '@/src/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/src/components/ui/use-toast';
import { Loader2, Save, Plus, Trash2, Image as ImageIcon, ChevronDown, ChevronUp, GripVertical, Languages } from 'lucide-react';
import MediaPicker from '@/src/components/MediaPicker';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface NavLink {
    id?: number;
    label: string;
    href: string;
    order: number;
    is_active: boolean;
}

interface NavDropdown {
    label: string;
    links: NavLink[];
}

interface NavbarLocaleData {
    logo_url: string;
    logo_alt: string;
    logo_width: number;
    logo_height: number;
    phone_number: string;
    whatsapp_number: string;
    email: string;
    about: NavDropdown;
    treatments: NavDropdown;
    links: NavLink[];
}

interface NavbarData {
    tr: NavbarLocaleData;
    en: NavbarLocaleData;
}

const DEFAULT_LOCALE_DATA: NavbarLocaleData = {
    logo_url: '',
    logo_alt: '',
    logo_width: 125,
    logo_height: 65,
    phone_number: '',
    whatsapp_number: '',
    email: '',
    about: { label: '', links: [] },
    treatments: { label: '', links: [] },
    links: [],
};

export default function NavbarEditorPage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeLocale, setActiveLocale] = useState<'tr' | 'en'>('tr');
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [mediaPickerTarget, setMediaPickerTarget] = useState<string>('');

    const [navbarData, setNavbarData] = useState<NavbarData>({
        tr: { ...DEFAULT_LOCALE_DATA },
        en: { ...DEFAULT_LOCALE_DATA },
    });

    const [aboutOpen, setAboutOpen] = useState(true);
    const [treatmentsOpen, setTreatmentsOpen] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            // TR ve EN verilerini paralel olarak çek
            const [trResponse, enResponse] = await Promise.all([
                axios.get('/navbar?locale=tr'),
                axios.get('/navbar?locale=en'),
            ]);

            const processData = (data: any): NavbarLocaleData => ({
                logo_url: data.logo?.url || '',
                logo_alt: data.logo?.alt || '',
                logo_width: data.logo?.width || 125,
                logo_height: data.logo?.height || 65,
                phone_number: data.contact?.phone_number || '',
                whatsapp_number: data.contact?.whatsapp_number || '',
                email: data.contact?.email || '',
                about: data.about || { label: '', links: [] },
                treatments: data.treatments || { label: '', links: [] },
                links: data.links || [],
            });

            setNavbarData({
                tr: trResponse.data.data ? processData(trResponse.data.data) : { ...DEFAULT_LOCALE_DATA },
                en: enResponse.data.data ? processData(enResponse.data.data) : { ...DEFAULT_LOCALE_DATA },
            });

            toast({
                title: '✅ Başarılı',
                description: 'Navbar verileri yüklendi',
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

    const validateLocaleData = (data: NavbarLocaleData, locale: string): boolean => {
        // About links validation
        for (let i = 0; i < data.about.links.length; i++) {
            const link = data.about.links[i];
            if (!link.label || link.label.trim() === '') {
                toast({
                    title: '❌ Hata',
                    description: `[${locale.toUpperCase()}] Hakkımızda menüsü ${i + 1}. link: Etiket boş olamaz`,
                    variant: 'destructive',
                });
                return false;
            }
            if (!link.href || link.href.trim() === '') {
                toast({
                    title: '❌ Hata',
                    description: `[${locale.toUpperCase()}] Hakkımızda menüsü ${i + 1}. link: URL boş olamaz`,
                    variant: 'destructive',
                });
                return false;
            }
        }

        // Treatments links validation
        for (let i = 0; i < data.treatments.links.length; i++) {
            const link = data.treatments.links[i];
            if (!link.label || link.label.trim() === '') {
                toast({
                    title: '❌ Hata',
                    description: `[${locale.toUpperCase()}] Tedaviler menüsü ${i + 1}. link: Etiket boş olamaz`,
                    variant: 'destructive',
                });
                return false;
            }
            if (!link.href || link.href.trim() === '') {
                toast({
                    title: '❌ Hata',
                    description: `[${locale.toUpperCase()}] Tedaviler menüsü ${i + 1}. link: URL boş olamaz`,
                    variant: 'destructive',
                });
                return false;
            }
        }

        // Main links validation
        for (let i = 0; i < data.links.length; i++) {
            const link = data.links[i];
            if (!link.label || link.label.trim() === '') {
                toast({
                    title: '❌ Hata',
                    description: `[${locale.toUpperCase()}] Ana menü ${i + 1}. link: Etiket boş olamaz`,
                    variant: 'destructive',
                });
                return false;
            }
            if (!link.href || link.href.trim() === '') {
                toast({
                    title: '❌ Hata',
                    description: `[${locale.toUpperCase()}] Ana menü ${i + 1}. link: URL boş olamaz`,
                    variant: 'destructive',
                });
                return false;
            }
        }

        return true;
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        // Her iki dili de validate et
        if (!validateLocaleData(navbarData.tr, 'tr') || !validateLocaleData(navbarData.en, 'en')) {
            return;
        }

        setSaving(true);
        try {
            // TR ve EN verilerini paralel olarak kaydet
            await Promise.all([
                axios.put('/navbar', { ...navbarData.tr, locale: 'tr' }),
                axios.put('/navbar', { ...navbarData.en, locale: 'en' }),
            ]);

            toast({
                title: '✅ Başarılı',
                description: 'Navbar ayarları her iki dil için kaydedildi',
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

    const handleMediaSelect = (url: string) => {
        if (mediaPickerTarget === 'logo') {
            setNavbarData({
                ...navbarData,
                [activeLocale]: { ...navbarData[activeLocale], logo_url: url },
            });
        }
        setShowMediaPicker(false);
        setMediaPickerTarget('');
    };

    const openMediaPicker = (target: string) => {
        setMediaPickerTarget(target);
        setShowMediaPicker(true);
    };

    const updateField = (field: keyof NavbarLocaleData, value: any) => {
        setNavbarData({
            ...navbarData,
            [activeLocale]: { ...navbarData[activeLocale], [field]: value },
        });
    };

    // About Links Functions
    const addAboutLink = () => {
        const currentData = navbarData[activeLocale];
        updateField('about', {
            ...currentData.about,
            links: [
                ...currentData.about.links,
                { label: '', href: '', order: currentData.about.links.length + 1, is_active: true },
            ],
        });
    };

    const updateAboutLink = (index: number, field: keyof NavLink, value: any) => {
        const currentData = navbarData[activeLocale];
        const newLinks = [...currentData.about.links];
        newLinks[index] = { ...newLinks[index], [field]: value };
        updateField('about', { ...currentData.about, links: newLinks });
    };

    const removeAboutLink = (index: number) => {
        const currentData = navbarData[activeLocale];
        const newLinks = currentData.about.links.filter((_, i) => i !== index);
        updateField('about', { ...currentData.about, links: newLinks });
    };

    const moveAboutLink = (index: number, direction: 'up' | 'down') => {
        const currentData = navbarData[activeLocale];
        const newLinks = [...currentData.about.links];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= newLinks.length) return;
        [newLinks[index], newLinks[newIndex]] = [newLinks[newIndex], newLinks[index]];
        newLinks.forEach((link, i) => (link.order = i + 1));
        updateField('about', { ...currentData.about, links: newLinks });
    };

    // Treatment Links Functions
    const addTreatmentLink = () => {
        const currentData = navbarData[activeLocale];
        updateField('treatments', {
            ...currentData.treatments,
            links: [
                ...currentData.treatments.links,
                { label: '', href: '', order: currentData.treatments.links.length + 1, is_active: true },
            ],
        });
    };

    const updateTreatmentLink = (index: number, field: keyof NavLink, value: any) => {
        const currentData = navbarData[activeLocale];
        const newLinks = [...currentData.treatments.links];
        newLinks[index] = { ...newLinks[index], [field]: value };
        updateField('treatments', { ...currentData.treatments, links: newLinks });
    };

    const removeTreatmentLink = (index: number) => {
        const currentData = navbarData[activeLocale];
        const newLinks = currentData.treatments.links.filter((_, i) => i !== index);
        updateField('treatments', { ...currentData.treatments, links: newLinks });
    };

    const moveTreatmentLink = (index: number, direction: 'up' | 'down') => {
        const currentData = navbarData[activeLocale];
        const newLinks = [...currentData.treatments.links];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= newLinks.length) return;
        [newLinks[index], newLinks[newIndex]] = [newLinks[newIndex], newLinks[index]];
        newLinks.forEach((link, i) => (link.order = i + 1));
        updateField('treatments', { ...currentData.treatments, links: newLinks });
    };

    // Main Links Functions
    const addMainLink = () => {
        const currentData = navbarData[activeLocale];
        updateField('links', [
            ...currentData.links,
            { label: '', href: '', order: currentData.links.length + 1, is_active: true },
        ]);
    };

    const updateMainLink = (index: number, field: keyof NavLink, value: any) => {
        const currentData = navbarData[activeLocale];
        const newLinks = [...currentData.links];
        newLinks[index] = { ...newLinks[index], [field]: value };
        updateField('links', newLinks);
    };

    const removeMainLink = (index: number) => {
        const currentData = navbarData[activeLocale];
        const newLinks = currentData.links.filter((_, i) => i !== index);
        updateField('links', newLinks);
    };

    const moveMainLink = (index: number, direction: 'up' | 'down') => {
        const currentData = navbarData[activeLocale];
        const newLinks = [...currentData.links];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= newLinks.length) return;
        [newLinks[index], newLinks[newIndex]] = [newLinks[newIndex], newLinks[index]];
        newLinks.forEach((link, i) => (link.order = i + 1));
        updateField('links', newLinks);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-12 w-12 animate-spin text-primary-pink" />
            </div>
        );
    }

    const currentData = navbarData[activeLocale];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-primary-pink flex items-center gap-2">
                    Navbar
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
                        {/* Logo Settings */}
                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold text-lg">Logo Ayarları</h3>

                            <div className="space-y-2">
                                <Label>Logo URL</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={currentData.logo_url}
                                        onChange={(e) => updateField('logo_url', e.target.value)}
                                        placeholder="https://..."
                                    />
                                    <Button type="button" variant="outline" onClick={() => openMediaPicker('logo')}>
                                        <ImageIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                                {currentData.logo_url && (
                                    <div className="mt-2">
                                        <img src={currentData.logo_url} alt="Logo Preview" className="h-16 object-contain" />
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Logo Alt Text</Label>
                                    <Input
                                        value={currentData.logo_alt}
                                        onChange={(e) => updateField('logo_alt', e.target.value)}
                                        placeholder={activeLocale === 'tr' ? 'Ayda IVF Logo' : 'Ayda IVF Logo'}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Genişlik</Label>
                                    <Input
                                        type="number"
                                        value={currentData.logo_width}
                                        onChange={(e) => updateField('logo_width', parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Yükseklik</Label>
                                    <Input
                                        type="number"
                                        value={currentData.logo_height}
                                        onChange={(e) => updateField('logo_height', parseInt(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold text-lg">İletişim Bilgileri</h3>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Telefon</Label>
                                    <Input
                                        value={currentData.phone_number}
                                        onChange={(e) => updateField('phone_number', e.target.value)}
                                        placeholder="+90 533 123 4567"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>WhatsApp</Label>
                                    <Input
                                        value={currentData.whatsapp_number}
                                        onChange={(e) => updateField('whatsapp_number', e.target.value)}
                                        placeholder="+90 533 123 4567"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>E-posta</Label>
                                    <Input
                                        type="email"
                                        value={currentData.email}
                                        onChange={(e) => updateField('email', e.target.value)}
                                        placeholder="info@aydaivf.com"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* About Menu */}
                        <Collapsible open={aboutOpen} onOpenChange={setAboutOpen}>
                            <Card>
                                <CollapsibleTrigger asChild>
                                    <CardHeader className="cursor-pointer hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-2">
                                                <GripVertical className="w-5 h-5" />
                                                {activeLocale === 'tr' ? 'Hakkımızda Menüsü' : 'About Menu'} ({currentData.about.links.length} link)
                                            </CardTitle>
                                            <ChevronDown className={`w-5 h-5 transition-transform ${aboutOpen ? 'rotate-180' : ''}`} />
                                        </div>
                                    </CardHeader>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Menü Başlığı</Label>
                                            <Input
                                                value={currentData.about.label}
                                                onChange={(e) => updateField('about', { ...currentData.about, label: e.target.value })}
                                                placeholder={activeLocale === 'tr' ? 'Hakkımızda' : 'About'}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label>Linkler</Label>
                                            <Button type="button" size="sm" onClick={addAboutLink} variant="outline">
                                                <Plus className="w-4 h-4 mr-2" />
                                                Yeni Link
                                            </Button>
                                        </div>

                                        {currentData.about.links.map((link, index) => (
                                            <Card key={index} className="p-4 border-2">
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="font-semibold">Link {index + 1}</Label>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => moveAboutLink(index, 'up')}
                                                                disabled={index === 0}
                                                            >
                                                                <ChevronUp className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => moveAboutLink(index, 'down')}
                                                                disabled={index === currentData.about.links.length - 1}
                                                            >
                                                                <ChevronDown className="w-4 h-4" />
                                                            </Button>
                                                            <Button type="button" size="sm" variant="destructive" onClick={() => removeAboutLink(index)}>
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="space-y-2">
                                                            <Label>Etiket *</Label>
                                                            <Input
                                                                value={link.label}
                                                                onChange={(e) => updateAboutLink(index, 'label', e.target.value)}
                                                                placeholder={activeLocale === 'tr' ? 'Neden Biz?' : 'Why Us?'}
                                                                className={!link.label || link.label.trim() === '' ? 'border-red-500' : ''}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>URL *</Label>
                                                            <Input
                                                                value={link.href}
                                                                onChange={(e) => updateAboutLink(index, 'href', e.target.value)}
                                                                placeholder={activeLocale === 'tr' ? '/neden-biz' : '/why-us'}
                                                                className={!link.href || link.href.trim() === '' ? 'border-red-500' : ''}
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Switch
                                                            checked={link.is_active}
                                                            onCheckedChange={(checked) => updateAboutLink(index, 'is_active', checked)}
                                                        />
                                                        <Label>Aktif</Label>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </CardContent>
                                </CollapsibleContent>
                            </Card>
                        </Collapsible>

                        {/* Treatments Menu */}
                        <Collapsible open={treatmentsOpen} onOpenChange={setTreatmentsOpen}>
                            <Card>
                                <CollapsibleTrigger asChild>
                                    <CardHeader className="cursor-pointer hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-2">
                                                <GripVertical className="w-5 h-5" />
                                                {activeLocale === 'tr' ? 'Tedaviler Menüsü' : 'Treatments Menu'} ({currentData.treatments.links.length} link)
                                            </CardTitle>
                                            <ChevronDown className={`w-5 h-5 transition-transform ${treatmentsOpen ? 'rotate-180' : ''}`} />
                                        </div>
                                    </CardHeader>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Menü Başlığı</Label>
                                            <Input
                                                value={currentData.treatments.label}
                                                onChange={(e) => updateField('treatments', { ...currentData.treatments, label: e.target.value })}
                                                placeholder={activeLocale === 'tr' ? 'Tedaviler' : 'Treatments'}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label>Linkler</Label>
                                            <Button type="button" size="sm" onClick={addTreatmentLink} variant="outline">
                                                <Plus className="w-4 h-4 mr-2" />
                                                Yeni Link
                                            </Button>
                                        </div>

                                        {currentData.treatments.links.map((link, index) => (
                                            <Card key={index} className="p-4 border-2">
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="font-semibold">Link {index + 1}</Label>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => moveTreatmentLink(index, 'up')}
                                                                disabled={index === 0}
                                                            >
                                                                <ChevronUp className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => moveTreatmentLink(index, 'down')}
                                                                disabled={index === currentData.treatments.links.length - 1}
                                                            >
                                                                <ChevronDown className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() => removeTreatmentLink(index)}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="space-y-2">
                                                            <Label>Etiket *</Label>
                                                            <Input
                                                                value={link.label}
                                                                onChange={(e) => updateTreatmentLink(index, 'label', e.target.value)}
                                                                placeholder={activeLocale === 'tr' ? 'Tüp Bebek (IVF)' : 'IVF Treatment'}
                                                                className={!link.label || link.label.trim() === '' ? 'border-red-500' : ''}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>URL *</Label>
                                                            <Input
                                                                value={link.href}
                                                                onChange={(e) => updateTreatmentLink(index, 'href', e.target.value)}
                                                                placeholder={activeLocale === 'tr' ? '/tedaviler/tup-bebek' : '/treatments/ivf'}
                                                                className={!link.href || link.href.trim() === '' ? 'border-red-500' : ''}
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Switch
                                                            checked={link.is_active}
                                                            onCheckedChange={(checked) => updateTreatmentLink(index, 'is_active', checked)}
                                                        />
                                                        <Label>Aktif</Label>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </CardContent>
                                </CollapsibleContent>
                            </Card>
                        </Collapsible>

                        {/* Main Menu Links */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>
                                        {activeLocale === 'tr' ? 'Ana Menü Linkleri' : 'Main Menu Links'} ({currentData.links.length} link)
                                    </CardTitle>
                                    <Button type="button" size="sm" onClick={addMainLink} variant="outline">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Yeni Link
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {currentData.links.map((link, index) => (
                                    <Card key={index} className="p-4 border-2">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Label className="font-semibold">Link {index + 1}</Label>
                                                <div className="flex gap-2">
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => moveMainLink(index, 'up')}
                                                        disabled={index === 0}
                                                    >
                                                        <ChevronUp className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => moveMainLink(index, 'down')}
                                                        disabled={index === currentData.links.length - 1}
                                                    >
                                                        <ChevronDown className="w-4 h-4" />
                                                    </Button>
                                                    <Button type="button" size="sm" variant="destructive" onClick={() => removeMainLink(index)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-2">
                                                    <Label>Etiket *</Label>
                                                    <Input
                                                        value={link.label}
                                                        onChange={(e) => updateMainLink(index, 'label', e.target.value)}
                                                        placeholder={activeLocale === 'tr' ? 'SSS' : 'FAQ'}
                                                        className={!link.label || link.label.trim() === '' ? 'border-red-500' : ''}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>URL *</Label>
                                                    <Input
                                                        value={link.href}
                                                        onChange={(e) => updateMainLink(index, 'href', e.target.value)}
                                                        placeholder={activeLocale === 'tr' ? '/sss' : '/faq'}
                                                        className={!link.href || link.href.trim() === '' ? 'border-red-500' : ''}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={link.is_active}
                                                    onCheckedChange={(checked) => updateMainLink(index, 'is_active', checked)}
                                                />
                                                <Label>Aktif</Label>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </CardContent>
                        </Card>

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
                                <span>🇹🇷 TR: {navbarData.tr.about.links.length + navbarData.tr.treatments.links.length + navbarData.tr.links.length} link</span>
                                <span>•</span>
                                <span>🇬🇧 EN: {navbarData.en.about.links.length + navbarData.en.treatments.links.length + navbarData.en.links.length} link</span>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <MediaPicker open={showMediaPicker} onOpenChange={setShowMediaPicker} onSelect={handleMediaSelect} />
        </div>
    );
}