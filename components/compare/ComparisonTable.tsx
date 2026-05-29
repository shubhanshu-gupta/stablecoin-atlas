import React from 'react';
import Link from 'next/link';
import { Stablecoin, Company } from '@/lib/types';
import { MarketData } from '@/lib/api/marketData';
import styles from './compare.module.css';

interface ComparisonTableProps {
    stablecoins: Stablecoin[];
    companies: Company[];
    marketDataMap: Record<string, MarketData>;
}

export default function ComparisonTable({ stablecoins, companies, marketDataMap }: ComparisonTableProps) {
    if (!stablecoins || stablecoins.length === 0) {
        return <div className={styles.emptyState}>No stablecoins selected for comparison.</div>;
    }

    const formatCurrency = (val: number | null | undefined) => {
        if (val == null) return 'N/A';
        if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
        if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
        return `$${val.toLocaleString()}`;
    };

    const formatPct = (val: number | null | undefined) => {
        if (val == null) return 'N/A';
        return `${val > 0 ? '+' : ''}${val.toFixed(2)}%`;
    };

    const isDifferent = (getRowValue: (coin: Stablecoin) => string) => {
        if (stablecoins.length <= 1) return false;
        const firstVal = getRowValue(stablecoins[0]);
        return stablecoins.some(coin => getRowValue(coin) !== firstVal);
    };

    const rows = [
        {
            label: 'Name',
            getValue: (c: Stablecoin) => `${c.name} (${c.ticker})`
        },
        {
            label: 'Peg Currency',
            getValue: (c: Stablecoin) => c.peg_currency
        },
        {
            label: 'Issuer',
            getValue: (c: Stablecoin) => {
                const issuer = companies.find(comp => comp.id === c.issuer_company_id);
                return issuer ? issuer.name : 'Unknown';
            }
        },
        {
            label: 'Backing Mechanism',
            getValue: (c: Stablecoin) => c.backing_description
        },
        {
            label: 'Attestation Frequency',
            getValue: (c: Stablecoin) => c.attestation_frequency.replace('_', ' ').toUpperCase()
        },
        {
            label: 'Regulatory Alignment',
            getValue: (c: Stablecoin) => {
                if (c.regulatory_alignments.length === 0) return 'None';
                return c.regulatory_alignments.map(r => `${r.jurisdiction_id.toUpperCase()}: ${r.framework}`).join(', ');
            }
        },
        {
            label: 'Chains Supported',
            getValue: (c: Stablecoin) => c.supported_chains.map(chain => chain.chain_name).join(', ')
        },
        {
            label: 'Market Cap',
            getValue: (c: Stablecoin) => formatCurrency(marketDataMap[c.id]?.market_cap)
        },
        {
            label: '30D Supply Change',
            getValue: (c: Stablecoin) => formatPct(marketDataMap[c.id]?.supply_change_30d)
        }
    ];

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.compareTable}>
                <thead>
                    <tr>
                        <th className={styles.stickyCol}>Feature</th>
                        {stablecoins.map(coin => (
                            <th key={coin.id} className={styles.coinHeader}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                                    <span>{coin.ticker}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 400 }}>{coin.name}</span>
                                    <Link
                                        href={`/stablecoins/${coin.id}`}
                                        style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--secondary)',
                                            textDecoration: 'none',
                                            fontWeight: 500,
                                        }}
                                    >
                                        View Details →
                                    </Link>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, idx) => {
                        const highlight = isDifferent(row.getValue);
                        return (
                            <tr key={idx} className={highlight ? styles.highlightRow : ''}>
                                <td className={`${styles.stickyCol} ${styles.rowLabel}`}>{row.label}</td>
                                {stablecoins.map(coin => (
                                    <td key={coin.id} className={styles.cellValue}>
                                        {row.getValue(coin)}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
