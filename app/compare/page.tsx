import React from 'react';
import { Metadata } from 'next';
import { STABLECOINS, COMPANIES } from '@/lib/data';
import { getMarketData, MarketData } from '@/lib/api/marketData';
import ComparisonTable from '@/components/compare/ComparisonTable';
import CompareSelector from '@/components/compare/CompareSelector';
import styles from '@/components/stablecoin/entity.module.css';

const BASE_URL = 'https://stablecoinatlas.app';

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const params = await searchParams;
    const coinsParam = params.coins;
    
    if (!coinsParam || typeof coinsParam !== 'string') {
        return {
            title: 'Compare Stablecoins | Stablecoin Atlas',
            description: 'Compare leading stablecoins by reserve backing, market cap, regulatory status, and more.',
            alternates: {
                canonical: `${BASE_URL}/compare`,
            }
        };
    }

    const coinIds = coinsParam.split(',').map(id => id.trim().toLowerCase());
    const validCoins = STABLECOINS.filter(c => coinIds.includes(c.id));
    
    if (validCoins.length === 0) {
        return { title: 'Compare Stablecoins | Stablecoin Atlas' };
    }

    const titleStr = validCoins.map(c => c.ticker).join(' vs ');
    const canonicalUrl = `${BASE_URL}/compare?coins=${coinIds.join(',')}`;

    return {
        title: `Compare ${titleStr} | Stablecoin Atlas`,
        description: `Compare ${titleStr} on reserve backing, attestation frequency, and regulatory compliance.`,
        alternates: {
            canonical: canonicalUrl,
        }
    };
}

export default async function ComparePage({ searchParams }: Props) {
    const params = await searchParams;
    const coinsParam = params.coins;
    
    let selectedCoins = STABLECOINS;
    if (coinsParam && typeof coinsParam === 'string') {
        const coinIds = coinsParam.split(',').map(id => id.trim().toLowerCase());
        selectedCoins = STABLECOINS.filter(c => coinIds.includes(c.id));
    } else {
        // Default to comparing the top 3 if no params are given
        selectedCoins = STABLECOINS.slice(0, 3);
    }

    // Fetch market data concurrently
    const marketDataPromises = selectedCoins.map(c => getMarketData(c.id));
    const marketDataResults = await Promise.all(marketDataPromises);

    const marketDataMap: Record<string, MarketData> = {};
    selectedCoins.forEach((coin, idx) => {
        marketDataMap[coin.id] = marketDataResults[idx];
    });

    return (
        <main className={styles.pageContainer}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 className={styles.entityName} style={{ marginBottom: '0.5rem' }}>
                    Compare Stablecoins
                </h1>
                <p className={styles.entitySummary}>
                    Analyze side-by-side differences in reserve backing, regulatory alignment, and market performance.
                </p>
            </header>

            <CompareSelector 
                allCoins={STABLECOINS.map(c => ({ id: c.id, name: c.name, ticker: c.ticker }))} 
                selectedIds={selectedCoins.map(c => c.id)} 
            />

            <ComparisonTable 
                stablecoins={selectedCoins} 
                companies={COMPANIES} 
                marketDataMap={marketDataMap} 
            />

            {/* PRD Mandated Disclaimer */}
            <div className={styles.disclaimerText} style={{ marginTop: '2rem' }}>
                <p>
                    <strong>Disclaimer:</strong> This website and all content is provided for informational and educational purposes only and does not constitute financial, investment, legal, tax, or accounting advice. 
                    Nothing on this site is an offer, solicitation, or recommendation to buy, sell, or use any cryptoasset or stablecoin. 
                    Cryptoassets can be high-risk; transfers may be irreversible; and laws vary by jurisdiction. Always do your own research and consult qualified professionals where appropriate.
                    Availability and regulatory status may change; users are responsible for compliance with local laws and platform terms.
                </p>
            </div>
        </main>
    );
}
