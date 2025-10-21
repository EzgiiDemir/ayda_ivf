// src/services/contact.service.ts
import axios, { AxiosError } from 'axios';
import { ContactConfig, ContactFormData, ContactApiResponse, ContactSubmitResponse } from '@/src/types/contact.types';
import { CONTACT_API_CONFIG, CONTACT_CACHE_CONFIG, DEFAULT_CONTACT_CONFIG } from '@/src/config/contact.config';

class ContactService {
    private cache: Map<string, { data: ContactConfig; timestamp: number }>;

    constructor() {
        this.cache = new Map();
    }

    async getContactConfig(locale: string): Promise<ContactConfig> {
        if (CONTACT_CACHE_CONFIG.enabled) {
            const cached = this.getFromCache(locale);
            if (cached) {
                console.log(`[ContactService] Using cached config for locale: ${locale}`);
                return cached;
            }
        }

        try {
            const config = await this.fetchFromApi(locale);

            if (CONTACT_CACHE_CONFIG.enabled) {
                this.saveToCache(locale, config);
            }

            return config;
        } catch (error) {
            console.error('[ContactService] Failed to fetch config:', error);
            return DEFAULT_CONTACT_CONFIG;
        }
    }

    private async fetchFromApi(locale: string): Promise<ContactConfig> {
        const url = `${CONTACT_API_CONFIG.baseURL}${CONTACT_API_CONFIG.endpoint}`;

        try {
            const response = await axios.get<ContactApiResponse>(url, {
                params: { locale },
                timeout: CONTACT_API_CONFIG.timeout,
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
                console.error('[ContactService] API Error:', axiosError.response?.data);
            }
            throw error;
        }
    }

    async submitContactForm(formData: ContactFormData): Promise<ContactSubmitResponse> {
        const url = `${CONTACT_API_CONFIG.baseURL}${CONTACT_API_CONFIG.endpoint}/submit`;

        try {
            const response = await axios.post<ContactSubmitResponse>(url, formData, {
                timeout: CONTACT_API_CONFIG.timeout,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                throw new Error(axiosError.response?.data?.message || 'Form gönderilirken bir hata oluştu');
            }
            throw error;
        }
    }

    private getFromCache(locale: string): ContactConfig | null {
        const cacheKey = `${CONTACT_CACHE_CONFIG.key}_${locale}`;
        const cached = this.cache.get(cacheKey);

        if (!cached) return null;

        const now = Date.now();
        const isExpired = now - cached.timestamp > CONTACT_CACHE_CONFIG.ttl;

        if (isExpired) {
            this.cache.delete(cacheKey);
            return null;
        }

        return cached.data;
    }

    private saveToCache(locale: string, config: ContactConfig): void {
        const cacheKey = `${CONTACT_CACHE_CONFIG.key}_${locale}`;
        this.cache.set(cacheKey, {
            data: config,
            timestamp: Date.now(),
        });
    }

    clearCache(locale?: string): void {
        if (locale) {
            const cacheKey = `${CONTACT_CACHE_CONFIG.key}_${locale}`;
            this.cache.delete(cacheKey);
        } else {
            this.cache.clear();
        }
    }
}

export const contactService = new ContactService();
export { ContactService };