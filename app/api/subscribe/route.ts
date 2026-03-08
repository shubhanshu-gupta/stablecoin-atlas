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
            // Keys not configured — log server-side but return a graceful success to UX
            console.error('[subscribe] Missing Beehiiv credentials — returning mock success');
            return NextResponse.json({ success: true, message: 'Subscribed successfully' }, { status: 200 });
        }

        const beehiivRes = await fetch(`https://api.beehiiv.com/v2/publications/${PUB_ID}/subscriptions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                reactivate_existing: false,
                send_welcome_email: false,
                utm_source: 'stablecoinatlas.app',
                utm_medium: 'website',
                utm_campaign: source || 'unknown'
            }),
        });

        if (beehiivRes.status === 201 || beehiivRes.status === 200) {
            return NextResponse.json({ success: true, message: 'Subscribed successfully' }, { status: beehiivRes.status });
        }

        if (beehiivRes.status === 400 || beehiivRes.status === 422) {
            return NextResponse.json({ success: false, message: 'Please enter a valid email address' }, { status: 422 });
        }

        console.error('Beehiiv API Error:', beehiivRes.status, await beehiivRes.text());
        return NextResponse.json({ success: false, message: 'Something went wrong. Try again.' }, { status: 500 });

    } catch (error) {
        console.error('Subscription error:', error);
        return NextResponse.json({ success: false, message: 'Something went wrong. Try again.' }, { status: 500 });
    }
}
