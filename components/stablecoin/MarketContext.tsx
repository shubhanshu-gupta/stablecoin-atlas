import React from 'react';
import styles from './entity.module.css';
import { MarketData } from '@/lib/api/marketData';

export default function MarketContext({ marketData }: { marketData: MarketData }) {
    const formatCurrency = (val: number | null) => {
        if (val === null) return <span className={styles.emptyState}>Data temporarily unavailable</span>;
        if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
        if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
        return `$${val.toLocaleString()}`;
    };

    const formatPct = (val: number | null) => {
        if (val === null) return <span className={styles.emptyState}>Data temporarily unavailable</span>;
        return `${val > 0 ? '+' : ''}${val.toFixed(2)}%`;
    };

    return (
        <div className={styles.card}>
            <h2 className={styles.cardTitle}>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Market Context
            </h2>

            <div className={styles.disclaimerText}>
                Market data is sourced from third-party providers (CoinGecko, DeFiLlama) and is provided for informational purposes only. It is not an offer, recommendation, or advice to buy, sell, or use any asset.
            </div>

            <div className={styles.marketGrid}>
                <div className={styles.marketKpi}>
                    <div className={styles.kpiLabel}>Market Cap (CoinGecko)</div>
                    <div className={styles.kpiValue}>{formatCurrency(marketData.market_cap)}</div>
                </div>

                <div className={styles.marketKpi}>
                    <div className={styles.kpiLabel}>24h Volume (CoinGecko)</div>
                    <div className={styles.kpiValue}>{formatCurrency(marketData.volume_24h)}</div>
                </div>

                <div className={styles.marketKpi}>
                    <div className={styles.kpiLabel}>30D Supply Change (DeFiLlama)</div>
                    <div className={`${styles.kpiValue} ${marketData.supply_change_30d && marketData.supply_change_30d > 0 ? styles.positive : marketData.supply_change_30d && marketData.supply_change_30d < 0 ? styles.negative : ''}`}>
                        {formatPct(marketData.supply_change_30d)}
                    </div>
                </div>
            </div>

            {marketData.chain_distribution.length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                    <div className={styles.kpiLabel} style={{ marginBottom: '0.75rem' }}>Chain Distribution (DeFiLlama)</div>
                    {marketData.chain_distribution.map((chain, idx) => (
                        <div key={idx} className={styles.dataRow} style={{ padding: '0.5rem 0' }}>
                            <div className={styles.dataLabel}>{chain.chain}</div>
                            <div className={styles.dataValue}>{chain.percentage.toFixed(1)}%</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
