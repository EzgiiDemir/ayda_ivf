import type {
    ApiResponse,
    AuthResponse,
    Page,
    PageFormData,
    MediaFile,
    Settings,
    DashboardStats,
    PaginatedResponse
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

const handleApiError = async (response: Response): Promise<never> => {
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
        const error = await response.json();
        throw new Error(error.message || 'Bir hata oluştu');
    }

    throw new Error(`HTTP Error: ${response.status}`);
};

async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getAuthToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        await handleApiError(response);
    }

    return response.json();
}

export const authApi = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
        return apiRequest<AuthResponse>('/api/auth/login', {  // ✅ /api/ (küçük harf)
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    },

    register: async (data: {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
    }): Promise<AuthResponse> => {
        return apiRequest<AuthResponse>('/api/auth/register', {  // ✅ /api/
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    logout: async (): Promise<void> => {
        return apiRequest<void>('/api/auth/logout', {  // ✅ /api/
            method: 'POST',
        });
    },

    me: async (): Promise<ApiResponse<any>> => {
        return apiRequest<ApiResponse<any>>('/api/auth/me');  // ✅ /api/
    },
};

export const pagesApi = {
    getAll: async (params?: Record<string, any>): Promise<PaginatedResponse<Page>> => {
        const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
        return apiRequest<PaginatedResponse<Page>>(`/api/pages${queryString}`);
    },

    getById: async (id: number): Promise<ApiResponse<Page>> => {
        return apiRequest<ApiResponse<Page>>(`/api/pages/${id}`);
    },

    create: async (data: PageFormData): Promise<ApiResponse<Page>> => {
        return apiRequest<ApiResponse<Page>>('/api/pages', {  // ✅ /api/
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    update: async (id: number, data: PageFormData): Promise<ApiResponse<Page>> => {
        return apiRequest<ApiResponse<Page>>(`/api/pages/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    delete: async (id: number): Promise<ApiResponse<null>> => {
        return apiRequest<ApiResponse<null>>(`/api/pages/${id}`, {
            method: 'DELETE',
        });
    },

    bulkDelete: async (ids: number[]): Promise<ApiResponse<null>> => {
        return apiRequest<ApiResponse<null>>('/api/pages/bulk-delete', {  // ✅ /api/
            method: 'POST',
            body: JSON.stringify({ ids }),
        });
    },
};

export const mediaApi = {
    getAll: async (params?: Record<string, any>): Promise<PaginatedResponse<MediaFile>> => {
        const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
        return apiRequest<PaginatedResponse<MediaFile>>(`/api/media${queryString}`);
    },

    upload: async (files: FileList | File[]): Promise<ApiResponse<MediaFile[]>> => {
        const formData = new FormData();
        Array.from(files).forEach((file) => {
            formData.append('files[]', file);
        });

        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/api/media/upload`, {
            method: 'POST',
            headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: formData,
        });

        if (!response.ok) {
            await handleApiError(response);
        }

        return response.json();
    },

    delete: async (id: number): Promise<ApiResponse<null>> => {
        return apiRequest<ApiResponse<null>>(`/api/media/${id}`, {
            method: 'DELETE',
        });
    },

    bulkDelete: async (ids: number[]): Promise<ApiResponse<null>> => {
        return apiRequest<ApiResponse<null>>('/api/media/bulk-delete', {  // ✅ /api/
            method: 'POST',
            body: JSON.stringify({ ids }),
        });
    },
};

export const settingsApi = {
    getAll: async (): Promise<ApiResponse<Settings>> => {
        return apiRequest<ApiResponse<Settings>>('/api/settings');  // ✅ /api/
    },

    updateGeneral: async (data: Partial<Settings['site']>): Promise<ApiResponse<Settings>> => {
        return apiRequest<ApiResponse<Settings>>('/api/settings/general', {  // ✅ /api/
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    updateSeo: async (data: Partial<Settings['seo']>): Promise<ApiResponse<Settings>> => {
        return apiRequest<ApiResponse<Settings>>('/api/settings/seo', {  // ✅ /api/
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    updateSocial: async (data: Partial<Settings['social']>): Promise<ApiResponse<Settings>> => {
        return apiRequest<ApiResponse<Settings>>('/api/settings/social', {  // ✅ /api/
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
};

export const dashboardApi = {
    getStats: async (): Promise<ApiResponse<DashboardStats>> => {
        return apiRequest<ApiResponse<DashboardStats>>('/api/dashboard/stats');  // ✅ /api/
    },

    getRecentPages: async (limit: number = 5): Promise<ApiResponse<Page[]>> => {
        return apiRequest<ApiResponse<Page[]>>(`/api/dashboard/recent-pages?limit=${limit}`);
    },

    getRecentActivity: async (limit: number = 10): Promise<ApiResponse<any[]>> => {
        return apiRequest<ApiResponse<any[]>>(`/api/dashboard/recent-activity?limit=${limit}`);
    },
};

export default {
    auth: authApi,
    pages: pagesApi,
    media: mediaApi,
    settings: settingsApi,
    dashboard: dashboardApi,
};