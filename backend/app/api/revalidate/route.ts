import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const secret = body.secret;
        const slug = body.slug;

        if (secret !== process.env.REVALIDATION_SECRET) {
            return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
        }

        if (!slug) {
            return NextResponse.json({ message: 'Slug is required' }, { status: 400 });
        }

        revalidatePath(`/[locale]/${slug}`);
        revalidatePath(`/tr/${slug}`);
        revalidatePath(`/en/${slug}`);

        return NextResponse.json({
            revalidated: true,
            slug,
            now: Date.now()
        });
    } catch (err) {
        return NextResponse.json({
            message: 'Error revalidating',
            error: err instanceof Error ? err.message : 'Unknown error'
        }, { status: 500 });
    }
}
