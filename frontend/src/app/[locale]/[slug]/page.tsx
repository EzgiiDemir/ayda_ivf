'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface PageContent {
    id: number;
    title: string;
    subtitle: string;
    content: string;
    heroImage: string;
    metaTitle?: string;
    metaDescription?: string;
    slug: string;
    status: string;
}

export default function SlugPage() {
    const params = useParams();
    const locale = params?.locale || 'tr';
    const slug = params?.slug as string;

    const [pageContent, setPageContent] = useState<PageContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPageContent = async () => {
            if (!slug) return;

            try {
                setLoading(true);
                setError(null);

                // API'den sayfa verisini çek - Public endpoint
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

                console.log('ENV Check:', process.env.NEXT_PUBLIC_API_URL);
                console.log('API URL:', apiUrl);
                console.log('Fetching page:', `${apiUrl}/api/pages/slug/${slug}`);

                const response = await fetch(`${apiUrl}/api/pages/slug/${slug}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                // API response format: { success: true, data: {...} }
                if (data.success && data.data) {
                    setPageContent(data.data);
                } else {
                    throw new Error('Invalid response format');
                }
            } catch (err: any) {
                console.error('Page fetch error:', err);
                setError(err.message || 'Sayfa yüklenirken hata oluştu');
            } finally {
                setLoading(false);
            }
        };

        fetchPageContent();
    }, [slug]);

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary-pink mx-auto mb-4" />
                    <p className="text-gray-600">Sayfa yükleniyor...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !pageContent) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                    <p className="text-gray-600 mb-4">
                        {error || 'Sayfa bulunamadı'}
                    </p>
                    <a
                        href={`/${locale}`}
                        className="text-primary-pink hover:underline"
                    >
                        Ana sayfaya dön
                    </a>
                </div>
            </div>
        );
    }

    return (
        <main className="w-full">
            {/* SEO Meta Tags */}
            <head>
                <title>{pageContent.metaTitle || pageContent.title}</title>
                <meta
                    name="description"
                    content={pageContent.metaDescription || pageContent.subtitle}
                />
            </head>

            {/* Hero Section */}
            <section className="w-full relative h-[60vh]">
                <Image
                    src={pageContent.heroImage}
                    alt={pageContent.title}
                    fill
                    className="object-cover w-full h-full"
                    priority
                    unoptimized
                />
                <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-white p-4">
                    <h1 className="text-3xl md:text-5xl font-bold mb-2 text-center">
                        {pageContent.title}
                    </h1>
                    <p className="text-lg md:text-2xl text-center">
                        {pageContent.subtitle}
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="max-w-5xl mx-auto px-4 py-12">
                <div
                    className="prose prose-lg max-w-none text-gray-800"
                    dangerouslySetInnerHTML={{ __html: pageContent.content }}
                />
            </section>
        </main>
    );
}