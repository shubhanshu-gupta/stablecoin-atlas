import React from 'react';
import styles from './dashboard.module.css';

interface KPIStripProps {
    data: {
        totalSupply: number;
        supplyChange7d: number;
        numStablecoins: number;
        supplyChange30d: number;
        topIssuerShare: number;
        topIssuerName: string;
        activeChainsCount: number;
    };
}

export function KPIStrip({ data }: KPIStripProps) {
    const formatCurrency = (val: number) => {
        if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`;
        if (val >= 1e6) return `$${(val / 1e6).toFixed(1)}M`;
        return `$${val.toLocaleString()}`;
    };

    const formatDelta = (val: number, label: string) => {
        const isPos = val > 0.05;
        const isNeg = val < -0.05;
        const sign = isPos ? '↑ +' : isNeg ? '↓ ' : '';
        const badgeClass = isPos ? styles.badgePositive : isNeg ? styles.badgeNegative : styles.badgeNeutral;

        return (
            <span className={`${styles.badge} ${badgeClass}`}>
                {sign}{val.toFixed(1)}% ({label})
            </span>
        );
    };

    return (
        <div className={styles.kpiStrip}>
            {/* Total Supply */}
            <div className={styles.card}>
                <h3 className={styles.cardTitle}>Total Supply</h3>
                <p className={styles.kpiValue}>{formatCurrency(data.totalSupply)}</p>
                <div>{formatDelta(data.supplyChange7d, '7d')}</div>
            </div>

            {/* Number of Stablecoins */}
            <div className={styles.card}>
                <h3 className={styles.cardTitle}># Stablecoins</h3>
                <p className={styles.kpiValue}>{data.numStablecoins}</p>
                <div>
                    {/* PRD says vs 30d diff. Our API returns general 30d supply change here as proxy, or we can just say neutral for MVP */}
                    <span className={`${styles.badge} ${styles.badgeNeutral}`}>
                        Tracked by DeFiLlama
                    </span>
                </div>
            </div>

            {/* Largest Issuer Share */}
            <div className={styles.card}>
                <h3 className={styles.cardTitle}>Top Issuer Share</h3>
                <p className={styles.kpiValue}>{data.topIssuerName} {data.topIssuerShare.toFixed(1)}%</p>
                <div>
                    <span className={`${styles.badge} ${styles.badgeNeutral}`}>
                        Of Total Supply
                    </span>
                </div>
            </div>

            {/* Active Chains */}
            <div className={styles.card}>
                <h3 className={styles.cardTitle}>Active Chains</h3>
                <p className={styles.kpiValue}>{data.activeChainsCount}</p>
                <div>
                    <span className={`${styles.badge} ${styles.badgeNeutral}`}>
                        &gt;$100M supply
                    </span>
                </div>
            </div>
        </div>
    );
}

export function KPIStripSkeleton() {
    return (
        <div className={styles.kpiStrip}>
            {[...Array(4)].map((_, i) => (
                <div key={i} className={styles.card}>
                    <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
                    <div className={`${styles.skeleton} ${styles.skeletonChart}`} style={{ height: '2.5rem', marginBottom: '1rem' }} />
                    <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '40%' }} />
                </div>
            ))}
        </div>
    );
}
