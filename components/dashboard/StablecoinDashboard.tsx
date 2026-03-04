'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import styles from './dashboard.module.css';

import { KPIStrip, KPIStripSkeleton } from './KPIStrip';
import { SupplyChart, SupplyChartSkeleton } from './SupplyChart';
import { IssuerLeaderboard, IssuerLeaderboardSkeleton } from './IssuerLeaderboard';
import { ChainDistribution, ChainDistributionSkeleton } from './ChainDistribution';
import { PegHealthMonitor, PegHealthMonitorSkeleton } from './PegHealthMonitor';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function StablecoinDashboard() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const { data, error, isValidating } = useSWR('/api/dashboard', fetcher, {
        refreshInterval: 60 * 60 * 1000, // 60 minutes
        revalidateOnFocus: false, // Don't constantly ping on tab focus
    });

    const isLoading = !data && !error;

    return (
        <section className={styles.dashboardSection} id="market-snapshot">

            {/* Section Header */}
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>Market Snapshot</h2>
                    <p className={styles.subtitle}>
                        Live data on stablecoin supply, issuers, and network distribution. Updated hourly.
                    </p>
                </div>
                {!isLoading && !error && data?.lastUpdatedAt && (
                    <div className={styles.timestamp} suppressHydrationWarning>
                        {mounted ? `Last updated: ${Math.floor((new Date().getTime() - new Date(data.lastUpdatedAt).getTime()) / 60000)} min ago` : 'Last updated: just now'}
                    </div>
                )}
            </div>

            {error ? (
                <div className={styles.error}>
                    <p>Data temporarily unavailable. Refresh to try again.</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {/* Module 1: KPI Strip */}
                    {isLoading ? <KPIStripSkeleton /> : <KPIStrip data={data.kpis} />}

                    {/* Module 2 & 3: Chart and Leaderboard (Side-by-side on desktop) */}
                    <div className={styles.middleRow}>
                        {isLoading ? <SupplyChartSkeleton /> : <SupplyChart data={data.supplyHistory} />}
                        {isLoading ? <IssuerLeaderboardSkeleton /> : <IssuerLeaderboard data={data.leaderboard} />}
                    </div>

                    {/* Module 4 & 5: Chain Distribution and Peg Health (50/50 on desktop) */}
                    <div className={styles.bottomRow}>
                        {isLoading ? <ChainDistributionSkeleton /> : <ChainDistribution data={data.chainDistribution} />}
                        {isLoading ? <PegHealthMonitorSkeleton /> : <PegHealthMonitor data={data.pegHealth} lastUpdatedAt={data.lastUpdatedAt} />}
                    </div>
                </div>
            )}

            {/* Attribution */}
            <div className={styles.disclaimer} style={{ marginTop: '2rem' }}>
                Market data powered by <a href="https://defillama.com" target="_blank" rel="noopener noreferrer">DeFiLlama</a> &middot; Updated hourly &middot; Not financial advice
            </div>
        </section>
    );
}
