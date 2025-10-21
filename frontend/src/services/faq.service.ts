// src/services/faq.service.ts
import axios, { AxiosError } from 'axios';
import { FAQConfig, FAQApiResponse } from '@/src/types/faq.types';
import { FAQ_API_CONFIG, FAQ_CACHE_CONFIG, DEFAULT_FAQ_CONFIG } from '@/src/config/faq.config';

class FAQService {
    private cache: Map<string, { data: FAQConfig; timestamp: number }>;

    constructor() {
        this.cache = new Map();
    }

    async getFAQConfig(locale: string): Promise<FAQConfig> {
        if (FAQ_CACHE_CONFIG.enabled) {
            const cached = this.getFromCache(locale);
            if (cached) {
                console.log(`[FAQService] Using cached config for locale: ${locale}`);
                return cached;
            }
        }

        try {
            const config = await this.fetchFromApi(locale);

            if (FAQ_CACHE_CONFIG.enabled) {
                this.saveToCache(locale, config);
            }

            return config;
        } catch (error) {
            console.error('[FAQService] Failed to fetch config:', error);
            return DEFAULT_FAQ_CONFIG;
        }
    }

    private async fetchFromApi(locale: string): Promise<FAQConfig> {
        const url = `${FAQ_API_CONFIG.baseURL}${FAQ_API_CONFIG.endpoint}`;

        try {
            const response = await axios.get<FAQApiResponse>(url, {
                params: { locale },
                timeout: FAQ_API_CONFIG.timeout,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.data || !response.data.data) {
                throw new Error('Invalid API response structure');
            }

            return response.data.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                console.error('[FAQService] API Error:', axiosError.response?.data);
            }
            throw error;
        }
    }

    private getFromCache(locale: string): FAQConfig | null {
        const cacheKey = `${FAQ_CACHE_CONFIG.key}_${locale}`;
        const cached = this.cache.get(cacheKey);

        if (!cached) return null;

        const now = Date.now();
        const isExpired = now - cached.timestamp > FAQ_CACHE_CONFIG.ttl;

        if (isExpired) {
            this.cache.delete(cacheKey);
            return null;
        }

        return cached.data;
    }

    private saveToCache(locale: string, config: FAQConfig): void {
        const cacheKey = `${FAQ_CACHE_CONFIG.key}_${locale}`;
        this.cache.set(cacheKey, {
            data: config,
            timestamp: Date.now(),
        });
    }

    clearCache(locale?: string): void {
        if (locale) {
            const cacheKey = `${FAQ_CACHE_CONFIG.key}_${locale}`;
            this.cache.delete(cacheKey);
        } else {
            this.cache.clear();
        }
    }
}

export const faqService = new FAQService();
export { FAQService };