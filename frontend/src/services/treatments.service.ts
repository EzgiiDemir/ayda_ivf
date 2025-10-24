import axios, { AxiosError } from 'axios';
import { TreatmentsConfig, TreatmentsApiResponse, TreatmentsError } from '@/src/types/treatments.types';
import { TREATMENTS_API_CONFIG, TREATMENTS_CACHE_CONFIG, DEFAULT_TREATMENTS_CONFIG } from '@/src/config/treatments.config';

class TreatmentsService {
    private cache: Map<string, { data: TreatmentsConfig; timestamp: number }>;

    constructor() {
        this.cache = new Map();
    }

    async getTreatmentsConfig(locale: string): Promise<TreatmentsConfig> {
        // Check cache first
        if (TREATMENTS_CACHE_CONFIG.enabled) {
            const cached = this.getFromCache(locale);
            if (cached) {
                console.log(`[TreatmentsService] Using cached config for locale: ${locale}`);
                return cached;
            }
        }

        try {
            const config = await this.fetchFromApi(locale);

            if (TREATMENTS_CACHE_CONFIG.enabled) {
                this.saveToCache(locale, config);
            }

            return config;
        } catch (error) {
            console.error('[TreatmentsService] Failed to fetch config:', error);
            return DEFAULT_TREATMENTS_CONFIG;
        }
    }

    private async fetchFromApi(locale: string): Promise<TreatmentsConfig> {
        const url = `${TREATMENTS_API_CONFIG.baseURL}${TREATMENTS_API_CONFIG.endpoint}`;

        try {
            const response = await axios.get<TreatmentsApiResponse>(url, {
                params: { locale },
                timeout: TREATMENTS_API_CONFIG.timeout,
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
                const axiosError = error as AxiosError<TreatmentsError>;
                console.error('[TreatmentsService] API Error:', axiosError.response?.data);
            }
            throw error;
        }
    }

    private validateConfig(config: Partial<TreatmentsConfig>): TreatmentsConfig {
        const treatments = (config.treatments || DEFAULT_TREATMENTS_CONFIG.treatments)
            .filter(treatment => treatment.isActive !== false)
            .sort((a, b) => (a.order || 0) - (b.order || 0));

        return {
            background_logo: config.background_logo || DEFAULT_TREATMENTS_CONFIG.background_logo,
            top_title: config.top_title || DEFAULT_TREATMENTS_CONFIG.top_title,
            title: config.title || DEFAULT_TREATMENTS_CONFIG.title,
            description1: config.description1 || DEFAULT_TREATMENTS_CONFIG.description1,
            description2: config.description2 || DEFAULT_TREATMENTS_CONFIG.description2,
            contact_button_text: config.contact_button_text || DEFAULT_TREATMENTS_CONFIG.contact_button_text,
            treatments: treatments.length > 0 ? treatments : DEFAULT_TREATMENTS_CONFIG.treatments,
            meta: config.meta,
        };
    }

    private getFromCache(locale: string): TreatmentsConfig | null {
        const cacheKey = `${TREATMENTS_CACHE_CONFIG.key}_${locale}`;
        const cached = this.cache.get(cacheKey);

        if (!cached) return null;

        const now = Date.now();
        const isExpired = now - cached.timestamp > TREATMENTS_CACHE_CONFIG.ttl;

        if (isExpired) {
            this.cache.delete(cacheKey);
            return null;
        }

        return cached.data;
    }

    private saveToCache(locale: string, config: TreatmentsConfig): void {
        const cacheKey = `${TREATMENTS_CACHE_CONFIG.key}_${locale}`;
        this.cache.set(cacheKey, {
            data: config,
            timestamp: Date.now(),
        });
    }

    clearCache(locale?: string): void {
        if (locale) {
            const cacheKey = `${TREATMENTS_CACHE_CONFIG.key}_${locale}`;
            this.cache.delete(cacheKey);
        } else {
            this.cache.clear();
        }
    }

    async refreshConfig(locale: string): Promise<TreatmentsConfig> {
        this.clearCache(locale);
        return this.getTreatmentsConfig(locale);
    }
}

export const treatmentsService = new TreatmentsService();
export { TreatmentsService };