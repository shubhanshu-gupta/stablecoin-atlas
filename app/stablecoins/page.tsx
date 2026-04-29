import React from 'react';
import { Metadata } from 'next';
import DirectoryClient from './DirectoryClient';
import { STABLECOINS, COMPANIES, CORRIDORS } from '@/lib/data';

export const metadata: Metadata = {
    title: 'Stablecoin Directory | Stablecoin Atlas',
    description: 'Explore, compare, and filter regulated stablecoins including USDC, USDT, PYUSD, EURC, XSGD, and more. Understand their reserve backing, attestation status, and regulatory alignment.',
    openGraph: {
        title: 'Stablecoin Directory | Stablecoin Atlas',
        description: 'Explore, compare, and filter regulated stablecoins including USDC, USDT, PYUSD, EURC, XSGD, and more.',
        type: 'website',
    }
};

export default function StablecoinsDirectoryPage() {
    // LLM/AI SEO Friendly JSON-LD Dataset representation
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Dataset',
        name: 'Regulated Stablecoins Directory',
        description: 'A comprehensive directory of fiat-backed and crypto-backed stablecoins, detailing their reserve mechanisms, regulatory alignment, and chain support.',
        url: 'https://stablecoinatlas.app/stablecoins',
        keywords: ['stablecoin', 'USDC', 'USDT', 'PYUSD', 'EURC', 'XSGD', 'crypto', 'fiat-backed'],
        creator: {
            '@type': 'Organization',
            name: 'Stablecoin Atlas'
        },
        hasPart: STABLECOINS.map(coin => ({
            '@type': 'FinancialProduct',
            name: coin.name,
            alternateName: coin.ticker,
            description: coin.summary,
            url: `https://stablecoinatlas.app/stablecoins/${coin.id}`
        }))
    };

    return (
        <main>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            
            <DirectoryClient 
                stablecoins={STABLECOINS}
                companies={COMPANIES}
                corridors={CORRIDORS}
            />
        </main>
    );
}
