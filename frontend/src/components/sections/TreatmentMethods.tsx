'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { treatmentsService } from '@/src/services/treatments.service';
import { TreatmentsConfig } from '@/src/types/treatments.types';
import { DEFAULT_TREATMENTS_CONFIG } from '@/src/config/treatments.config';

export default function TreatmentMethods() {
    const params = useParams();
    const locale = (params?.locale as string) || 'tr';

    const [config, setConfig] = useState<TreatmentsConfig>(DEFAULT_TREATMENTS_CONFIG);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch config from API - locale parametresi ile
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                setIsLoading(true);
                const data = await treatmentsService.getTreatmentsConfig(locale);
                console.log('✅ Treatments config loaded:', data);
                setConfig(data);
            } catch (error) {
                console.error('❌ Error fetching treatments config:', error);
                setConfig(DEFAULT_TREATMENTS_CONFIG);
            } finally {
                setIsLoading(false);
            }
        };
        fetchConfig();
    }, [locale]);

    // Loading skeleton
    if (isLoading) {
        return (
            <section className="w-full bg-white py-7 md:py-14">
                <div className="w-full flex justify-center">
                    <div className="container max-w-4xl mx-auto flex flex-col items-center text-center">
                        <div className="h-6 w-32 bg-gray-200 animate-pulse rounded mb-2" />
                        <div className="h-8 w-64 bg-gray-200 animate-pulse rounded mb-4" />
                        <div className="space-y-2 w-full">
                            <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4 mx-auto" />
                            <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3 mx-auto" />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 w-full">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-6 bg-gray-200 animate-pulse rounded" />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full bg-white py-7 md:py-14">
            {/* Background with logo overlay */}
            <div
                className="w-full flex justify-center"
                style={{
                    backgroundImage: config.background_logo
                        ? `linear-gradient(90deg, rgba(255,255,255,0.68), rgba(255,255,255,0.68)), url("${config.background_logo}")`
                        : undefined,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center center',
                    backgroundSize: 'auto 80%',
                }}
            >
                {/* Content container - API'den gelen (LOCALE'E GÖRE) */}
                <div className="container max-w-7xl mx-auto flex flex-col items-center text-center px-4">
                    {/* Header */}
                    {config.top_title && (
                        <p className="text-sm md:text-base text-primary-pink uppercase font-medium">
                            {config.top_title}
                        </p>
                    )}
                    {config.title && (
                        <p className="text-gray-900 capitalize text-2xl md:text-3xl font-medium tracking-wide mb-2">
                            {config.title}
                        </p>
                    )}

                    {/* Description */}
                    {(config.description1 || config.description2) && (
                        <div className="text-sm md:text-base text-gray-700">
                            {config.description1 && <p className="mb-0">{config.description1}</p>}
                            {config.description2 && <p>{config.description2}</p>}
                        </div>
                    )}

                    {/* Treatments List */}
                    {config.treatments && config.treatments.length > 0 && (
                        <div className="flex gap-4 justify-center items-center flex-wrap max-w-[700px] mx-auto mt-6">
                            {config.treatments.map((treatment) => (
                                <Link
                                    key={treatment.id}
                                    href={`/${locale}${treatment.href}`}
                                    className="text-xs md:text-sm text-gray-700 font-medium flex gap-1 items-center hover-primary-pink"
                                >
                                    <Check size={16} className="text-primary-pink flex-shrink-0" />
                                    <span className="hover:text-primary-pink transition-colors duration-300 cursor-pointer">
                                        {treatment.label}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Contact Button */}
                    {config.contact_button_text && (
                        <Link
                            href={`/${locale}/contact`}
                            className="bg-primary-pink hover-bg-primary-blue px-5 md:px-8 py-2 md:py-4 rounded-full cursor-pointer transition-colors duration-300 mt-4 md:mt-6 flex items-center justify-center"
                        >
                            <span className="text-sm md:text-base text-white capitalize font-medium">
                                {config.contact_button_text}
                            </span>
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}