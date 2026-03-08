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
            console.error('Missing Beehiiv API keys');
            // For development/testing, if keys are missing we can mock success to unblock UI testing
            if (process.env.NODE_ENV === 'development') {
                console.log('Mocking Beehiiv subscribe success for', email);
                return NextResponse.json({ success: true, message: 'Mock success' }, { status: 201 });
            }
            return NextResponse.json({ success: false, message: 'Server configuration error' }, { status: 500 });
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
