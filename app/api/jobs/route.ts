import { NextResponse } from 'next/server';

const THEIR_STACK_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzaHViaGFuc2h1Lmd1cHRhOTNAZ21haWwuY29tIiwicGVybWlzc2lvbnMiOiJ1c2VyIiwiY3JlYXRlZF9hdCI6IjIwMjYtMDEtMjRUMDc6NDc6MjYuNTg3MDU3KzAwOjAwIn0.LZEb4kJcl54ChgyEvvBBB-4igVSp4yNu-Q6W-mV5Q5E";

// Map our role family labels to likely job title keywords
const ROLE_FAMILY_KEYWORDS: Record<string, string[]> = {
    Product: ['product manager', 'product lead', 'product owner'],
    Engineering: ['software engineer', 'backend engineer', 'frontend engineer', 'smart contract', 'solidity', 'developer'],
    Compliance: ['compliance', 'AML', 'KYC', 'VASP'],
    Legal: ['legal', 'counsel', 'regulatory affairs', 'policy'],
    BD: ['business development', 'partnerships', 'account executive', 'sales'],
    Treasury: ['treasury', 'risk', 'quantitative analyst'],
    Operations: ['operations', 'ops', 'project manager'],
    Design: ['UX', 'UI', 'design', 'product designer'],
    Data: ['data analyst', 'data engineer', 'data scientist', 'analytics'],
    Other: [],
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            query = "",
            location = "",
            page = 0,
            limit = 20,
            role_family = "",
            location_type = "",
            date_range_days = null,
        } = body;

        // Build keywords — merge query + role_family expansion
        let keywords: string[] = [];
        if (query) {
            keywords = query.split(' ').filter(Boolean);
        }
        if (role_family && ROLE_FAMILY_KEYWORDS[role_family]) {
            keywords = [...keywords, ...ROLE_FAMILY_KEYWORDS[role_family]];
        }
        if (keywords.length === 0) {
            keywords = ["stablecoin", "compliance", "blockchain", "crypto", "payments", "defi", "web3"];
        }

        const maxAge = date_range_days ?? 60;

        const payload: any = {
            job_title_or: keywords,
            page,
            limit,
            posted_at_max_age_days: maxAge,
            order_by: [{ field: "date_posted", desc: true }],
        };

        // Location filters
        if (location) {
            payload.company_location_pattern_or = [location];
        }
        if (location_type) {
            // TheirStack supports remote_or_hybrid_only for remote filter
            if (location_type === 'Remote') payload.remote = true;
        }

        const response = await fetch('https://api.theirstack.com/v1/jobs/search', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${THEIR_STACK_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
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
            role_family: role_family || inferRoleFamily(job.job_title || job.title || ''),
            tags: job.technologies || [],
            url: job.url || job.display_url || "#",
            created_at: job.date_posted || new Date().toISOString(),
        }));

        return NextResponse.json(mappedJobs);

    } catch (error) {
        console.error('Job Fetch Error:', error);
        return NextResponse.json([], { status: 500 });
    }
}

function inferRoleFamily(title: string): string {
    const t = title.toLowerCase();
    if (/product/.test(t)) return 'Product';
    if (/engineer|developer|solidity|backend|frontend|smart contract/.test(t)) return 'Engineering';
    if (/compliance|aml|kyc/.test(t)) return 'Compliance';
    if (/legal|counsel|policy/.test(t)) return 'Legal';
    if (/business development|partnerships|bd\b|sales/.test(t)) return 'BD';
    if (/treasury|risk|quant/.test(t)) return 'Treasury';
    if (/design|ux|ui/.test(t)) return 'Design';
    if (/data|analytics|scientist/.test(t)) return 'Data';
    if (/operations|ops/.test(t)) return 'Operations';
    return 'Other';
}

export async function GET() {
    return POST(new Request('https://placeholder.com', {
        method: 'POST',
        body: JSON.stringify({}),
    }));
}
