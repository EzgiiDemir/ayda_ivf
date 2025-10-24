import { WelcomeConfig } from '@/src/types/welcome.types';

export const DEFAULT_WELCOME_CONFIG: WelcomeConfig = {
    image: {
        url: 'https://api.aydaivf.com/uploads/1617890130_4018_org_74c04c13d4.png',
        alt: 'Ayda CEO',
        width: 400,
        height: 400,
    },
    gradient: {
        from: '#F7DFE6',
        via: '#FFFFFF',
        to: '#FFFFFF',
    },
    title_top: 'HOŞGELDİNİZ',
    title: 'AYDA IVF',
    paragraphs: [
        'Hoş geldiniz paragraf 1',
        'Hoş geldiniz paragraf 2',
        'Hoş geldiniz paragraf 3',
        'Hoş geldiniz paragraf 4',
        'Hoş geldiniz paragraf 5',
    ],
    signature_name: 'Dr. Ayda Yılmaz',
    signature_title: 'CEO & Founder',
    meta: {
        version: '1.0.0',
    },
};

export const WELCOME_API_CONFIG = {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    endpoint: '/api/welcome',
    timeout: 5000,
};

export const WELCOME_CACHE_CONFIG = {
    key: 'welcome_config',
    ttl: 3600000, // 1 hour
    enabled: true,
};