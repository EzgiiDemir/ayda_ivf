// User Types
export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'editor' | 'user';
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

// Page Types
export interface Page {
    id: number;
    title: string;
    slug: string;
    content: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    featuredImage?: string;
    status: 'published' | 'draft';
    authorId: number;
    author?: User;
    createdAt: string;
    updatedAt: string;
}

export interface PageFormData {
    title: string;
    slug: string;
    content: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    featuredImage?: string;
    status: 'published' | 'draft';
}

// Media Types
export interface MediaFile {
    id: number;
    name: string;
    url: string;
    path: string;
    mimeType: string;
    size: number;
    uploadedBy: number;
    uploader?: User;
    createdAt: string;
    updatedAt: string;
}

export interface MediaUploadResponse {
    files: MediaFile[];
    message: string;
}

// Settings Types
export interface SiteSettings {
    siteName: string;
    siteDescription: string;
    siteUrl: string;
    adminEmail: string;
    logo?: string;
    favicon?: string;
    timezone: string;
    language: string;
}

export interface SeoSettings {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    googleAnalytics?: string;
    googleSearchConsole?: string;
    robotsTxt?: string;
    sitemapUrl?: string;
}

export interface SocialSettings {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
    pinterest?: string;
}

export interface Settings {
    site: SiteSettings;
    seo: SeoSettings;
    social: SocialSettings;
}

// Dashboard Types
export interface DashboardStats {
    totalPages: number;
    publishedPages: number;
    draftPages: number;
    totalMedia: number;
    totalVisits: number;
    activeUsers: number;
}

export interface RecentActivity {
    id: number;
    type: 'page_created' | 'page_updated' | 'media_uploaded' | 'settings_updated';
    title: string;
    description: string;
    userId: number;
    user?: User;
    createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        perPage: number;
        currentPage: number;
        lastPage: number;
        from: number;
        to: number;
    };
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
}

// Filter & Search Types
export interface PageFilters {
    search?: string;
    status?: 'all' | 'published' | 'draft';
    authorId?: number;
    sortBy?: 'title' | 'createdAt' | 'updatedAt';
    sortOrder?: 'asc' | 'desc';
}

export interface MediaFilters {
    search?: string;
    type?: 'all' | 'image' | 'video' | 'document';
    sortBy?: 'name' | 'size' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}

// Form Validation Types
export interface ValidationError {
    field: string;
    message: string;
}

export interface FormErrors {
    [key: string]: string | undefined;
}