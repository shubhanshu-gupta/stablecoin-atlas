import { NextResponse } from 'next/server';

const THEIR_STACK_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzaHViaGFuc2h1Lmd1cHRhOTNAZ21haWwuY29tIiwicGVybWlzc2lvbnMiOiJ1c2VyIiwiY3JlYXRlZF9hdCI6IjIwMjYtMDEtMjRUMDc6NDc6MjYuNTg3MDU3KzAwOjAwIn0.LZEb4kJcl54ChgyEvvBBB-4igVSp4yNu-Q6W-mV5Q5E";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { query = "", location = "", page = 0, limit = 20 } = body;

        // Prepare keywords
        let keywords: string[] = [];
        if (query) {
            keywords = [query];
        } else {
            // Default split keywords for broader match
            keywords = ["stablecoin", "compliance", "blockchain", "crypto", "payments", "defi", "web3"];
        }

        const payload: any = {
            job_title_or: keywords,
            page,
            limit,
            posted_at_max_age_days: 60, // Widened search window
            order_by: [{ field: "date_posted", desc: true }]
        };

        if (location) {
            payload.company_location_pattern_or = [location];
        }

        const response = await fetch('https://api.theirstack.com/v1/jobs/search', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${THEIR_STACK_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`TheirStack API error: ${response.status}`);
        }

        const data = await response.json();
        const jobsList = Array.isArray(data) ? data : (data.data || data.jobs || []);

        const mappedJobs = jobsList.map((job: any) => ({
            id: job.id,
            title: job.job_title || job.title,
            company: job.company_object?.name || job.company_name || job.company || "Unknown",
            location: job.location || "Remote",
            type: job.employment_type || "Full-time",
            tags: job.technologies || [],
            url: job.url || job.display_url || "#",
            created_at: job.date_posted || new Date().toISOString()
        }));

        return NextResponse.json(mappedJobs);

    } catch (error) {
        console.error('Job Fetch Error:', error);
        return NextResponse.json([], { status: 500 });
    }
}

export async function GET() {
    return POST(new Request('https://placeholder.com', {
        method: 'POST',
        body: JSON.stringify({})
    }));
}
