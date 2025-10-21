// src/app/(admin)/admin/layout/footer/page.tsx
'use client';

import { useState, useEffect } from 'react';
import axios from '@/src/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/src/components/ui/use-toast';
import { Loader2, Save, Plus, Trash2, Image as ImageIcon, ChevronUp, ChevronDown } from 'lucide-react';
import MediaPicker from '@/src/components/MediaPicker';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface SocialLink {
    id?: number;
    platform: string;
    url: string;
    order: number;
    is_active: boolean;
}

interface QuickLink {
    id?: number;
    label: string;
    href: string;
    order: number;
    is_active: boolean;
}

interface FooterData {
    locale: string;
    address_icon: string;
    address_iso_logo: string;
    address_text: string;
    contact_icon: string;
    contact_phone: string;
    contact_phone_link: string;
    contact_email: string;
    contact_email_link: string;
    quick_access_icon: string;
    copyright_logo: string;
    copyright_text: string;
    social_links: SocialLink[];
    quick_links: QuickLink[];
}

const SOCIAL_PLATFORMS = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'linkedin', label: 'LinkedIn' },
];

export default function FooterEditorPage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [mediaPickerTarget, setMediaPickerTarget] = useState<string>('');

    const [footerData, setFooterData] = useState<FooterData>({
        locale: 'tr',
        address_icon: '',
        address_iso_logo: '',
        address_text: '',
        contact_icon: '',
        contact_phone: '',
        contact_phone_link: '',
        contact_email: '',
        contact_email_link: '',
        quick_access_icon: '',
        copyright_logo: '',
        copyright_text: '',
        social_links: [],
        quick_links: [],
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/footer?locale=tr');

            if (response.data.data) {
                const data = response.data.data;
                setFooterData({
                    locale: 'tr',
                    address_icon: data.address.icon || '',
                    address_iso_logo: data.address.iso_logo || '',
                    address_text: data.address.text || '',
                    contact_icon: data.contact.icon || '',
                    contact_phone: data.contact.phone || '',
                    contact_phone_link: data.contact.phone_link || '',
                    contact_email: data.contact.email || '',
                    contact_email_link: data.contact.email_link || '',
                    quick_access_icon: data.quick_access.icon || '',
                    copyright_logo: data.copyright_logo || '',
                    copyright_text: data.copyright_text || '',
                    social_links: data.contact.social_links || [],
                    quick_links: data.quick_access.links || [],
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

        // ✅ BOŞ LİNKLERİ FİLTRELE
        const cleanedData = {
            ...footerData,
            social_links: footerData.social_links
                .filter(link => link.platform && link.url && link.url.trim() !== '')
                .map((link, index) => ({
                    ...link,
                    url: link.url.trim(),
                    order: index + 1
                })),
            quick_links: footerData.quick_links
                .filter(link => link.label && link.label.trim() !== '' && link.href && link.href.trim() !== '')
                .map((link, index) => ({
                    ...link,
                    label: link.label.trim(),
                    href: link.href.trim(),
                    order: index + 1
                }))
        };

        setSaving(true);
        try {
            await axios.put('/footer', cleanedData);
            toast({ title: 'Başarılı', description: 'Footer başarıyla güncellendi' });

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
        if (mediaPickerTarget === 'address_icon') {
            setFooterData({ ...footerData, address_icon: url });
        } else if (mediaPickerTarget === 'address_iso_logo') {
            setFooterData({ ...footerData, address_iso_logo: url });
        } else if (mediaPickerTarget === 'contact_icon') {
            setFooterData({ ...footerData, contact_icon: url });
        } else if (mediaPickerTarget === 'quick_access_icon') {
            setFooterData({ ...footerData, quick_access_icon: url });
        } else if (mediaPickerTarget === 'copyright_logo') {
            setFooterData({ ...footerData, copyright_logo: url });
        }
        setShowMediaPicker(false);
        setMediaPickerTarget('');
    };

    const openMediaPicker = (target: string) => {
        setMediaPickerTarget(target);
        setShowMediaPicker(true);
    };

    // Social Links Functions
    const addSocialLink = () => {
        setFooterData({
            ...footerData,
            social_links: [
                ...footerData.social_links,
                { platform: 'facebook', url: '', order: footerData.social_links.length + 1, is_active: true },
            ],
        });
    };

    const updateSocialLink = (index: number, field: keyof SocialLink, value: any) => {
        const newLinks = [...footerData.social_links];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setFooterData({ ...footerData, social_links: newLinks });
    };

    const removeSocialLink = (index: number) => {
        const newLinks = footerData.social_links.filter((_, i) => i !== index);
        setFooterData({ ...footerData, social_links: newLinks });
    };

    const moveSocialLink = (index: number, direction: 'up' | 'down') => {
        const newLinks = [...footerData.social_links];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= newLinks.length) return;
        [newLinks[index], newLinks[newIndex]] = [newLinks[newIndex], newLinks[index]];
        newLinks.forEach((link, i) => (link.order = i + 1));
        setFooterData({ ...footerData, social_links: newLinks });
    };

    // Quick Links Functions
    const addQuickLink = () => {
        setFooterData({
            ...footerData,
            quick_links: [
                ...footerData.quick_links,
                { label: '', href: '', order: footerData.quick_links.length + 1, is_active: true },
            ],
        });
    };

    const updateQuickLink = (index: number, field: keyof QuickLink, value: any) => {
        const newLinks = [...footerData.quick_links];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setFooterData({ ...footerData, quick_links: newLinks });
    };

    const removeQuickLink = (index: number) => {
        const newLinks = footerData.quick_links.filter((_, i) => i !== index);
        setFooterData({ ...footerData, quick_links: newLinks });
    };

    const moveQuickLink = (index: number, direction: 'up' | 'down') => {
        const newLinks = [...footerData.quick_links];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= newLinks.length) return;
        [newLinks[index], newLinks[newIndex]] = [newLinks[newIndex], newLinks[index]];
        newLinks.forEach((link, i) => (link.order = i + 1));
        setFooterData({ ...footerData, quick_links: newLinks });
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
                <h1 className="text-3xl font-bold text-primary-pink">Footer</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Footer Ayarları</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-6">
                        {/* Address Section */}
                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold text-lg">Adres Bölümü</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Adres İkonu URL</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={footerData.address_icon}
                                            onChange={(e) => setFooterData({ ...footerData, address_icon: e.target.value })}
                                            placeholder="https://..."
                                        />
                                        <Button type="button" variant="outline" onClick={() => openMediaPicker('address_icon')}>
                                            <ImageIcon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    {footerData.address_icon && (
                                        <img src={footerData.address_icon} alt="Address Icon" className="h-10 object-contain" />
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>ISO Logo URL</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={footerData.address_iso_logo}
                                            onChange={(e) => setFooterData({ ...footerData, address_iso_logo: e.target.value })}
                                            placeholder="https://..."
                                        />
                                        <Button type="button" variant="outline" onClick={() => openMediaPicker('address_iso_logo')}>
                                            <ImageIcon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    {footerData.address_iso_logo && (
                                        <img src={footerData.address_iso_logo} alt="ISO Logo" className="h-16 object-contain" />
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Adres Metni</Label>
                                <Textarea
                                    value={footerData.address_text}
                                    onChange={(e) => setFooterData({ ...footerData, address_text: e.target.value })}
                                    placeholder="Adres bilgisi..."
                                    rows={3}
                                />
                            </div>
                        </div>

                        {/* Contact Section */}
                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold text-lg">İletişim Bölümü</h3>

                            <div className="space-y-2">
                                <Label>İletişim İkonu URL</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={footerData.contact_icon}
                                        onChange={(e) => setFooterData({ ...footerData, contact_icon: e.target.value })}
                                        placeholder="https://..."
                                    />
                                    <Button type="button" variant="outline" onClick={() => openMediaPicker('contact_icon')}>
                                        <ImageIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                                {footerData.contact_icon && (
                                    <img src={footerData.contact_icon} alt="Contact Icon" className="h-10 object-contain" />
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Telefon</Label>
                                    <Input
                                        value={footerData.contact_phone}
                                        onChange={(e) => setFooterData({ ...footerData, contact_phone: e.target.value })}
                                        placeholder="+90 533 123 4567"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Telefon Link</Label>
                                    <Input
                                        value={footerData.contact_phone_link}
                                        onChange={(e) => setFooterData({ ...footerData, contact_phone_link: e.target.value })}
                                        placeholder="tel:+905331234567"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>E-posta</Label>
                                    <Input
                                        type="email"
                                        value={footerData.contact_email}
                                        onChange={(e) => setFooterData({ ...footerData, contact_email: e.target.value })}
                                        placeholder="info@aydaivf.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>E-posta Link</Label>
                                    <Input
                                        value={footerData.contact_email_link}
                                        onChange={(e) => setFooterData({ ...footerData, contact_email_link: e.target.value })}
                                        placeholder="mailto:info@aydaivf.com"
                                    />
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="space-y-3 mt-6">
                                <div className="flex items-center justify-between">
                                    <Label className="text-base font-semibold">Sosyal Medya Linkleri</Label>
                                    <Button type="button" size="sm" onClick={addSocialLink} variant="outline">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Yeni Ekle
                                    </Button>
                                </div>

                                {footerData.social_links.map((link, index) => (
                                    <Card key={index} className="p-4 border-2">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Label className="font-semibold">Sosyal Medya {index + 1}</Label>
                                                <div className="flex gap-2">
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => moveSocialLink(index, 'up')}
                                                        disabled={index === 0}
                                                    >
                                                        <ChevronUp className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => moveSocialLink(index, 'down')}
                                                        disabled={index === footerData.social_links.length - 1}
                                                    >
                                                        <ChevronDown className="w-4 h-4" />
                                                    </Button>
                                                    <Button type="button" size="sm" variant="destructive" onClick={() => removeSocialLink(index)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-2">
                                                    <Label>Platform</Label>
                                                    <Select
                                                        value={link.platform}
                                                        onValueChange={(value) => updateSocialLink(index, 'platform', value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Platform seçin" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {SOCIAL_PLATFORMS.map((platform) => (
                                                                <SelectItem key={platform.value} value={platform.value}>
                                                                    {platform.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>URL *</Label>
                                                    <Input
                                                        value={link.url}
                                                        onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                                                        placeholder="https://facebook.com/..."
                                                        className={!link.url || link.url.trim() === '' ? 'border-red-500' : ''}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={link.is_active}
                                                    onCheckedChange={(checked) => updateSocialLink(index, 'is_active', checked)}
                                                />
                                                <Label>Aktif</Label>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Quick Access Section */}
                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold text-lg">Hızlı Erişim Bölümü</h3>

                            <div className="space-y-2">
                                <Label>Hızlı Erişim İkonu URL</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={footerData.quick_access_icon}
                                        onChange={(e) => setFooterData({ ...footerData, quick_access_icon: e.target.value })}
                                        placeholder="https://..."
                                    />
                                    <Button type="button" variant="outline" onClick={() => openMediaPicker('quick_access_icon')}>
                                        <ImageIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                                {footerData.quick_access_icon && (
                                    <img src={footerData.quick_access_icon} alt="Quick Access Icon" className="h-10 object-contain" />
                                )}
                            </div>

                            <div className="space-y-3 mt-6">
                                <div className="flex items-center justify-between">
                                    <Label className="text-base font-semibold">Hızlı Erişim Linkleri</Label>
                                    <Button type="button" size="sm" onClick={addQuickLink} variant="outline">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Yeni Link Ekle
                                    </Button>
                                </div>

                                {footerData.quick_links.map((link, index) => (
                                    <Card key={index} className="p-4 border-2">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Label className="font-semibold">Link {index + 1}</Label>
                                                <div className="flex gap-2">
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => moveQuickLink(index, 'up')}
                                                        disabled={index === 0}
                                                    >
                                                        <ChevronUp className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => moveQuickLink(index, 'down')}
                                                        disabled={index === footerData.quick_links.length - 1}
                                                    >
                                                        <ChevronDown className="w-4 h-4" />
                                                    </Button>
                                                    <Button type="button" size="sm" variant="destructive" onClick={() => removeQuickLink(index)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-2">
                                                    <Label>Label (Translation Key) *</Label>
                                                    <Input
                                                        value={link.label}
                                                        onChange={(e) => updateQuickLink(index, 'label', e.target.value)}
                                                        placeholder="home"
                                                        className={!link.label || link.label.trim() === '' ? 'border-red-500' : ''}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>URL *</Label>
                                                    <Input
                                                        value={link.href}
                                                        onChange={(e) => updateQuickLink(index, 'href', e.target.value)}
                                                        placeholder="/"
                                                        className={!link.href || link.href.trim() === '' ? 'border-red-500' : ''}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={link.is_active}
                                                    onCheckedChange={(checked) => updateQuickLink(index, 'is_active', checked)}
                                                />
                                                <Label>Aktif</Label>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Copyright Section */}
                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold text-lg">Copyright Bölümü</h3>

                            <div className="space-y-2">
                                <Label>Copyright Logo URL</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={footerData.copyright_logo}
                                        onChange={(e) => setFooterData({ ...footerData, copyright_logo: e.target.value })}
                                        placeholder="https://..."
                                    />
                                    <Button type="button" variant="outline" onClick={() => openMediaPicker('copyright_logo')}>
                                        <ImageIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                                {footerData.copyright_logo && (
                                    <img src={footerData.copyright_logo} alt="Copyright Logo" className="h-6 object-contain bg-gray-800 p-2" />
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Copyright Metni</Label>
                                <Input
                                    value={footerData.copyright_text}
                                    onChange={(e) => setFooterData({ ...footerData, copyright_text: e.target.value })}
                                    placeholder="© 2024 Ayda IVF. Tüm hakları saklıdır."
                                />
                            </div>
                        </div>

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
    );
}