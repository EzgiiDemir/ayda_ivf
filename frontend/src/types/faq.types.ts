// src/types/faq.types.ts
export interface FAQItem {
    id?: number;
    question: string;
    answer: string;
    order: number;
    is_active: boolean;
}

export interface FAQConfig {
    hero_image: string;
    faqs: FAQItem[];
}

export interface FAQApiResponse {
    data: FAQConfig;
    success: boolean;
    message?: string;
}