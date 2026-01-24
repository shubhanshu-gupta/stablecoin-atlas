import { NextResponse } from 'next/server';

// Mock data simulating Unified.to response
const MOCK_JOBS = [
    {
        id: '1',
        title: 'Product Manager, Stablecoins',
        company: 'Circle',
        location: 'Singapore (Remote)',
        type: 'Product',
        tags: ['stablecoin', 'product'],
        created_at: new Date().toISOString()
    },
    {
        id: '2',
        title: 'Compliance Officer',
        company: 'Paxos',
        location: 'New York, US',
        type: 'Compliance',
        tags: ['compliance', 'vasp'],
        created_at: new Date().toISOString()
    },
    {
        id: '3',
        title: 'Rust Engineer',
        company: 'Solana Foundation',
        location: 'London, UK',
        type: 'Engineering',
        tags: ['blockchain', 'cryptography'],
        created_at: new Date().toISOString()
    },
    {
        id: '4',
        title: 'Treasury Analyst',
        company: 'Tether',
        location: 'Lugano, CH',
        type: 'Treasury',
        tags: ['finance', 'stablecoin'],
        created_at: new Date().toISOString()
    },
    {
        id: '5',
        title: 'Policy Lead',
        company: 'Coinbase',
        location: 'Washington DC, US',
        type: 'Legal',
        tags: ['policy', 'crypto compliance'],
        created_at: new Date().toISOString()
    }
];

export async function GET() {
    // In future: fetch from Unified.to 
    // const res = await fetch('https://api.unified.to/hris/jobs', {
    //   headers: { 'Authorization': `Bearer ${process.env.UNIFIED_API_KEY}` }
    // });

    return NextResponse.json(MOCK_JOBS);
}
