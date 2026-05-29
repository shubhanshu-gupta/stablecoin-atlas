'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './directory.module.css';
import { Stablecoin, Company, Corridor } from '@/lib/types';

interface Props {
    stablecoins: Stablecoin[];
    companies: Company[];
    corridors: Corridor[];
}

// Map ticker to local image
const getLocalLogoUrl = (ticker: string) => {
    return `/images/coins/${ticker.toLowerCase()}.png`;
};

const formatBadge = (badge: string) => {
    if (badge === 'ATTESTATION_OR_AUDIT_LINKED') return 'Attestation Linked';
    return badge.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
};

export default function DirectoryClient({ stablecoins, companies, corridors }: Props) {
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [pegFilter, setPegFilter] = useState<string>('All');
    const [badgeFilter, setBadgeFilter] = useState<string>('All');
    const [corridorFilter, setCorridorFilter] = useState<string>('All');

    const filteredCoins = useMemo(() => {
        let result = stablecoins;

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(c => c.name.toLowerCase().includes(q) || c.ticker.toLowerCase().includes(q));
        }

        if (pegFilter !== 'All') {
            result = result.filter(c => c.peg_currency === pegFilter);
        }

        if (badgeFilter !== 'All') {
            result = result.filter(c => c.badges.includes(badgeFilter));
        }

        if (corridorFilter !== 'All') {
            const corridor = corridors.find(c => c.id === corridorFilter);
            if (corridor) {
                const mapJurisdictionToCurrency = (jur: string) => {
                    switch (jur.toLowerCase()) {
                        case 'sg': return 'SGD';
                        case 'uk': return 'GBP';
                        case 'eu': return 'EUR';
                        case 'us': return 'USD';
                        default: return null;
                    }
                };
                
                const sourceCurrency = mapJurisdictionToCurrency(corridor.source_jurisdiction_id);
                const targetCurrency = mapJurisdictionToCurrency(corridor.target_jurisdiction_id);
                
                result = result.filter(c => 
                    c.peg_currency === sourceCurrency || 
                    c.peg_currency === targetCurrency ||
                    (c.regulatory_alignments && c.regulatory_alignments.some(ra => ra.jurisdiction_id === corridor.source_jurisdiction_id || ra.jurisdiction_id === corridor.target_jurisdiction_id))
                );
            }
        }

        // Sort by badge completeness (number of badges) descending, then alphabetical (since we don't have live market cap here for sorting easily, we sort by badge count)
        result.sort((a, b) => {
            if (b.badges.length !== a.badges.length) {
                return b.badges.length - a.badges.length;
            }
            return a.name.localeCompare(b.name);
        });

        return result;
    }, [stablecoins, searchQuery, pegFilter, badgeFilter, corridorFilter, corridors]);

    const getLogoUrl = (ticker: string) => {
        return getLocalLogoUrl(ticker);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 className={styles.title}>Stablecoin Directory</h1>
                    <p className={styles.subtitle}>Explore and compare regulated stablecoins.</p>
                </div>
                <Link 
                    href="/compare" 
                    style={{ 
                        padding: '0.5rem 1rem', 
                        background: 'var(--primary)', 
                        color: '#000', 
                        borderRadius: 'var(--radius-sm)', 
                        textDecoration: 'none', 
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Compare Stablecoins
                </Link>
            </header>

            <div className={styles.controls}>
                <input 
                    type="text" 
                    placeholder="Search by name or ticker..." 
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <select className={styles.select} value={pegFilter} onChange={(e) => setPegFilter(e.target.value)}>
                    <option value="All">All Pegs</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="SGD">SGD</option>
                    <option value="GBP">GBP</option>
                </select>

                <select className={styles.select} value={badgeFilter} onChange={(e) => setBadgeFilter(e.target.value)}>
                    <option value="All">All Badges</option>
                    <option value="REGULATED_FRAMEWORK_ALIGNED">Regulated Framework</option>
                    <option value="REDEMPTION_POLICY_DISCLOSED">Redemption Disclosed</option>
                    <option value="ATTESTATION_OR_AUDIT_LINKED">Attestation Linked</option>
                </select>

                <select className={styles.select} value={corridorFilter} onChange={(e) => setCorridorFilter(e.target.value)}>
                    <option value="All">All Corridors</option>
                    {corridors && corridors.map(c => (
                        <option key={c.id} value={c.id}>{c.description}</option>
                    ))}
                </select>

                <div className={styles.viewToggle}>
                    <button 
                        className={`${styles.toggleBtn} ${viewMode === 'grid' ? styles.active : ''}`}
                        onClick={() => setViewMode('grid')}
                    >
                        Grid
                    </button>
                    <button 
                        className={`${styles.toggleBtn} ${viewMode === 'table' ? styles.active : ''}`}
                        onClick={() => setViewMode('table')}
                    >
                        Table
                    </button>
                </div>
            </div>

            {viewMode === 'grid' ? (
                <div className={styles.grid}>
                    {filteredCoins.map(coin => (
                        <Link href={`/stablecoins/${coin.id}`} key={coin.id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={styles.coinId}>
                                    <Image src={getLogoUrl(coin.ticker)} alt={coin.name} width={32} height={32} className={styles.logo} unoptimized />
                                    <div>
                                        <div className={styles.coinName}>{coin.name}</div>
                                        <div className={styles.coinTicker}>{coin.ticker}</div>
                                    </div>
                                </div>
                                <div className={styles.pegBadge}>{coin.peg_currency}</div>
                            </div>
                            <p className={styles.cardSummary}>{coin.summary}</p>
                            <div className={styles.badges}>
                                {coin.badges.slice(0, 2).map(b => (
                                    <span key={b} className={styles.badge}>{formatBadge(b)}</span>
                                ))}
                                {coin.badges.length > 2 && <span className={styles.badge}>+{coin.badges.length - 2}</span>}
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Asset</th>
                                <th>Peg</th>
                                <th>Type</th>
                                <th>Badges</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCoins.map(coin => (
                                <tr key={coin.id}>
                                    <td>
                                        <Link href={`/stablecoins/${coin.id}`} className={styles.tableCoin}>
                                            <Image src={getLogoUrl(coin.ticker)} alt={coin.name} width={24} height={24} className={styles.logo} unoptimized />
                                            <span className={styles.coinName}>{coin.name}</span>
                                            <span className={styles.coinTicker}>{coin.ticker}</span>
                                        </Link>
                                    </td>
                                    <td>{coin.peg_currency}</td>
                                    <td>{coin.type}</td>
                                    <td>
                                        <div className={styles.badges}>
                                            {coin.badges.length} verified
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {filteredCoins.length === 0 && (
                <div className={styles.emptyResults}>
                    No stablecoins match your criteria.
                </div>
            )}
        </div>
    );
}
