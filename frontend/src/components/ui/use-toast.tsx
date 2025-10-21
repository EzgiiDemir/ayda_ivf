export type ToastVariant = 'default' | 'destructive' | 'success' | 'warning';

export interface ToastOptions {
    title?: string;
    description?: string;
    variant?: ToastVariant;
    duration?: number;
}

export function useToast() {
    const toast = (options: ToastOptions) => {
    };

    return { toast };
}
