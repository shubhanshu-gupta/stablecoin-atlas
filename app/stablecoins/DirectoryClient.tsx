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

const COINGECKO_ID_MAP: Record<string, string> = {
    USDC: 'usd-coin',
    USDT: 'tether',
    PYUSD: 'paypal-usd',
    XSGD: 'xsgd',
    EURC: 'euro-coin',
    FDUSD: 'first-digital-usd',
    EURS: 'stasis-eurs',
    GBPT: 'tether-gbp',
    DAI: 'dai',
    USDP: 'paxos-standard',
};

const formatBadge = (badge: string) => {
    return badge.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
};

export default function DirectoryClient({ stablecoins, companies, corridors }: Props) {
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [pegFilter, setPegFilter] = useState<string>('All');
    const [badgeFilter, setBadgeFilter] = useState<string>('All');

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

        // Sort by badge completeness (number of badges) descending, then alphabetical (since we don't have live market cap here for sorting easily, we sort by badge count)
        result.sort((a, b) => {
            if (b.badges.length !== a.badges.length) {
                return b.badges.length - a.badges.length;
            }
            return a.name.localeCompare(b.name);
        });

        return result;
    }, [stablecoins, searchQuery, pegFilter, badgeFilter]);

    const getLogoUrl = (ticker: string) => {
        const geckoId = COINGECKO_ID_MAP[ticker];
        if (!geckoId) return `https://assets.coingecko.com/coins/images/1/standard/bitcoin.png`;
        return `https://assets.coingecko.com/coins/images/${geckoId === 'usd-coin' ? '6319' : geckoId === 'tether' ? '325' : geckoId === 'dai' ? '9956' : geckoId === 'stasis-eurs' ? '5164' : geckoId === 'xsgd' ? '12829' : geckoId === 'euro-coin' ? '26081' : geckoId === 'paypal-usd' ? '31160' : geckoId === 'first-digital-usd' ? '31043' : geckoId === 'paxos-standard' ? '6013' : '1'}/standard/${geckoId}.png`;
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Stablecoin Directory</h1>
                <p className={styles.subtitle}>Explore and compare regulated stablecoins.</p>
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
