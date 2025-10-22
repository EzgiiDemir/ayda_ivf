'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { welcomeService } from '@/src/services/welcome.service';
import { WelcomeConfig } from '@/src/types/welcome.types';
import { DEFAULT_WELCOME_CONFIG } from '@/src/config/welcome.config';

export default function Welcome() {
    const params = useParams();
    const locale = (params?.locale as string) || 'tr';

    const [config, setConfig] = useState<WelcomeConfig>(DEFAULT_WELCOME_CONFIG);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        const fetchConfig = async () => {
            try {
                setIsLoading(true);
                const data = await welcomeService.getWelcomeConfig(locale);
                console.log('✅ Welcome config loaded:', data);
                if (mounted) setConfig(data);
            } catch (error) {
                console.error('❌ Error fetching welcome config:', error);
                if (mounted) setConfig(DEFAULT_WELCOME_CONFIG);
            } finally {
                if (mounted) setIsLoading(false);
            }
        };
        fetchConfig();
        return () => { mounted = false; };
    }, [locale]);

    // Loading skeleton
    if (isLoading) {
        return (
            <section className="py-7 md:py-14 bg-white">
                <div className="mx-auto px-4 max-w-7xl">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 lg:items-center">
                        <div className="lg:flex-[0.4] flex items-center justify-center">
                            <div className="w-full max-w-[700px] lg:max-w-none aspect-square bg-gray-200 animate-pulse rounded-br-[37%] rounded-bl-[37%]" />
                        </div>

                        <div className="lg:flex-[0.6] space-y-4">
                            <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4 mx-auto lg:mx-0" />
                            <div className="space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-4 bg-gray-200 animate-pulse rounded" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Main content
    return (
        <section className="py-7 md:py-14 bg-white">
            <div className="mx-auto px-4 max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 lg:items-center">
                    {/* Image Section */}
                    <div className="lg:flex-[0.4] flex items-center justify-center">
                        <div
                            className="w-full max-w-[700px] lg:max-w-none aspect-square relative rounded-br-[37%] rounded-bl-[37%] overflow-hidden"
                            style={{
                                background: `radial-gradient(circle, ${config.gradient.from}, ${config.gradient.via} 45%, ${config.gradient.to} 65%)`,
                            }}
                        >
                            <Image
                                src={config.image.url}
                                alt={config.image.alt || 'Welcome Image'}
                                width={config.image.width || 400}
                                height={config.image.height || 400}
                                className="w-full h-full object-contain"
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    height: '100%',
                                    width: '100%',
                                    filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
                                }}
                                priority
                            />
                        </div>
                    </div>

                    {/* Text Content - API'den gelen (LOCALE'E GÖRE) */}
                    <div className="lg:flex-[0.6] space-y-4">
                        <div className="text-center mb-6">
                            {config.title_top && (
                                <p className="text-primary-pink uppercase text-xs md:text-sm font-medium tracking-wide mb-2">
                                    {config.title_top}
                                </p>
                            )}
                            {config.title && (
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                                    {config.title}
                                </h2>
                            )}
                        </div>

                        {config.paragraphs && config.paragraphs.length > 0 && (
                            <div className="text-sm md:text-base text-gray-700 space-y-3">
                                {config.paragraphs.map((paragraph, index) =>
                                    paragraph ? (
                                        <p key={index} className="text-justify leading-relaxed">
                                            {paragraph}
                                        </p>
                                    ) : null
                                )}
                            </div>
                        )}

                        {(config.signature_name || config.signature_title) && (
                            <div className="text-right mt-8 pt-4">
                                {config.signature_name && (
                                    <p className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                                        {config.signature_name}
                                    </p>
                                )}
                                {config.signature_title && (
                                    <p className="text-primary-pink text-sm md:text-base font-medium">
                                        {config.signature_title}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}