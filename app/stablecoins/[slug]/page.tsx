import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { STABLECOINS, COMPANIES, CORRIDORS } from '@/lib/data';
import { getMarketData } from '@/lib/api/marketData';
import styles from '@/components/stablecoin/entity.module.css';
import IdentityHeader from '@/components/stablecoin/IdentityHeader';
import ReservePanel from '@/components/stablecoin/ReservePanel';
import RegulatoryAlignment from '@/components/stablecoin/RegulatoryAlignment';
import ChainSupport from '@/components/stablecoin/ChainSupport';
import MarketContext from '@/components/stablecoin/MarketContext';
import NotableEvents from '@/components/stablecoin/NotableEvents';
import RelatedNews from '@/components/stablecoin/RelatedNews';
import UsedInCorridors, { computeRelevantCorridors } from '@/components/stablecoin/UsedInCorridors';
import { Metadata } from 'next';

const BASE_URL = 'https://stablecoinatlas.app';
const STALE_THRESHOLD_DAYS = 60;

function daysSince(dateStr: string): number {
    const then = new Date(dateStr).getTime();
    const now = Date.now();
    return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

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

    const canonicalUrl = `${BASE_URL}/stablecoins/${slug}`;

    return {
        title: `${stablecoin.name} (${stablecoin.ticker}): Reserve Backing, Attestation & Regulatory Status | Stablecoin Atlas`,
        description: stablecoin.summary,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: `${stablecoin.name} (${stablecoin.ticker}) on Stablecoin Atlas`,
            description: stablecoin.summary,
            type: 'article',
            url: canonicalUrl,
        },
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
    const relevantCorridors = computeRelevantCorridors(stablecoin, CORRIDORS);
    const isStale = daysSince(stablecoin.last_verified_at) > STALE_THRESHOLD_DAYS;
    const canonicalUrl = `${BASE_URL}/stablecoins/${slug}`;

    // FinancialProduct structured data
    const financialProductJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FinancialProduct',
        name: stablecoin.name,
        alternateName: stablecoin.ticker,
        description: stablecoin.summary,
        category: 'Stablecoin',
        url: canonicalUrl,
        issuer: {
            '@type': 'Organization',
            name: issuer?.name ?? 'Unknown',
            url: issuer?.website_url ?? '',
        },
        offers: {
            '@type': 'Offer',
            priceCurrency: 'USD',
            price: marketData.market_cap ? marketData.market_cap.toString() : undefined,
        },
    };

    // BreadcrumbList structured data
    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Stablecoins',
                item: `${BASE_URL}/stablecoins`,
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: `${stablecoin.name} (${stablecoin.ticker})`,
                item: canonicalUrl,
            },
        ],
    };

    return (
        <main className={styles.pageContainer}>
            {/* Structured data: FinancialProduct */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(financialProductJsonLd) }}
            />
            {/* Structured data: BreadcrumbList */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />

            {/* Staleness banner */}
            {isStale && (
                <div className={styles.stalenessBanner} role="alert">
                    <span aria-hidden="true">⚠️</span>
                    This page is due for review. Data may not reflect the latest developments.
                </div>
            )}

            {/* Visual breadcrumb */}
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                <Link href="/stablecoins" className={styles.breadcrumbLink}>
                    Stablecoins
                </Link>
                <span className={styles.breadcrumbSeparator} aria-hidden="true">›</span>
                <span className={styles.breadcrumbCurrent}>
                    {stablecoin.name} ({stablecoin.ticker})
                </span>
            </nav>

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

            {/* Zone 6 */}
            <NotableEvents stablecoin={stablecoin} />

            {/* Contextual panels */}
            <div className={styles.zoneGrid}>
                <UsedInCorridors stablecoin={stablecoin} relevantCorridors={relevantCorridors} />
                <RelatedNews ticker={stablecoin.ticker} name={stablecoin.name} />
            </div>
        </main>
    );
}
