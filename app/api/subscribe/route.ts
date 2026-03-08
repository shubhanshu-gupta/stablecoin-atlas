import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { email, source } = await request.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ success: false, message: 'Please enter a valid email address' }, { status: 422 });
        }

        const API_KEY = process.env.BEEHIIV_API_KEY;
        const PUB_ID = process.env.BEEHIIV_PUBLICATION_ID;

        if (!API_KEY || !PUB_ID) {
            console.error('[subscribe] Missing Beehiiv credentials — returning mock success');
            return NextResponse.json({ success: true, message: 'Subscribed successfully' }, { status: 200 });
        }

        const payload = {
            email,
            reactivate_existing: true,
            send_welcome_email: true,
            utm_source: 'stablecoinatlas.app',
            utm_medium: 'website',
            utm_campaign: source || 'website',
        };

        console.log('[subscribe] Sending to Beehiiv:', { email, source, PUB_ID: PUB_ID.slice(0, 8) + '…' });

        const beehiivRes = await fetch(`https://api.beehiiv.com/v2/publications/${PUB_ID}/subscriptions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const responseText = await beehiivRes.text();
        console.log('[subscribe] Beehiiv response:', beehiivRes.status, responseText);

        if (beehiivRes.status === 201 || beehiivRes.status === 200) {
            return NextResponse.json({ success: true, message: 'Subscribed successfully' });
        }

        // Parse error body if possible
        let beehiivError = responseText;
        try {
            const parsed = JSON.parse(responseText);
            beehiivError = parsed.message || parsed.errors?.join(', ') || responseText;
        } catch { /* not JSON */ }

        if (beehiivRes.status === 422) {
            return NextResponse.json({ success: false, message: 'Please check your email address and try again.' }, { status: 422 });
        }

        if (beehiivRes.status === 401 || beehiivRes.status === 403) {
            console.error('[subscribe] Beehiiv auth error:', beehiivError);
            return NextResponse.json({ success: false, message: 'Subscription service unavailable. Try again later.' }, { status: 503 });
        }

        console.error('[subscribe] Beehiiv unexpected error:', beehiivRes.status, beehiivError);
        return NextResponse.json({ success: false, message: 'Something went wrong. Try again.' }, { status: 500 });

    } catch (error) {
        console.error('[subscribe] Unexpected error:', error);
        return NextResponse.json({ success: false, message: 'Something went wrong. Try again.' }, { status: 500 });
    }
}
