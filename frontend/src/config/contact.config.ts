import { ContactConfig } from '@/src/types/contact.types';

export const DEFAULT_CONTACT_CONFIG: ContactConfig = {
    banner_image: 'https://api.aydaivf.com/uploads/elitebig_7bc1166778.jpg',
    form_top_title: 'Aşağıdaki formu doldurarak',
    form_title: 'bizimle iletişime geçebilirsiniz',
    form_subjects: [
        'Genel Bilgi',
        'Randevu Talebi',
        'Tedavi Hakkında',
        'Fiyat Bilgisi',
        'Diğer'
    ],
    submit_button_text: 'Gönder',
};

export const CONTACT_API_CONFIG = {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    endpoint: '/api/contact',
    timeout: 5000,
};

export const CONTACT_CACHE_CONFIG = {
    key: 'contact_config',
    ttl: 3600000,
    enabled: true,
};