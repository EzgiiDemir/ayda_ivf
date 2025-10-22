import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface PageContent {
    id: number;
    title: string;
    subtitle: string;
    content: string;
    heroImage: string;
    metaTitle?: string;
    metaDescription?: string;
    slug: string;
    status: string;
}

// ✅ Server-side data fetching
async function getPageContent(slug: string, locale: string): Promise<PageContent | null> {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

        console.log('🔍 Fetching:', `${apiUrl}/api/pages/slug/${slug}?locale=${locale}`);

        const response = await fetch(`${apiUrl}/api/pages/slug/${slug}?locale=${locale}`, {
            next: { revalidate: 60 },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });

        console.log('📡 Response status:', response.status);

        if (!response.ok) return null;

        const data = await response.json();
        console.log('✅ Data received:', data);

        return data.success ? data.data : null;
    } catch (error) {
        console.error('❌ Page fetch error:', error);
        return null;
    }
}

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string; locale: string }> }
): Promise<Metadata> {
    const { slug, locale } = await params;

    const pageContent = await getPageContent(slug, locale);

    if (!pageContent) {
        return {
            title: 'Sayfa Bulunamadı',
            description: 'Aradığınız sayfa bulunamadı'
        };
    }

    return {
        title: pageContent.metaTitle || pageContent.title,
        description: pageContent.metaDescription || pageContent.subtitle,
        openGraph: {
            title: pageContent.metaTitle || pageContent.title,
            description: pageContent.metaDescription || pageContent.subtitle,
            images: [pageContent.heroImage],
        },
    };
}

export default async function SlugPage({
                                           params
                                       }: {
    params: Promise<{ slug: string; locale: string }>
}) {
    const { slug, locale } = await params;

    console.log('📄 Loading page:', slug, locale);

    const pageContent = await getPageContent(slug, locale);

    if (!pageContent) {
        console.log('❌ Page not found:', slug, locale);
        notFound();
    }

    return (
        <main className="w-full">
            {/* Hero Section */}
            <section className="w-full relative h-[60vh]">
                <Image
                    src={pageContent.heroImage}
                    alt={pageContent.title}
                    fill
                    className="object-cover w-full h-full"
                    priority
                    unoptimized
                />
                <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-white p-4">
                    <h1 className="text-3xl md:text-5xl font-bold mb-2 text-center">
                        {pageContent.title}
                    </h1>
                    <p className="text-lg md:text-2xl text-center">
                        {pageContent.subtitle}
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="max-w-5xl mx-auto px-4 py-12">
                <div
                    className="prose prose-lg max-w-none text-gray-800"
                    dangerouslySetInnerHTML={{ __html: pageContent.content }}
                />
            </section>
        </main>
    );
}