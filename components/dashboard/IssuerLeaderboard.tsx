import React from 'react';
import styles from './dashboard.module.css';

interface LeaderboardItem {
    id: string;
    symbol: string;
    name: string;
    pegType: string;
    marketCap: number;
    chains: number;
    price?: number;
    volume24h?: number;
    change7d?: number;
    change30d?: number;
}

export function IssuerLeaderboard({ data }: { data: LeaderboardItem[] }) {
    const [sortConfig, setSortConfig] = React.useState<{ key: keyof LeaderboardItem; direction: 'asc' | 'desc' } | null>(null);
    const [expandedRow, setExpandedRow] = React.useState<string | null>(null);

    const REGULATED_COINS = ['USDC', 'EURC', 'XSGD'];

    const formatCurrency = (val: number) => {
        if (!val) return '-';
        if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`;
        if (val >= 1e6) return `$${(val / 1e6).toFixed(1)}M`;
        return `$${val.toLocaleString()}`;
    };

    const formatPercent = (val: number | undefined | null) => {
        if (val === undefined || val === null) return '-';
        const prefix = val > 0 ? '+' : '';
        const arrow = val > 0 ? '↑' : val < 0 ? '↓' : '';
        const className = val > 0 ? styles.positiveChange : val < 0 ? styles.negativeChange : '';
        return <span className={className}>{prefix}{val.toFixed(1)}% {arrow}</span>;
    };

    const getPegIcon = (pegType: string) => {
        switch (pegType) {
            case 'peggedUSD': return '🇺🇸 USD';
            case 'peggedEUR': return '🇪🇺 EUR';
            case 'peggedSGD': return '🇸🇬 SGD';
            default: return '💱 VAR';
        }
    };

    const handleSort = (key: keyof LeaderboardItem) => {
        let direction: 'asc' | 'desc' = 'desc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = React.useMemo(() => {
        let sortableItems = [...data];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const aVal = a[sortConfig.key] || 0;
                const bVal = b[sortConfig.key] || 0;
                if (aVal < bVal) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aVal > bVal) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [data, sortConfig]);

    const SortHeader = ({ label, sortKey }: { label: string, sortKey: keyof LeaderboardItem }) => (
        <th onClick={() => handleSort(sortKey)} className={styles.sortableHeader}>
            {label}
            {sortConfig?.key === sortKey && (
                <span className={styles.sortIndicator}>
                    {sortConfig.direction === 'asc' ? '▲' : '▼'}
                </span>
            )}
        </th>
    );

    return (
        <div className={styles.card}>
            <h3 className={styles.cardTitle} style={{ marginBottom: '1rem' }}>Issuer Leaderboard</h3>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <SortHeader label="Name" sortKey="name" />
                            <th>Peg</th>
                            <SortHeader label="Market Cap" sortKey="marketCap" />
                            <SortHeader label="Volume (24h)" sortKey="volume24h" />
                            <SortHeader label="7d Chg" sortKey="change7d" />
                            <SortHeader label="30d Chg" sortKey="change30d" />
                            <SortHeader label="Chains" sortKey="chains" />
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((coin, index) => (
                            <React.Fragment key={coin.id}>
                                <tr
                                    className={styles.rowClickable}
                                    onClick={() => setExpandedRow(expandedRow === coin.id ? null : coin.id)}
                                >
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
                                    <td>{coin.volume24h ? formatCurrency(coin.volume24h) : '-'}</td>
                                    <td>{formatPercent(coin.change7d)}</td>
                                    <td>{formatPercent(coin.change30d)}</td>
                                    <td>{coin.chains}</td>
                                </tr>
                                {expandedRow === coin.id && (
                                    <tr className={styles.accordionRow}>
                                        <td colSpan={8}>
                                            <div className={styles.accordionContent}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <div>
                                                        <strong>Issuer/Deployments:</strong> Available across {coin.chains} distinct blockchain networks.
                                                    </div>
                                                    <div>
                                                        <strong>Data Source:</strong> <a href={`https://defillama.com/stablecoin/${coin.id}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none' }}>View on DeFiLlama &rarr;</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
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
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Peg</th>
                            <th>Market Cap</th>
                            <th>Volume (24h)</th>
                            <th>7d Chg</th>
                            <th>30d Chg</th>
                            <th>Chains</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(10)].map((_, i) => (
                            <tr key={i}>
                                {[...Array(8)].map((_, j) => (
                                    <td key={j}><div className={`${styles.skeleton} ${styles.skeletonText}`} /></td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
