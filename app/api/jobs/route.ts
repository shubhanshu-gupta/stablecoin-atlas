import { NextResponse } from 'next/server';

const THEIR_STACK_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzaHViaGFuc2h1Lmd1cHRhOTNAZ21haWwuY29tIiwicGVybWlzc2lvbnMiOiJ1c2VyIiwiY3JlYXRlZF9hdCI6IjIwMjYtMDEtMjRUMDc6NDc6MjYuNTg3MDU3KzAwOjAwIn0.LZEb4kJcl54ChgyEvvBBB-4igVSp4yNu-Q6W-mV5Q5E";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { query = "", page = 0, limit = 20 } = body;

        // Default search for stablecoin related roles if no specific query
        const searchQuery = query || "stablecoin compliance blockchain crypto payments";

        const response = await fetch('https://api.theirstack.com/v1/jobs/search', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${THEIR_STACK_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // theirstack doesn't use 'query', uses specific fields
                job_title_or: [searchQuery],
                page,
                limit,
                posted_at_max_age_days: 30 // Required field
            })
        });

        if (!response.ok) {
            throw new Error(`TheirStack API error: ${response.status}`);
        }

        const data = await response.json();

        // Map TheirStack response to our Job interface
        // Note: Actual TheirStack response structure needs to be handled carefully.
        // Assuming 'data' or 'jobs' array in response based on common patterns, 
        // but typically it returns a list directly or inside an object.
        // Let's assume standard { data: [...] } or [...] for now.
        // If the API returns a list of jobs directly:
        const jobsList = Array.isArray(data) ? data : (data.data || data.jobs || []);

        const mappedJobs = jobsList.map((job: any) => ({
            id: job.id,
            title: job.job_title || job.title,
            company: job.company_object?.name || job.company_name || job.company || "Unknown",
            location: job.location || "Remote",
            type: job.employment_type || "Full-time",
            tags: job.technologies || [], // TheirStack provides tech stack tags
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
    // Proxy GET to POST for initial load without params
    return POST(new Request('https://placeholder.com', { // dummy request
        method: 'POST',
        body: JSON.stringify({})
    }));
}
