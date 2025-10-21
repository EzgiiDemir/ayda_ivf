// src/types/contact.types.ts
export interface ContactConfig {
    banner_image: string;
    form_top_title: string;
    form_title: string;
    form_subjects: string[];
    submit_button_text: string;
}

export interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
    locale?: string;
}

export interface ContactApiResponse {
    data: ContactConfig;
    success: boolean;
    message?: string;
}

export interface ContactSubmitResponse {
    success: boolean;
    message: string;
}