// src/app/[locale]/faq/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { faqService } from '@/src/services/faq.service';
import { FAQConfig } from '@/src/types/faq.types';
import { DEFAULT_FAQ_CONFIG } from '@/src/config/faq.config';
import FAQAccordion from '@/src/components/faq/FAQAccordion';

export default function FAQPage() {
    const params = useParams();
    const locale = (params?.locale as string) || 'tr';

    const [config, setConfig] = useState<FAQConfig>(DEFAULT_FAQ_CONFIG);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                setIsLoading(true);
                const data = await faqService.getFAQConfig(locale);
                console.log('FAQ config loaded:', data);
                setConfig(data);
            } catch (error) {
                console.error('Error fetching FAQ config:', error);
                setConfig(DEFAULT_FAQ_CONFIG);
            } finally {
                setIsLoading(false);
            }
        };
        fetchConfig();
    }, [locale]);

    if (isLoading) {
        return (
            <main className="flex-1 flex flex-col">
                <div className="bg-gray-300 w-full aspect-[16/7] md:aspect-[16/5] max-h-[400px] animate-pulse" />
                <div className="py-5 md:py-10 container mx-auto">
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="border p-6 rounded-md">
                                <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4" />
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 flex flex-col">
            {/* Hero Banner */}
            {config.hero_image && (
                <div
                    className="relative w-full aspect-[16/7] md:aspect-[16/5] max-h-[400px]"
                    style={{
                        backgroundImage: `url("${config.hero_image}")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center center',
                        backgroundSize: 'cover',
                    }}
                />
            )}

            {/* FAQ Content */}
            <div className="py-5 md:py-10 container mx-auto">
                <div className="container mx-auto max-w-7xl">
                    <FAQAccordion locale={locale} />
                </div>
            </div>
        </main>
    );
}