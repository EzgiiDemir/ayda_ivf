export interface PageFormData {
    title: string
    subtitle: string
    slug: string
    content: string
    metaTitle: string
    metaDescription: string
    status: 'published' | 'draft'
    heroImage: string
}