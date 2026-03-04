import React from 'react';
import styles from './dashboard.module.css';

interface LeaderboardItem {
    id: string;
    symbol: string;
    name: string;
    pegType: string;
    marketCap: number;
    chains: number;
}

export function IssuerLeaderboard({ data }: { data: LeaderboardItem[] }) {
    const REGULATED_COINS = ['USDC', 'EURC', 'XSGD'];

    const formatCurrency = (val: number) => {
        if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`;
        if (val >= 1e6) return `$${(val / 1e6).toFixed(1)}M`;
        return `$${val.toLocaleString()}`;
    };

    const getPegIcon = (pegType: string) => {
        switch (pegType) {
            case 'peggedUSD': return '🇺🇸 USD';
            case 'peggedEUR': return '🇪🇺 EUR';
            case 'peggedSGD': return '🇸🇬 SGD';
            default: return '💱 VAR';
        }
    };

    return (
        <div className={styles.card}>
            <h3 className={styles.cardTitle} style={{ marginBottom: '1rem' }}>Issuer Leaderboard</h3>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Peg</th>
                            <th>Market Cap</th>
                            <th>Chains</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((coin, index) => (
                            <tr key={coin.id}>
                                <td>{index + 1}</td>
                                <td style={{ fontWeight: 500 }}>
                                    {coin.symbol}
                                    <span style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem', fontWeight: 400 }}>{coin.name}</span>
                                    {REGULATED_COINS.includes(coin.symbol) && (
                                        <span className={styles.regulatedBadge}>Regulated</span>
                                    )}
                                </td>
                                <td>{getPegIcon(coin.pegType)}</td>
                                <td>{formatCurrency(coin.marketCap)}</td>
                                <td>{coin.chains}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                {/* Placeholder for future expansion */}
                <span style={{ color: 'var(--primary)', cursor: 'pointer' }}>View all stablecoins &rarr;</span>
            </div>
        </div>
    );
}

export function IssuerLeaderboardSkeleton() {
    return (
        <div className={styles.card}>
            <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
            {[...Array(10)].map((_, i) => (
                <div key={i} className={`${styles.skeleton} ${styles.skeletonText}`} style={{ height: '2rem', marginBottom: '0.5rem' }} />
            ))}
        </div>
    );
}
