export interface WelcomeImage {
    url: string;
    alt: string;
    width: number;
    height: number;
}

export interface WelcomeGradient {
    from: string;
    via: string;
    to: string;
}

export interface WelcomeConfig {
    image: WelcomeImage;
    gradient: WelcomeGradient;
    title_top: string;
    title: string;
    paragraphs: string[];
    signature_name: string;
    signature_title: string;
    meta?: {
        version?: string;
        lastUpdated?: string;
    };
}

export interface WelcomeApiResponse {
    data: WelcomeConfig;
    success: boolean;
    message?: string;
    meta?: {
        locale: string;
        timestamp: string;
    };
}

export interface WelcomeError {
    message: string;
    code?: string;
    details?: unknown;
}