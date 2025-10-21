// src/app/(admin)/admin/layout/navbar/page.tsx
'use client';

import { useState, useEffect } from 'react';
import axios from '@/src/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/src/components/ui/use-toast';
import { Loader2, Save, Plus, Trash2, Image as ImageIcon, Menu, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import MediaPicker from '@/src/components/MediaPicker';
import { Switch } from '@/components/ui/switch';
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

interface NavbarData {
    locale: string;
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

export default function NavbarEditorPage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [mediaPickerTarget, setMediaPickerTarget] = useState<string>('');

    const [navbarData, setNavbarData] = useState<NavbarData>({
        locale: 'tr',
        logo_url: '',
        logo_alt: '',
        logo_width: 125,
        logo_height: 65,
        phone_number: '',
        whatsapp_number: '',
        email: '',
        about: { label: 'about', links: [] },
        treatments: { label: 'treatments', links: [] },
        links: [],
    });

    const [aboutOpen, setAboutOpen] = useState(true);
    const [treatmentsOpen, setTreatmentsOpen] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/navbar?locale=tr');

            if (response.data.data) {
                const data = response.data.data;
                setNavbarData({
                    locale: 'tr',
                    logo_url: data.logo.url || '',
                    logo_alt: data.logo.alt || '',
                    logo_width: data.logo.width || 125,
                    logo_height: data.logo.height || 65,
                    phone_number: data.contact.phone_number || '',
                    whatsapp_number: data.contact.whatsapp_number || '',
                    email: data.contact.email || '',
                    about: data.about || { label: 'about', links: [] },
                    treatments: data.treatments || { label: 'treatments', links: [] },
                    links: data.links || [],
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

    // ✅ VALIDATION FONKSIYONU EKLEDIM
    const validateData = (): boolean => {
        // About links validation
        for (let i = 0; i < navbarData.about.links.length; i++) {
            const link = navbarData.about.links[i];
            if (!link.label || link.label.trim() === '') {
                toast({
                    title: 'Hata',
                    description: `Hakkımızda menüsünde ${i + 1}. linkin etiketi boş olamaz!`,
                    variant: 'destructive',
                });
                return false;
            }
            if (!link.href || link.href.trim() === '') {
                toast({
                    title: 'Hata',
                    description: `Hakkımızda menüsünde ${i + 1}. linkin URL'si boş olamaz!`,
                    variant: 'destructive',
                });
                return false;
            }
        }

        // Treatments links validation
        for (let i = 0; i < navbarData.treatments.links.length; i++) {
            const link = navbarData.treatments.links[i];
            if (!link.label || link.label.trim() === '') {
                toast({
                    title: 'Hata',
                    description: `Tedaviler menüsünde ${i + 1}. linkin etiketi boş olamaz!`,
                    variant: 'destructive',
                });
                return false;
            }
            if (!link.href || link.href.trim() === '') {
                toast({
                    title: 'Hata',
                    description: `Tedaviler menüsünde ${i + 1}. linkin URL'si boş olamaz!`,
                    variant: 'destructive',
                });
                return false;
            }
        }

        // Main links validation
        for (let i = 0; i < navbarData.links.length; i++) {
            const link = navbarData.links[i];
            if (!link.label || link.label.trim() === '') {
                toast({
                    title: 'Hata',
                    description: `Ana menüde ${i + 1}. linkin etiketi boş olamaz!`,
                    variant: 'destructive',
                });
                return false;
            }
            if (!link.href || link.href.trim() === '') {
                toast({
                    title: 'Hata',
                    description: `Ana menüde ${i + 1}. linkin URL'si boş olamaz!`,
                    variant: 'destructive',
                });
                return false;
            }
        }

        return true;
    };

    // ✅ SAVE FONKSIYONUNA VALIDATION EKLEDIM
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate before saving
        if (!validateData()) {
            return;
        }

        setSaving(true);
        try {
            // ✅ BOŞ LINKLERI FİLTRELE VE TRİM YAP
            const cleanedData = {
                ...navbarData,
                about: {
                    ...navbarData.about,
                    links: navbarData.about.links
                        .filter(link => link.label && link.label.trim() !== '' && link.href && link.href.trim() !== '')
                        .map(link => ({
                            ...link,
                            label: link.label.trim(),
                            href: link.href.trim()
                        }))
                },
                treatments: {
                    ...navbarData.treatments,
                    links: navbarData.treatments.links
                        .filter(link => link.label && link.label.trim() !== '' && link.href && link.href.trim() !== '')
                        .map(link => ({
                            ...link,
                            label: link.label.trim(),
                            href: link.href.trim()
                        }))
                },
                links: navbarData.links
                    .filter(link => link.label && link.label.trim() !== '' && link.href && link.href.trim() !== '')
                    .map(link => ({
                        ...link,
                        label: link.label.trim(),
                        href: link.href.trim()
                    }))
            };

            await axios.put('/navbar', cleanedData);
            toast({ title: 'Başarılı', description: 'Navbar başarıyla güncellendi' });

            // ✅ KAYIT SONRASI VERİYİ YENİDEN YÜKLE
            await fetchData();
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

    const handleMediaSelect = (url: string) => {
        if (mediaPickerTarget === 'logo') {
            setNavbarData({ ...navbarData, logo_url: url });
        }
        setShowMediaPicker(false);
        setMediaPickerTarget('');
    };

    const openMediaPicker = (target: string) => {
        setMediaPickerTarget(target);
        setShowMediaPicker(true);
    };

    // About Links Functions
    const addAboutLink = () => {
        setNavbarData({
            ...navbarData,
            about: {
                ...navbarData.about,
                links: [
                    ...navbarData.about.links,
                    { label: '', href: '', order: navbarData.about.links.length + 1, is_active: true },
                ],
            },
        });
    };

    const updateAboutLink = (index: number, field: keyof NavLink, value: any) => {
        const newLinks = [...navbarData.about.links];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setNavbarData({ ...navbarData, about: { ...navbarData.about, links: newLinks } });
    };

    const removeAboutLink = (index: number) => {
        const newLinks = navbarData.about.links.filter((_, i) => i !== index);
        setNavbarData({ ...navbarData, about: { ...navbarData.about, links: newLinks } });
    };

    const moveAboutLink = (index: number, direction: 'up' | 'down') => {
        const newLinks = [...navbarData.about.links];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= newLinks.length) return;
        [newLinks[index], newLinks[newIndex]] = [newLinks[newIndex], newLinks[index]];
        newLinks.forEach((link, i) => (link.order = i + 1));
        setNavbarData({ ...navbarData, about: { ...navbarData.about, links: newLinks } });
    };

    // Treatments Links Functions
    const addTreatmentLink = () => {
        setNavbarData({
            ...navbarData,
            treatments: {
                ...navbarData.treatments,
                links: [
                    ...navbarData.treatments.links,
                    { label: '', href: '', order: navbarData.treatments.links.length + 1, is_active: true },
                ],
            },
        });
    };

    const updateTreatmentLink = (index: number, field: keyof NavLink, value: any) => {
        const newLinks = [...navbarData.treatments.links];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setNavbarData({ ...navbarData, treatments: { ...navbarData.treatments, links: newLinks } });
    };

    const removeTreatmentLink = (index: number) => {
        const newLinks = navbarData.treatments.links.filter((_, i) => i !== index);
        setNavbarData({ ...navbarData, treatments: { ...navbarData.treatments, links: newLinks } });
    };

    const moveTreatmentLink = (index: number, direction: 'up' | 'down') => {
        const newLinks = [...navbarData.treatments.links];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= newLinks.length) return;
        [newLinks[index], newLinks[newIndex]] = [newLinks[newIndex], newLinks[index]];
        newLinks.forEach((link, i) => (link.order = i + 1));
        setNavbarData({ ...navbarData, treatments: { ...navbarData.treatments, links: newLinks } });
    };

    // Main Links Functions
    const addMainLink = () => {
        setNavbarData({
            ...navbarData,
            links: [
                ...navbarData.links,
                { label: '', href: '', order: navbarData.links.length + 1, is_active: true },
            ],
        });
    };

    const updateMainLink = (index: number, field: keyof NavLink, value: any) => {
        const newLinks = [...navbarData.links];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setNavbarData({ ...navbarData, links: newLinks });
    };

    const removeMainLink = (index: number) => {
        const newLinks = navbarData.links.filter((_, i) => i !== index);
        setNavbarData({ ...navbarData, links: newLinks });
    };

    const moveMainLink = (index: number, direction: 'up' | 'down') => {
        const newLinks = [...navbarData.links];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= newLinks.length) return;
        [newLinks[index], newLinks[newIndex]] = [newLinks[newIndex], newLinks[index]];
        newLinks.forEach((link, i) => (link.order = i + 1));
        setNavbarData({ ...navbarData, links: newLinks });
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
                    Navbar
                </h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Navbar Ayarları</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-6">
                        {/* Logo Section */}
                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold text-lg">Logo Ayarları</h3>

                            <div className="space-y-2">
                                <Label>Logo URL</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={navbarData.logo_url}
                                        onChange={(e) => setNavbarData({ ...navbarData, logo_url: e.target.value })}
                                        placeholder="https://..."
                                    />
                                    <Button type="button" variant="outline" onClick={() => openMediaPicker('logo')}>
                                        <ImageIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                                {navbarData.logo_url && (
                                    <div className="mt-2">
                                        <img src={navbarData.logo_url} alt="Logo Preview" className="h-16 object-contain" />
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Logo Alt Text</Label>
                                    <Input
                                        value={navbarData.logo_alt}
                                        onChange={(e) => setNavbarData({ ...navbarData, logo_alt: e.target.value })}
                                        placeholder="Ayda IVF Logo"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Genişlik (px)</Label>
                                    <Input
                                        type="number"
                                        value={navbarData.logo_width}
                                        onChange={(e) => setNavbarData({ ...navbarData, logo_width: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Yükseklik (px)</Label>
                                    <Input
                                        type="number"
                                        value={navbarData.logo_height}
                                        onChange={(e) => setNavbarData({ ...navbarData, logo_height: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Section */}
                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold text-lg">İletişim Bilgileri</h3>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Telefon Numarası</Label>
                                    <Input
                                        value={navbarData.phone_number}
                                        onChange={(e) => setNavbarData({ ...navbarData, phone_number: e.target.value })}
                                        placeholder="+90 533 123 4567"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>WhatsApp Numarası</Label>
                                    <Input
                                        value={navbarData.whatsapp_number}
                                        onChange={(e) => setNavbarData({ ...navbarData, whatsapp_number: e.target.value })}
                                        placeholder="+90 533 123 4567"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>E-posta</Label>
                                    <Input
                                        type="email"
                                        value={navbarData.email}
                                        onChange={(e) => setNavbarData({ ...navbarData, email: e.target.value })}
                                        placeholder="info@aydaivf.com"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* About Dropdown */}
                        <Collapsible open={aboutOpen} onOpenChange={setAboutOpen}>
                            <Card>
                                <CollapsibleTrigger asChild>
                                    <CardHeader className="cursor-pointer hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-2">
                                                <GripVertical className="w-5 h-5" />
                                                Hakkımızda Menüsü ({navbarData.about.links.length} link)
                                            </CardTitle>
                                            <ChevronDown className={`w-5 h-5 transition-transform ${aboutOpen ? 'rotate-180' : ''}`} />
                                        </div>
                                    </CardHeader>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Menü Başlığı (Translation Key)</Label>
                                            <Input
                                                value={navbarData.about.label}
                                                onChange={(e) =>
                                                    setNavbarData({ ...navbarData, about: { ...navbarData.about, label: e.target.value } })
                                                }
                                                placeholder="about"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label>Linkler</Label>
                                            <Button type="button" size="sm" onClick={addAboutLink} variant="outline">
                                                <Plus className="w-4 h-4 mr-2" />
                                                Yeni Link Ekle
                                            </Button>
                                        </div>

                                        {navbarData.about.links.map((link, index) => (
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
                                                                disabled={index === navbarData.about.links.length - 1}
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
                                                            <Label>Label (Translation Key) *</Label>
                                                            <Input
                                                                value={link.label}
                                                                onChange={(e) => updateAboutLink(index, 'label', e.target.value)}
                                                                placeholder="whyUs"
                                                                className={!link.label || link.label.trim() === '' ? 'border-red-500' : ''}
                                                                required
                                                            />
                                                            {!link.label || link.label.trim() === '' ? (
                                                                <span className="text-red-500 text-xs">Bu alan zorunludur</span>
                                                            ) : null}
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>URL *</Label>
                                                            <Input
                                                                value={link.href}
                                                                onChange={(e) => updateAboutLink(index, 'href', e.target.value)}
                                                                placeholder="/why-us"
                                                                className={!link.href || link.href.trim() === '' ? 'border-red-500' : ''}
                                                                required
                                                            />
                                                            {!link.href || link.href.trim() === '' ? (
                                                                <span className="text-red-500 text-xs">Bu alan zorunludur</span>
                                                            ) : null}
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

                        {/* Treatments Dropdown */}
                        <Collapsible open={treatmentsOpen} onOpenChange={setTreatmentsOpen}>
                            <Card>
                                <CollapsibleTrigger asChild>
                                    <CardHeader className="cursor-pointer hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-2">
                                                <GripVertical className="w-5 h-5" />
                                                Tedaviler Menüsü ({navbarData.treatments.links.length} link)
                                            </CardTitle>
                                            <ChevronDown className={`w-5 h-5 transition-transform ${treatmentsOpen ? 'rotate-180' : ''}`} />
                                        </div>
                                    </CardHeader>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Menü Başlığı (Translation Key)</Label>
                                            <Input
                                                value={navbarData.treatments.label}
                                                onChange={(e) =>
                                                    setNavbarData({
                                                        ...navbarData,
                                                        treatments: { ...navbarData.treatments, label: e.target.value },
                                                    })
                                                }
                                                placeholder="treatments"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label>Linkler</Label>
                                            <Button type="button" size="sm" onClick={addTreatmentLink} variant="outline">
                                                <Plus className="w-4 h-4 mr-2" />
                                                Yeni Link Ekle
                                            </Button>
                                        </div>

                                        {navbarData.treatments.links.map((link, index) => (
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
                                                                disabled={index === navbarData.treatments.links.length - 1}
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
                                                            <Label>Label (Translation Key) *</Label>
                                                            <Input
                                                                value={link.label}
                                                                onChange={(e) => updateTreatmentLink(index, 'label', e.target.value)}
                                                                placeholder="ivfIcsi"
                                                                className={!link.label || link.label.trim() === '' ? 'border-red-500' : ''}
                                                                required
                                                            />
                                                            {!link.label || link.label.trim() === '' ? (
                                                                <span className="text-red-500 text-xs">Bu alan zorunludur</span>
                                                            ) : null}
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>URL *</Label>
                                                            <Input
                                                                value={link.href}
                                                                onChange={(e) => updateTreatmentLink(index, 'href', e.target.value)}
                                                                placeholder="/ivf-icsi"
                                                                className={!link.href || link.href.trim() === '' ? 'border-red-500' : ''}
                                                                required
                                                            />
                                                            {!link.href || link.href.trim() === '' ? (
                                                                <span className="text-red-500 text-xs">Bu alan zorunludur</span>
                                                            ) : null}
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

                        {/* Main Links */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Ana Menü Linkleri ({navbarData.links.length} link)</CardTitle>
                                    <Button type="button" size="sm" onClick={addMainLink} variant="outline">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Yeni Link Ekle
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {navbarData.links.map((link, index) => (
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
                                                        disabled={index === navbarData.links.length - 1}
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
                                                    <Label>Label (Translation Key) *</Label>
                                                    <Input
                                                        value={link.label}
                                                        onChange={(e) => updateMainLink(index, 'label', e.target.value)}
                                                        placeholder="faq"
                                                        className={!link.label || link.label.trim() === '' ? 'border-red-500' : ''}
                                                        required
                                                    />
                                                    {!link.label || link.label.trim() === '' ? (
                                                        <span className="text-red-500 text-xs">Bu alan zorunludur</span>
                                                    ) : null}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>URL *</Label>
                                                    <Input
                                                        value={link.href}
                                                        onChange={(e) => updateMainLink(index, 'href', e.target.value)}
                                                        placeholder="/faq"
                                                        className={!link.href || link.href.trim() === '' ? 'border-red-500' : ''}
                                                        required
                                                    />
                                                    {!link.href || link.href.trim() === '' ? (
                                                        <span className="text-red-500 text-xs">Bu alan zorunludur</span>
                                                    ) : null}
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

                        {/* Save Button */}
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

            {/* Media Picker */}
            <MediaPicker open={showMediaPicker} onOpenChange={setShowMediaPicker} onSelect={handleMediaSelect} />
        </div>
    )};