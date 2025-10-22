'use client';

import { useState, useEffect } from 'react';
import axios from '@/src/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/src/components/ui/use-toast';
import { Loader2, Save, Plus, Trash2, Image as ImageIcon, ChevronUp, ChevronDown, Languages } from 'lucide-react';
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

interface FooterLocaleData {
    address_icon: string;
    address_iso_logo: string;
    address_text: string;
    address_title: string;
    contact_icon: string;
    contact_title: string;
    contact_phone: string;
    contact_phone_link: string;
    contact_email: string;
    contact_email_link: string;
    quick_access_icon: string;
    quick_access_title: string;
    copyright_logo: string;
    copyright_text: string;
    social_links: SocialLink[];
    quick_links: QuickLink[];
}

interface FooterData {
    tr: FooterLocaleData;
    en: FooterLocaleData;
}

const DEFAULT_LOCALE_DATA: FooterLocaleData = {
    address_icon: '',
    address_iso_logo: '',
    address_text: '',
    address_title: '',
    contact_icon: '',
    contact_title: '',
    contact_phone: '',
    contact_phone_link: '',
    contact_email: '',
    contact_email_link: '',
    quick_access_icon: '',
    quick_access_title: '',
    copyright_logo: '',
    copyright_text: '',
    social_links: [],
    quick_links: [],
};

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
    const [activeLocale, setActiveLocale] = useState<'tr' | 'en'>('tr');
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [mediaPickerTarget, setMediaPickerTarget] = useState<string>('');

    const [footerData, setFooterData] = useState<FooterData>({
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
                axios.get('/footer?locale=tr'),
                axios.get('/footer?locale=en'),
            ]);

            const processData = (data: any): FooterLocaleData => ({
                address_icon: data.address?.icon || '',
                address_iso_logo: data.address?.iso_logo || '',
                address_text: data.address?.text || '',
                address_title: data.address?.title || '',
                contact_icon: data.contact?.icon || '',
                contact_title: data.contact?.title || '',
                contact_phone: data.contact?.phone || '',
                contact_phone_link: data.contact?.phone_link || '',
                contact_email: data.contact?.email || '',
                contact_email_link: data.contact?.email_link || '',
                quick_access_icon: data.quick_access?.icon || '',
                quick_access_title: data.quick_access?.title || '',
                copyright_logo: data.copyright_logo || '',
                copyright_text: data.copyright_text || '',
                social_links: data.contact?.social_links || [],
                quick_links: data.quick_access?.links || [],
            });

            setFooterData({
                tr: trResponse.data.data ? processData(trResponse.data.data) : { ...DEFAULT_LOCALE_DATA },
                en: enResponse.data.data ? processData(enResponse.data.data) : { ...DEFAULT_LOCALE_DATA },
            });

            toast({
                title: '✅ Başarılı',
                description: 'Footer verileri yüklendi',
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
                axios.put('/footer', { ...footerData.tr, locale: 'tr' }),
                axios.put('/footer', { ...footerData.en, locale: 'en' }),
            ]);

            toast({
                title: '✅ Başarılı',
                description: 'Footer ayarları her iki dil için kaydedildi',
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
        const currentData = footerData[activeLocale];

        if (mediaPickerTarget === 'address_icon') {
            setFooterData({ ...footerData, [activeLocale]: { ...currentData, address_icon: url } });
        } else if (mediaPickerTarget === 'address_iso_logo') {
            setFooterData({ ...footerData, [activeLocale]: { ...currentData, address_iso_logo: url } });
        } else if (mediaPickerTarget === 'contact_icon') {
            setFooterData({ ...footerData, [activeLocale]: { ...currentData, contact_icon: url } });
        } else if (mediaPickerTarget === 'quick_access_icon') {
            setFooterData({ ...footerData, [activeLocale]: { ...currentData, quick_access_icon: url } });
        } else if (mediaPickerTarget === 'copyright_logo') {
            setFooterData({ ...footerData, [activeLocale]: { ...currentData, copyright_logo: url } });
        }

        setShowMediaPicker(false);
        setMediaPickerTarget('');
    };

    const openMediaPicker = (target: string) => {
        setMediaPickerTarget(target);
        setShowMediaPicker(true);
    };

    const updateField = (field: keyof FooterLocaleData, value: any) => {
        setFooterData({
            ...footerData,
            [activeLocale]: { ...footerData[activeLocale], [field]: value },
        });
    };

    // Social Links Functions
    const addSocialLink = () => {
        const currentData = footerData[activeLocale];
        updateField('social_links', [
            ...currentData.social_links,
            { platform: 'facebook', url: '', order: currentData.social_links.length + 1, is_active: true },
        ]);
    };

    const updateSocialLink = (index: number, field: keyof SocialLink, value: any) => {
        const currentData = footerData[activeLocale];
        const newLinks = [...currentData.social_links];
        newLinks[index] = { ...newLinks[index], [field]: value };
        updateField('social_links', newLinks);
    };

    const removeSocialLink = (index: number) => {
        const currentData = footerData[activeLocale];
        const newLinks = currentData.social_links.filter((_, i) => i !== index);
        updateField('social_links', newLinks);
    };

    const moveSocialLink = (index: number, direction: 'up' | 'down') => {
        const currentData = footerData[activeLocale];
        const newLinks = [...currentData.social_links];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= newLinks.length) return;
        [newLinks[index], newLinks[newIndex]] = [newLinks[newIndex], newLinks[index]];
        newLinks.forEach((link, i) => (link.order = i + 1));
        updateField('social_links', newLinks);
    };

    // Quick Links Functions
    const addQuickLink = () => {
        const currentData = footerData[activeLocale];
        updateField('quick_links', [
            ...currentData.quick_links,
            { label: '', href: '', order: currentData.quick_links.length + 1, is_active: true },
        ]);
    };

    const updateQuickLink = (index: number, field: keyof QuickLink, value: any) => {
        const currentData = footerData[activeLocale];
        const newLinks = [...currentData.quick_links];
        newLinks[index] = { ...newLinks[index], [field]: value };
        updateField('quick_links', newLinks);
    };

    const removeQuickLink = (index: number) => {
        const currentData = footerData[activeLocale];
        const newLinks = currentData.quick_links.filter((_, i) => i !== index);
        updateField('quick_links', newLinks);
    };

    const moveQuickLink = (index: number, direction: 'up' | 'down') => {
        const currentData = footerData[activeLocale];
        const newLinks = [...currentData.quick_links];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= newLinks.length) return;
        [newLinks[index], newLinks[newIndex]] = [newLinks[newIndex], newLinks[index]];
        newLinks.forEach((link, i) => (link.order = i + 1));
        updateField('quick_links', newLinks);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-12 w-12 animate-spin text-primary-pink" />
            </div>
        );
    }

    const currentData = footerData[activeLocale];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-primary-pink flex items-center gap-2">
                    Footer
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
                        {/* Address Section */}
                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold text-lg">
                                {activeLocale === 'tr' ? 'Adres Bölümü' : 'Address Section'}
                            </h3>

                            <div className="space-y-2">
                                <Label>{activeLocale === 'tr' ? 'Bölüm Başlığı' : 'Section Title'}</Label>
                                <Input
                                    value={currentData.address_title}
                                    onChange={(e) => updateField('address_title', e.target.value)}
                                    placeholder={activeLocale === 'tr' ? 'Adres' : 'Address'}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>İkon URL</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={currentData.address_icon}
                                            onChange={(e) => updateField('address_icon', e.target.value)}
                                            placeholder="https://..."
                                        />
                                        <Button type="button" variant="outline" onClick={() => openMediaPicker('address_icon')}>
                                            <ImageIcon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    {currentData.address_icon && (
                                        <img src={currentData.address_icon} alt="Address Icon" className="h-10 object-contain" />
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>ISO Logo</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={currentData.address_iso_logo}
                                            onChange={(e) => updateField('address_iso_logo', e.target.value)}
                                            placeholder="https://..."
                                        />
                                        <Button type="button" variant="outline" onClick={() => openMediaPicker('address_iso_logo')}>
                                            <ImageIcon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    {currentData.address_iso_logo && (
                                        <img src={currentData.address_iso_logo} alt="ISO Logo" className="h-16 object-contain" />
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>{activeLocale === 'tr' ? 'Adres Metni' : 'Address Text'}</Label>
                                <Textarea
                                    value={currentData.address_text}
                                    onChange={(e) => updateField('address_text', e.target.value)}
                                    placeholder={activeLocale === 'tr' ? 'Mersin Marina, Türkiye' : 'Mersin Marina, Turkey'}
                                    rows={3}
                                />
                            </div>
                        </div>

                        {/* Contact Section */}
                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold text-lg">
                                {activeLocale === 'tr' ? 'İletişim Bölümü' : 'Contact Section'}
                            </h3>

                            <div className="space-y-2">
                                <Label>{activeLocale === 'tr' ? 'Bölüm Başlığı' : 'Section Title'}</Label>
                                <Input
                                    value={currentData.contact_title}
                                    onChange={(e) => updateField('contact_title', e.target.value)}
                                    placeholder={activeLocale === 'tr' ? 'İletişim' : 'Contact'}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>İkon URL</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={currentData.contact_icon}
                                        onChange={(e) => updateField('contact_icon', e.target.value)}
                                        placeholder="https://..."
                                    />
                                    <Button type="button" variant="outline" onClick={() => openMediaPicker('contact_icon')}>
                                        <ImageIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                                {currentData.contact_icon && (
                                    <img src={currentData.contact_icon} alt="Contact Icon" className="h-10 object-contain" />
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Telefon</Label>
                                    <Input
                                        value={currentData.contact_phone}
                                        onChange={(e) => updateField('contact_phone', e.target.value)}
                                        placeholder="+90 533 123 4567"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Telefon Link</Label>
                                    <Input
                                        value={currentData.contact_phone_link}
                                        onChange={(e) => updateField('contact_phone_link', e.target.value)}
                                        placeholder="tel:+905331234567"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>E-posta</Label>
                                    <Input
                                        type="email"
                                        value={currentData.contact_email}
                                        onChange={(e) => updateField('contact_email', e.target.value)}
                                        placeholder="info@aydaivf.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>E-posta Link</Label>
                                    <Input
                                        value={currentData.contact_email_link}
                                        onChange={(e) => updateField('contact_email_link', e.target.value)}
                                        placeholder="mailto:info@aydaivf.com"
                                    />
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="space-y-3 mt-6">
                                <div className="flex items-center justify-between">
                                    <Label className="text-base font-semibold">Sosyal Medya</Label>
                                    <Button type="button" size="sm" onClick={addSocialLink} variant="outline">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Yeni Ekle
                                    </Button>
                                </div>

                                {currentData.social_links.map((link, index) => (
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
                                                        disabled={index === currentData.social_links.length - 1}
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
                                                            <SelectValue placeholder="Seçin" />
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
                            <h3 className="font-semibold text-lg">
                                {activeLocale === 'tr' ? 'Hızlı Erişim Bölümü' : 'Quick Access Section'}
                            </h3>

                            <div className="space-y-2">
                                <Label>{activeLocale === 'tr' ? 'Bölüm Başlığı' : 'Section Title'}</Label>
                                <Input
                                    value={currentData.quick_access_title}
                                    onChange={(e) => updateField('quick_access_title', e.target.value)}
                                    placeholder={activeLocale === 'tr' ? 'Hızlı Erişim' : 'Quick Access'}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>İkon URL</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={currentData.quick_access_icon}
                                        onChange={(e) => updateField('quick_access_icon', e.target.value)}
                                        placeholder="https://..."
                                    />
                                    <Button type="button" variant="outline" onClick={() => openMediaPicker('quick_access_icon')}>
                                        <ImageIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                                {currentData.quick_access_icon && (
                                    <img src={currentData.quick_access_icon} alt="Quick Access Icon" className="h-10 object-contain" />
                                )}
                            </div>

                            {/* Quick Links */}
                            <div className="space-y-3 mt-6">
                                <div className="flex items-center justify-between">
                                    <Label className="text-base font-semibold">Linkler</Label>
                                    <Button type="button" size="sm" onClick={addQuickLink} variant="outline">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Yeni Link
                                    </Button>
                                </div>

                                {currentData.quick_links.map((link, index) => (
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
                                                        disabled={index === currentData.quick_links.length - 1}
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
                                                    <Label>Etiket *</Label>
                                                    <Input
                                                        value={link.label}
                                                        onChange={(e) => updateQuickLink(index, 'label', e.target.value)}
                                                        placeholder={activeLocale === 'tr' ? 'Ana Sayfa' : 'Home'}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>URL *</Label>
                                                    <Input
                                                        value={link.href}
                                                        onChange={(e) => updateQuickLink(index, 'href', e.target.value)}
                                                        placeholder="/"
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
                            <h3 className="font-semibold text-lg">
                                {activeLocale === 'tr' ? 'Telif Hakkı Bölümü' : 'Copyright Section'}
                            </h3>

                            <div className="space-y-2">
                                <Label>Logo</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={currentData.copyright_logo}
                                        onChange={(e) => updateField('copyright_logo', e.target.value)}
                                        placeholder="https://..."
                                    />
                                    <Button type="button" variant="outline" onClick={() => openMediaPicker('copyright_logo')}>
                                        <ImageIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                                {currentData.copyright_logo && (
                                    <img src={currentData.copyright_logo} alt="Copyright Logo" className="h-6 object-contain bg-gray-800 p-2" />
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>{activeLocale === 'tr' ? 'Telif Hakkı Metni' : 'Copyright Text'}</Label>
                                <Input
                                    value={currentData.copyright_text}
                                    onChange={(e) => updateField('copyright_text', e.target.value)}
                                    placeholder={activeLocale === 'tr' ? '© 2024 Ayda IVF - Tüm Hakları Saklıdır' : '© 2024 Ayda IVF - All Rights Reserved'}
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
                                <span>🇹🇷 TR: {footerData.tr.social_links.length} sosyal, {footerData.tr.quick_links.length} link</span>
                                <span>•</span>
                                <span>🇬🇧 EN: {footerData.en.social_links.length} sosyal, {footerData.en.quick_links.length} link</span>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <MediaPicker open={showMediaPicker} onOpenChange={setShowMediaPicker} onSelect={handleMediaSelect} />
        </div>
    );
}