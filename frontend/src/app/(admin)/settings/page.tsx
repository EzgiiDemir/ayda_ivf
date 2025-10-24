'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import axios from '@/src/lib/axios';
import {
    Settings,
    Globe,
    Search,
    Share2,
    Loader2,
    Save
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/src/components/ui/use-toast';
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@radix-ui/react-tabs";

interface SiteSettings {
    siteName: string;
    siteUrl: string;
    adminEmail: string;
    logo: string;
    favicon: string;
    language: string;
}

interface SeoSettings {
    metaTitle: string;
    metaKeywords: string;
}

interface SocialSettings {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
}

export default function SettingsPage() {
    const t = useTranslations('settings');
    const tCommon = useTranslations('common');
    const { toast } = useToast();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [siteSettings, setSiteSettings] = useState<SiteSettings>({
        siteName: '',
        siteUrl: '',
        adminEmail: '',
        logo: '',
        favicon: '',
        language: 'tr',
    });

    const [seoSettings, setSeoSettings] = useState<SeoSettings>({
        metaTitle: '',
        metaKeywords: '',
    });

    const [socialSettings, setSocialSettings] = useState<SocialSettings>({
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        youtube: '',
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const [generalRes, seoRes, socialRes] = await Promise.all([
                axios.get('/settings/general'),
                axios.get('/settings/seo'),
                axios.get('/settings/social'),
            ]);

            setSiteSettings(generalRes.data.data || generalRes.data);
            setSeoSettings(seoRes.data.data || seoRes.data);
            setSocialSettings(socialRes.data.data || socialRes.data);
        } catch (error: any) {
            console.error('Settings fetch error:', error);
            toast({
                title: tCommon('error'),
                description: error.response?.data?.message || tCommon('error'),
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSaveGeneral = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const response = await axios.put('/settings/general', siteSettings);

            if (response.data.data) {
                setSiteSettings(response.data.data);
            }

            toast({
                title: tCommon('success'),
                description: t('general.saveSuccess'),
            });
        } catch (error: any) {
            toast({
                title: tCommon('error'),
                description: error.response?.data?.message || tCommon('error'),
                variant: 'destructive',
            });
        } finally {
            setSaving(false);
        }
    };

    const handleSaveSeo = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const response = await axios.put('/settings/seo', seoSettings);

            if (response.data.data) {
                setSeoSettings(response.data.data);
            }

            toast({
                title: tCommon('success'),
                description: t('seo.saveSuccess'),
            });
        } catch (error: any) {
            toast({
                title: tCommon('error'),
                description: error.response?.data?.message || tCommon('error'),
                variant: 'destructive',
            });
        } finally {
            setSaving(false);
        }
    };

    const handleSaveSocial = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const response = await axios.put('/settings/social', socialSettings);

            if (response.data.data) {
                setSocialSettings(response.data.data);
            }

            toast({
                title: tCommon('success'),
                description: t('social.saveSuccess'),
            });
        } catch (error: any) {
            toast({
                title: tCommon('error'),
                description: error.response?.data?.message || tCommon('error'),
                variant: 'destructive',
            });
        } finally {
            setSaving(false);
        }
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
                <h1 className="text-3xl font-bold text-primary-pink">{t('title')}</h1>
            </div>

            {/* Tabs */}
            <Card>
                <Tabs defaultValue="general" className="w-full">
                    <div className="border-b">
                        <TabsList className="w-full justify-start rounded-none h-auto p-0 bg-transparent">
                            <TabsTrigger
                                value="general"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary-pink data-[state=active]:text-primary-pink px-6 py-4"
                            >
                                <Globe className="w-4 h-4 mr-2" />
                                {t('tabs.general')}
                            </TabsTrigger>
                            <TabsTrigger
                                value="seo"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary-pink data-[state=active]:text-primary-pink px-6 py-4"
                            >
                                <Search className="w-4 h-4 mr-2" />
                                {t('tabs.seo')}
                            </TabsTrigger>
                            <TabsTrigger
                                value="social"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary-pink data-[state=active]:text-primary-pink px-6 py-4"
                            >
                                <Share2 className="w-4 h-4 mr-2" />
                                {t('tabs.social')}
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* General Settings */}
                    <TabsContent value="general" className="p-6">
                        <form onSubmit={handleSaveGeneral} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="siteName">{t('general.siteName')} *</Label>
                                    <Input
                                        id="siteName"
                                        type="text"
                                        required
                                        value={siteSettings.siteName}
                                        onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="adminEmail">{t('general.adminEmail')} *</Label>
                                    <Input
                                        id="adminEmail"
                                        type="email"
                                        required
                                        value={siteSettings.adminEmail}
                                        onChange={(e) => setSiteSettings({ ...siteSettings, adminEmail: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="siteUrl">{t('general.siteUrl')} *</Label>
                                <Input
                                    id="siteUrl"
                                    type="url"
                                    required
                                    value={siteSettings.siteUrl}
                                    onChange={(e) => setSiteSettings({ ...siteSettings, siteUrl: e.target.value })}
                                    placeholder="https://yoursite.com"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="language">{t('general.language')}</Label>
                                    <Select
                                        value={siteSettings.language}
                                        onValueChange={(value) => setSiteSettings({ ...siteSettings, language: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="tr">Türkçe</SelectItem>
                                            <SelectItem value="en">English</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="pt-6 border-t">
                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-primary-pink hover:bg-pink-700"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            {t('general.saving')}
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            {t('general.save')}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </TabsContent>

                    {/* SEO Settings */}
                    <TabsContent value="seo" className="p-6">
                        <form onSubmit={handleSaveSeo} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="metaTitle">{t('seo.metaTitle')}</Label>
                                <Input
                                    id="metaTitle"
                                    type="text"
                                    value={seoSettings.metaTitle || ''}
                                    onChange={(e) => setSeoSettings({ ...seoSettings, metaTitle: e.target.value })}
                                />
                                <p className="text-xs text-gray-500">
                                    {(seoSettings.metaTitle || '').length}/60 {t('seo.characters')}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="metaKeywords">{t('seo.metaKeywords')}</Label>
                                <Input
                                    id="metaKeywords"
                                    type="text"
                                    value={seoSettings.metaKeywords || ''}
                                    onChange={(e) => setSeoSettings({ ...seoSettings, metaKeywords: e.target.value })}
                                    placeholder={t('seo.keywordsPlaceholder')}
                                />
                            </div>

                            <div className="pt-6 border-t">
                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-primary-pink hover:bg-pink-700"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            {t('seo.saving')}
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            {t('seo.save')}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </TabsContent>

                    {/* Social Media Settings */}
                    <TabsContent value="social" className="p-6">
                        <form onSubmit={handleSaveSocial} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="facebook">{t('social.facebook')}</Label>
                                <Input
                                    id="facebook"
                                    type="url"
                                    value={socialSettings.facebook || ''}
                                    onChange={(e) => setSocialSettings({ ...socialSettings, facebook: e.target.value })}
                                    placeholder="https://facebook.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="twitter">{t('social.twitter')}</Label>
                                <Input
                                    id="twitter"
                                    type="url"
                                    value={socialSettings.twitter || ''}
                                    onChange={(e) => setSocialSettings({ ...socialSettings, twitter: e.target.value })}
                                    placeholder="https://twitter.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="instagram">{t('social.instagram')}</Label>
                                <Input
                                    id="instagram"
                                    type="url"
                                    value={socialSettings.instagram || ''}
                                    onChange={(e) => setSocialSettings({ ...socialSettings, instagram: e.target.value })}
                                    placeholder="https://instagram.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="linkedin">{t('social.linkedin')}</Label>
                                <Input
                                    id="linkedin"
                                    type="url"
                                    value={socialSettings.linkedin || ''}
                                    onChange={(e) => setSocialSettings({ ...socialSettings, linkedin: e.target.value })}
                                    placeholder="https://linkedin.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="youtube">{t('social.youtube')}</Label>
                                <Input
                                    id="youtube"
                                    type="url"
                                    value={socialSettings.youtube || ''}
                                    onChange={(e) => setSocialSettings({ ...socialSettings, youtube: e.target.value })}
                                    placeholder="https://youtube.com"
                                />
                            </div>

                            <div className="pt-6 border-t">
                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-primary-pink hover:bg-pink-700"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            {t('social.saving')}
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            {t('social.save')}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    );
}