
export interface ContactMapConfig {
    image: string;
    mapUrl?: string;
    showIframe: boolean;
    meta?: {
        version?: string;
        lastUpdated?: string;
    };
}

export interface ContactMapApiResponse {
    data: ContactMapConfig;
    meta?: {
        locale: string;
        timestamp: string;
    };
}

export interface ContactMapError {
    message: string;
    code?: string;
    details?: unknown;
}