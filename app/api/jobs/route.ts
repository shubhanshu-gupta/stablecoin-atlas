import { NextResponse } from 'next/server';

// ─── Greenhouse job board companies (free, no API key) ────────────────────────
// Per PRD §2.2: prioritise crypto/stablecoin-adjacent companies
const GREENHOUSE_COMPANIES = [
    { slug: 'coinbase', name: 'Coinbase' },
    { slug: 'ripple', name: 'Ripple' },
    { slug: 'gemini', name: 'Gemini' },
    { slug: 'figment', name: 'Figment' },
    { slug: 'stripe', name: 'Stripe' },
];

// ─── Domain keyword filter (PRD Group 1) ─────────────────────────────────────
const DOMAIN_KEYWORDS = [
    'stablecoin', 'blockchain', 'crypto', 'digital asset', 'vasp',
    'virtual asset', 'web3', 'defi', 'tokeniz', 'tokenis', 'on-chain',
    'payments', 'fintech', 'cbdc', 'custody', 'wallet',
];

// These company names are always relevant regardless of title keywords
const ALWAYS_RELEVANT_COMPANIES = new Set(['Ripple', 'Gemini', 'Figment', 'Coinbase']);

// ─── Role family inference ────────────────────────────────────────────────────
const ROLE_FAMILY_MAP: Array<{ pattern: RegExp; family: string }> = [
    { pattern: /product\s*(manager|lead|owner|director)/i, family: 'Product' },
    { pattern: /engineer|developer|solidity|backend|frontend|smart\s*contract|full[\s-]?stack|devops|sre|infrastructure|platform/i, family: 'Engineering' },
    { pattern: /compliance|aml|kyc|sanctions|mlro|bsa/i, family: 'Compliance' },
    { pattern: /legal|counsel|attorney|policy|regulatory|paralegal/i, family: 'Legal' },
    { pattern: /business\s*dev|bd\b|partnerships|account\s*(executive|manager)|sales\s*(manager|lead)/i, family: 'BD' },
    { pattern: /treasury|risk|quant|financial\s*(analyst|controller|planning)|fp&a|controller/i, family: 'Treasury' },
    { pattern: /operat|program\s*manager|project\s*manager|customer\s*success|support/i, family: 'Operations' },
    { pattern: /design|ux|ui\b|user\s*experi|graphic|brand/i, family: 'Design' },
    { pattern: /data\s*(analyst|engineer|scientist|warehouse)|analytics|ml\b|machine\s*learning|bi\b|business\s*intelligence/i, family: 'Data' },
];

function inferRoleFamily(title: string): string {
    for (const { pattern, family } of ROLE_FAMILY_MAP) {
        if (pattern.test(title)) return family;
    }
    return 'Other';
}

function isDomainRelevant(title: string, companyName: string): boolean {
    if (ALWAYS_RELEVANT_COMPANIES.has(companyName)) return true;
    const lower = title.toLowerCase();
    return DOMAIN_KEYWORDS.some(kw => lower.includes(kw));
}

interface GreenhouseJob {
    id: number;
    title: string;
    updated_at: string;
    location: { name: string };
    absolute_url: string;
    departments: Array<{ name: string }>;
}

interface MappedJob {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    role_family: string;
    tags: string[];
    url: string;
    created_at: string;
    source: string;
}

async function fetchGreenhouseJobs(slug: string, companyName: string): Promise<MappedJob[]> {
    try {
        const res = await fetch(
            `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs`,
            { next: { revalidate: 3600 } }   // cache 1 hour per Next.js fetch
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const jobs: GreenhouseJob[] = data.jobs ?? [];

        return jobs
            .filter(j => isDomainRelevant(j.title, companyName))
            .map(j => ({
                id: `gh-${slug}-${j.id}`,
                title: j.title,
                company: companyName,
                location: j.location?.name ?? 'Remote',
                type: 'Full-time',
                role_family: inferRoleFamily(j.title),
                tags: (j.departments ?? []).map((d: { name: string }) => d.name).filter(Boolean).slice(0, 3),
                url: j.absolute_url,
                created_at: j.updated_at ?? new Date().toISOString(),
                source: 'Greenhouse',
            }));
    } catch (err) {
        console.error(`Greenhouse fetch failed for ${slug}:`, err);
        return [];
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        const {
            query = '',
            location = '',
            role_family = '',
            location_type = '',
            date_range_days = null,
        } = body;

        // Fetch all Greenhouse boards in parallel
        const results = await Promise.all(
            GREENHOUSE_COMPANIES.map(c => fetchGreenhouseJobs(c.slug, c.name))
        );
        let jobs = results.flat();

        // Deduplicate by URL
        const seen = new Set<string>();
        jobs = jobs.filter(j => {
            if (seen.has(j.url)) return false;
            seen.add(j.url);
            return true;
        });

        // Apply client-requested filters
        if (query) {
            const q = query.toLowerCase();
            jobs = jobs.filter(j =>
                j.title.toLowerCase().includes(q) ||
                j.company.toLowerCase().includes(q) ||
                j.role_family.toLowerCase().includes(q) ||
                j.tags.some((t: string) => t.toLowerCase().includes(q))
            );
        }
        if (role_family) {
            jobs = jobs.filter(j => j.role_family === role_family);
        }
        if (location) {
            const loc = location.toLowerCase();
            jobs = jobs.filter(j => j.location.toLowerCase().includes(loc));
        }
        if (location_type === 'Remote') {
            jobs = jobs.filter(j => j.location.toLowerCase().includes('remote'));
        } else if (location_type === 'On-site') {
            jobs = jobs.filter(j => !j.location.toLowerCase().includes('remote'));
        }
        if (date_range_days) {
            const cutoff = Date.now() - date_range_days * 86_400_000;
            jobs = jobs.filter(j => new Date(j.created_at).getTime() >= cutoff);
        }

        // Sort newest first
        jobs.sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        return NextResponse.json(jobs.slice(0, 60));
    } catch (error) {
        console.error('Jobs API error:', error);
        return NextResponse.json([], { status: 500 });
    }
}

export async function GET() {
    return POST(
        new Request('https://placeholder.com', {
            method: 'POST',
            body: JSON.stringify({}),
        })
    );
}
