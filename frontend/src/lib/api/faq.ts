import { cache } from 'react';
import { FAQConfig, DEFAULT_FAQ_CONFIG } from '@/src/types/faq';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const REVALIDATE_TIME = 3600;

export const getFAQConfig = cache(async (locale: string): Promise<FAQConfig> => {
    try {
        const response = await fetch(
            `${API_URL}/api/faq?locale=${locale}`,
            {
                next: {
                    revalidate: REVALIDATE_TIME,
                    tags: [`faq-${locale}`],
                },
            }
        );

        if (!response.ok) {
            return DEFAULT_FAQ_CONFIG;
        }

        const result = await response.json();

        return {
            title: DEFAULT_FAQ_CONFIG.title,
            subtitle: DEFAULT_FAQ_CONFIG.subtitle,
            faqs: result.data.faqs.map((faq: any) => ({
                id: `faq-${faq.id}`,
                question: '',
                answer: '',
                order: faq.order,
                isActive: true,
            })),
            heroImage: result.data.heroImage || DEFAULT_FAQ_CONFIG.heroImage,
        };
    } catch (error) {
        console.error('FAQ fetch error:', error);
        return DEFAULT_FAQ_CONFIG;
    }
});