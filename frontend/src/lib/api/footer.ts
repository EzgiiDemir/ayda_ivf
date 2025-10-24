import { cache } from 'react';
import { DEFAULT_FOOTER_CONFIG, FooterApiResponse, FooterConfig } from '@/src/types/footer';
import { fetchWithRetry, getStrapiMediaUrl } from '@/src/lib/utils/api-helpers';

type NextFetchOptions = RequestInit & {
    next?: {
        revalidate?: number;
        tags?: string[];
    };
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';
const REVALIDATE_TIME_RAW = Number(process.env.FOOTER_REVALIDATE_TIME ?? '3600');
const REVALIDATE_TIME = Number.isFinite(REVALIDATE_TIME_RAW) ? REVALIDATE_TIME_RAW : 3600;

const asArray = <T = unknown>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

const media = (input: any): string | undefined => {
    const url = getStrapiMediaUrl(input);
    return url && url.length > 0 ? url : undefined;
};

export const getFooterConfig = cache(async (locale: string): Promise<FooterConfig> => {
    try {
        if (!API_URL) {
            console.warn('[Footer] NEXT_PUBLIC_API_URL not set — returning DEFAULT_FOOTER_CONFIG');
            return DEFAULT_FOOTER_CONFIG;
        }

        const url = `${API_URL}/api/footer?locale=${encodeURIComponent(locale)}&populate=deep`;

        const res = await fetchWithRetry(
            url,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(process.env.API_TOKEN ? { Authorization: `Bearer ${process.env.API_TOKEN}` } : {}),
                },
                next: {
                    revalidate: REVALIDATE_TIME,
                    tags: [`footer-${locale}`],
                },
            } as NextFetchOptions,
            0
        );

        if (!res || !res.ok) {
            console.error(`[Footer] Footer API error: ${res ? `${res.status} ${res.statusText}` : 'no response'}`);
            return DEFAULT_FOOTER_CONFIG;
        }

        const data = (await res.json()) as FooterApiResponse;

        return transformFooterData(data);
    } catch (error) {
        console.error('[Footer] Error fetching footer config:', error);
        return DEFAULT_FOOTER_CONFIG;
    }
});

function transformFooterData(payload: FooterApiResponse): FooterConfig {
    try {
        const attrs = payload?.data?.attributes ?? ({} as any);

        const social = asArray<any>(attrs?.contact?.socialLinks)
            .filter((link) => link?.isActive !== false)
            .map((link) => ({
                ...link,
                url: link?.url || '#',
            }));

        const quickLinks = asArray<any>(attrs?.quickAccess?.links)
            .filter((l) => l?.isActive !== false)
            .sort((a, b) => ((a?.order ?? 0) - (b?.order ?? 0)));

        return {
            address: {
                icon: media(attrs?.address?.icon) ?? DEFAULT_FOOTER_CONFIG.address.icon,
                isoLogo: media(attrs?.address?.isoLogo) ?? DEFAULT_FOOTER_CONFIG.address.isoLogo,
                text: attrs?.address?.text ?? DEFAULT_FOOTER_CONFIG.address.text,
            },
            contact: {
                icon: media(attrs?.contact?.icon) ?? DEFAULT_FOOTER_CONFIG.contact.icon,
                phone: attrs?.contact?.phone ?? DEFAULT_FOOTER_CONFIG.contact.phone,
                phoneLink: attrs?.contact?.phoneLink ?? DEFAULT_FOOTER_CONFIG.contact.phoneLink,
                email: attrs?.contact?.email ?? DEFAULT_FOOTER_CONFIG.contact.email,
                emailLink: attrs?.contact?.emailLink ?? DEFAULT_FOOTER_CONFIG.contact.emailLink,
                socialLinks: social,
            },
            quickAccess: {
                icon: media(attrs?.quickAccess?.icon) ?? DEFAULT_FOOTER_CONFIG.quickAccess.icon,
                links: quickLinks,
            },
            copyrightLogo:
                media(attrs?.copyrightLogo?.data?.attributes?.url) ??
                DEFAULT_FOOTER_CONFIG.copyrightLogo,
            copyrightText:
                attrs?.copyrightText ?? DEFAULT_FOOTER_CONFIG.copyrightText,
        };
    } catch (err) {
        console.error('[Footer] transformFooterData error:', err);
        return DEFAULT_FOOTER_CONFIG;
    }
}
