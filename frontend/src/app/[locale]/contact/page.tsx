'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { contactService } from '@/src/services/contact.service';
import { ContactConfig } from '@/src/types/contact.types';
import { DEFAULT_CONTACT_CONFIG } from '@/src/config/contact.config';
import ContactForm from '@/src/components/contact/ContactForm';

export default function ContactPage() {
    const params = useParams();
    const locale = (params?.locale as string) || 'tr';

    const [config, setConfig] = useState<ContactConfig>(DEFAULT_CONTACT_CONFIG);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                setIsLoading(true);
                const data = await contactService.getContactConfig(locale);
                console.log('Contact config loaded:', data);
                setConfig(data);
            } catch (error) {
                console.error('Error fetching contact config:', error);
                setConfig(DEFAULT_CONTACT_CONFIG);
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
                <div className="container flex flex-col gap-5 py-5 md:py-10">
                    <div className="space-y-4">
                        <div className="h-6 bg-gray-200 animate-pulse rounded w-1/2 mx-auto" />
                        <div className="h-8 bg-gray-200 animate-pulse rounded w-2/3 mx-auto" />
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 flex flex-col">
            {/* Banner */}
            <div
                className="bg-gray-300 w-full aspect-[16/7] md:aspect-[16/5] max-h-[400px]"
                style={{
                    backgroundImage: `url("${config.banner_image}")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center center',
                    backgroundSize: 'cover',
                }}
            />

            {/* Form Section */}
            <div className="container flex flex-col gap-5 py-5 md:py-10">
                <div>
                    <p className="text-xs md:text-base text-ayda-pink-dark uppercase text-center font-medium">
                        {config.form_top_title}
                    </p>
                    <p className="text-ayda-black capitalize text-2xl md:text-4xl font-medium text-center">
                        {config.form_title}
                    </p>
                </div>

                <ContactForm
                    subjects={config.form_subjects}
                    submitButtonText={config.submit_button_text}
                />
            </div>
        </main>
    );
}