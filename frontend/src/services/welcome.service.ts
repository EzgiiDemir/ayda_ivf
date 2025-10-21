import axios, { AxiosError } from 'axios';
import { WelcomeConfig, WelcomeApiResponse, WelcomeError } from '@/src/types/welcome.types';
import { WELCOME_API_CONFIG, WELCOME_CACHE_CONFIG, DEFAULT_WELCOME_CONFIG } from '@/src/config/welcome.config';

class WelcomeService {
    private cache: Map<string, { data: WelcomeConfig; timestamp: number }>;

    constructor() {
        this.cache = new Map();
    }

    async getWelcomeConfig(locale: string): Promise<WelcomeConfig> {
        // Check cache first
        if (WELCOME_CACHE_CONFIG.enabled) {
            const cached = this.getFromCache(locale);
            if (cached) {
                console.log(`[WelcomeService] Using cached config for locale: ${locale}`);
                return cached;
            }
        }

        try {
            const config = await this.fetchFromApi(locale);

            // Save to cache
            if (WELCOME_CACHE_CONFIG.enabled) {
                this.saveToCache(locale, config);
            }

            return config;
        } catch (error) {
            console.error('[WelcomeService] Failed to fetch config:', error);
            return DEFAULT_WELCOME_CONFIG;
        }
    }

    private async fetchFromApi(locale: string): Promise<WelcomeConfig> {
        const url = `${WELCOME_API_CONFIG.baseURL}${WELCOME_API_CONFIG.endpoint}`;

        try {
            const response = await axios.get<WelcomeApiResponse>(url, {
                params: { locale },
                timeout: WELCOME_API_CONFIG.timeout,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.data || !response.data.data) {
                throw new Error('Invalid API response structure');
            }

            return this.validateConfig(response.data.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<WelcomeError>;
                console.error('[WelcomeService] API Error:', axiosError.response?.data);
            }
            throw error;
        }
    }

    private validateConfig(config: Partial<WelcomeConfig>): WelcomeConfig {
        return {
            image: config.image || DEFAULT_WELCOME_CONFIG.image,
            gradient: config.gradient || DEFAULT_WELCOME_CONFIG.gradient,
            title_top: config.title_top || DEFAULT_WELCOME_CONFIG.title_top,
            title: config.title || DEFAULT_WELCOME_CONFIG.title,
            paragraphs: config.paragraphs || DEFAULT_WELCOME_CONFIG.paragraphs,
            signature_name: config.signature_name || DEFAULT_WELCOME_CONFIG.signature_name,
            signature_title: config.signature_title || DEFAULT_WELCOME_CONFIG.signature_title,
            meta: config.meta,
        };
    }

    private getFromCache(locale: string): WelcomeConfig | null {
        const cacheKey = `${WELCOME_CACHE_CONFIG.key}_${locale}`;
        const cached = this.cache.get(cacheKey);

        if (!cached) return null;

        const now = Date.now();
        const isExpired = now - cached.timestamp > WELCOME_CACHE_CONFIG.ttl;

        if (isExpired) {
            this.cache.delete(cacheKey);
            return null;
        }

        return cached.data;
    }

    private saveToCache(locale: string, config: WelcomeConfig): void {
        const cacheKey = `${WELCOME_CACHE_CONFIG.key}_${locale}`;
        this.cache.set(cacheKey, {
            data: config,
            timestamp: Date.now(),
        });
    }

    clearCache(locale?: string): void {
        if (locale) {
            const cacheKey = `${WELCOME_CACHE_CONFIG.key}_${locale}`;
            this.cache.delete(cacheKey);
        } else {
            this.cache.clear();
        }
    }
}

export const welcomeService = new WelcomeService();
export { WelcomeService };