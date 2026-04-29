import React from 'react';
import { notFound } from 'next/navigation';
import { STABLECOINS, COMPANIES } from '@/lib/data';
import { getMarketData } from '@/lib/api/marketData';
import styles from '@/components/stablecoin/entity.module.css';
import IdentityHeader from '@/components/stablecoin/IdentityHeader';
import ReservePanel from '@/components/stablecoin/ReservePanel';
import RegulatoryAlignment from '@/components/stablecoin/RegulatoryAlignment';
import ChainSupport from '@/components/stablecoin/ChainSupport';
import MarketContext from '@/components/stablecoin/MarketContext';
import { Metadata } from 'next';

export async function generateStaticParams() {
    return STABLECOINS.map((coin) => ({
        slug: coin.id,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const slug = (await params).slug;
    const stablecoin = STABLECOINS.find(c => c.id === slug);
    
    if (!stablecoin) {
        return { title: 'Not Found' };
    }

    return {
        title: `${stablecoin.name} (${stablecoin.ticker}): Reserve Backing, Attestation & Regulatory Status | Stablecoin Atlas`,
        description: stablecoin.summary,
        openGraph: {
            title: `${stablecoin.name} (${stablecoin.ticker}) on Stablecoin Atlas`,
            description: stablecoin.summary,
            type: 'article',
        }
    };
}

export default async function StablecoinEntityPage({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;
    const stablecoin = STABLECOINS.find(c => c.id === slug);
    
    if (!stablecoin) {
        notFound();
    }

    const issuer = COMPANIES.find(c => c.id === stablecoin.issuer_company_id);
    const marketData = await getMarketData(stablecoin.id);

    // AI/LLM friendly structured data representation
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FinancialProduct',
        name: stablecoin.name,
        alternateName: stablecoin.ticker,
        description: stablecoin.summary,
        category: 'Stablecoin',
        issuer: {
            '@type': 'Organization',
            name: issuer?.name || 'Unknown',
            url: issuer?.website_url || ''
        },
        offers: {
            '@type': 'Offer',
            priceCurrency: 'USD',
            price: marketData.market_cap ? marketData.market_cap.toString() : undefined
        }
    };

    return (
        <main className={styles.pageContainer}>
            {/* JSON-LD Script for SEO and LLM parsing */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Zone 1 */}
            <IdentityHeader stablecoin={stablecoin} issuer={issuer} />

            <div className={styles.zoneGrid}>
                {/* Zone 2 */}
                <ReservePanel stablecoin={stablecoin} />
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Zone 3 */}
                    <RegulatoryAlignment stablecoin={stablecoin} />
                    
                    {/* Zone 5 */}
                    <MarketContext marketData={marketData} />
                </div>
            </div>

            {/* Zone 4 */}
            <ChainSupport stablecoin={stablecoin} />

        </main>
    );
}
