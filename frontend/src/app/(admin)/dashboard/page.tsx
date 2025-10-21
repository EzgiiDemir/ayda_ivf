'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
    FileText,
    Upload,
    Settings as SettingsIcon,
    ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import axios from "@/src/lib/axios";

interface DashboardStats {
    totalPages: number;
    totalMedia: number;
}

interface RecentPage {
    id: number;
    title: string;
    slug: string;
    status: 'published' | 'draft';
    updated_at: string;
    author?: {
        name: string;
    };
}

interface Activity {
    id: number;
    type: 'page_created' | 'page_updated' | 'media_uploaded' | 'settings_updated';
    title: string;
    description: string;
    created_at: string;
}

export default function DashboardPage() {
    const t = useTranslations('admin');
    const tCommon = useTranslations('common');
    const tDashboard = useTranslations('dashboard');

    const [stats, setStats] = useState<DashboardStats>({
        totalPages: 0,
        totalMedia: 0,
    });
    const [recentPages, setRecentPages] = useState<RecentPage[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [statsRes, pagesRes, activitiesRes] = await Promise.all([
                axios.get('/dashboard/stats'),
                axios.get('/dashboard/recent-pages?limit=6'),
                axios.get('/dashboard/recent-activity?limit=5'),
            ]);

            setStats(statsRes.data.data);
            setRecentPages(pagesRes.data.data);
            setActivities(activitiesRes.data.data);
        } catch (err: any) {
            console.error('Dashboard data fetch error:', err);
            setError(err.response?.data?.message || tCommon('error'));
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: tDashboard('totalPages'),
            value: stats.totalPages,

        },
        {
            title: tDashboard('totalMedia'),
            value: stats.totalMedia,

        },
    ];

    const quickActions = [
        {
            title: tDashboard('managePages'),
            description: tDashboard('editPages'),
            href: '/pages',
            icon: FileText,
            color: 'bg-primary-pink',
        },
        {
            title: tDashboard('uploadMedia'),
            description: tDashboard('addFiles'),
            href: '/media',
            icon: Upload,
            color: 'bg-primary-pink',
        },
        {
            title: t('settings'),
            description: tDashboard('siteSettings'),
            href: '/settings',
            icon: SettingsIcon,
            color: 'bg-primary-pink',
        },
    ];

    if (error) {
        return (
            <div className="space-y-6">
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button onClick={fetchDashboardData}>{tCommon('retry')}</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-primary-pink">{t('dashboard')}</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i} className="border border-gray-100 shadow-sm">
                            <CardContent className="p-5">
                                <Skeleton className="h-5 w-24 mb-3" />
                                <Skeleton className="h-7 w-20" />
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    statCards.map((card, index) => (
                        <Card
                            key={index}
                            className="border border-gray-100 bg-white hover:bg-gray-50 transition-colors"
                        >
                            <CardContent className="p-5">
                                <h3 className="text-base font-semibold text-primary-pink">{card.title}</h3>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-primary-pink">{tDashboard('recentPages')}</CardTitle>
                            <Button variant="link" asChild className="text-primary-pink">
                                <Link href="/pages">
                                    {tCommon('viewAll')} <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="flex items-center space-x-4 p-4">
                                        <Skeleton className="w-10 h-10 rounded-lg" />
                                        <div className="flex-1">
                                            <Skeleton className="h-4 w-32 mb-2" />
                                            <Skeleton className="h-3 w-24" />
                                        </div>
                                        <Skeleton className="h-6 w-16 rounded-full" />
                                    </div>
                                ))
                            ) : recentPages.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                    <p>{tCommon('noResults')}</p>
                                </div>
                            ) : (
                                recentPages.map((page) => (
                                    <Link
                                        key={page.id}
                                        href={`/pages/${page.id}/edit`}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <FileText className="w-5 h-5 text-primary-pink" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800">{page.title}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(page.updated_at).toLocaleDateString('tr-TR')}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge
                                            variant={page.status === 'published' ? 'default' : 'secondary'}
                                            className={
                                                page.status === 'published'
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                                            }
                                        >
                                            {page.status === 'published' ? tCommon('published') : tCommon('draft')}
                                        </Badge>
                                    </Link>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-primary-pink">{tDashboard('quickActions')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {quickActions.map((action, index) => {
                                const Icon = action.icon;
                                return (
                                    <Link
                                        key={index}
                                        href={action.href}
                                        className="flex items-center p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors group"
                                    >
                                        <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="font-semibold text-gray-800">{action.title}</h3>
                                            <p className="text-sm text-gray-600">{action.description}</p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-primary-pink">{tDashboard('recentActivity')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex items-start space-x-4 pb-4">
                                    <Skeleton className="w-8 h-8 rounded-lg" />
                                    <div className="flex-1">
                                        <Skeleton className="h-4 w-48 mb-2" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            ))
                        ) : activities.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <p>{tDashboard('noActivity')}</p>
                            </div>
                        ) : (
                            activities.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-0"
                                >
                                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <FileText className="w-4 h-4 text-gray-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                                        <p className="text-sm text-gray-600">{activity.description}</p>
                                    </div>
                                    <span className="text-xs text-gray-500 flex-shrink-0">
                    {new Date(activity.created_at).toLocaleDateString('tr-TR')}
                  </span>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}