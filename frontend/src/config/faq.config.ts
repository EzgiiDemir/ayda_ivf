import { FAQConfig } from '@/src/types/faq.types';

export const DEFAULT_FAQ_CONFIG: FAQConfig = {
    hero_image: 'https://api.aydaivf.com/uploads/elitebig_7bc1166778.jpg',
    faqs: [],
};

export const FAQ_API_CONFIG = {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    endpoint: '/api/faq',
    timeout: 5000,
};

export const FAQ_CACHE_CONFIG = {
    key: 'faq_config',
    ttl: 3600000,
    enabled: true,
};