export interface Treatment {
    id: string;
    label: string;
    href: string;
    order: number;
    isActive: boolean;
}

export interface TreatmentsConfig {
    background_logo: string;
    treatments: Treatment[];
    top_title: string;
    title: string;
    description1: string;
    description2: string;
    contact_button_text: string;
    meta?: {
        version?: string;
        lastUpdated?: string;
    };
}

// API Response types
export interface TreatmentsApiResponse {
    data: TreatmentsConfig;
    success: boolean;
    message?: string;
    meta?: {
        locale: string;
        timestamp: string;
    };
}

export interface TreatmentsError {
    message: string;
    code?: string;
    details?: unknown;
}