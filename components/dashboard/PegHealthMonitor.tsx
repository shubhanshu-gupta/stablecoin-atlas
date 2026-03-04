import React from 'react';
import styles from './dashboard.module.css';

interface PegItem {
    id: string;
    symbol: string;
    price: number;
    devPercentage: number;
    rawDeviation: number;
    status: string;
}

export function PegHealthMonitor({ data, lastUpdatedAt }: { data: PegItem[], lastUpdatedAt: string }) {

    // Check if any > 1% deviation
    const hasAlert = data.some(d => d.devPercentage > 1.0);
    const alertCoins = data.filter(d => d.devPercentage > 1.0);

    const formatPrice = (price: number) => {
        return `$${price.toFixed(3)}`;
    };

    const formatDev = (raw: number) => {
        const isPos = raw > 0;
        const isNeg = raw < 0;
        const str = Math.abs(raw).toFixed(2) + '%';
        if (isPos) return <span style={{ color: '#4ade80' }}>+{str}</span>;
        if (isNeg) return <span style={{ color: '#f87171' }}>-{str}</span>;
        return <span style={{ color: '#9ca3af' }}>0.00%</span>;
    };

    const getStatusBadge = (status: string) => {
        if (status === 'ON PEG') return <span className={`${styles.badge} ${styles.badgePositive}`}>● ON PEG</span>;
        if (status === 'WATCH') return <span className={`${styles.badge} ${styles.badgeWarning}`}>◉ WATCH</span>;
        return <span className={`${styles.badge} ${styles.badgeAlert}`}>⚠ DEPEG ALERT</span>;
    };

    return (
        <div className={styles.card} style={hasAlert ? { borderColor: 'rgba(239, 68, 68, 0.3)' } : {}}>
            <div className={styles.cardHeader} style={{ marginBottom: '1rem' }}>
                <h3 className={styles.cardTitle} style={hasAlert ? { color: '#fca5a5' } : {}}>Peg Health Monitor</h3>
                <span className={styles.timestamp}>
                    Updated: {new Date(lastUpdatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>

            {hasAlert && (
                <a href="/latest" className={styles.depegBanner}>
                    <strong>Deviation Alert:</strong> {alertCoins.map(c => c.symbol).join(', ')} showing &gt;1% peg deviation. Monitor closely.
                </a>
            )}

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className={styles.pegItem} style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                    <div className={styles.pegCoin}>Asset</div>
                    <div className={styles.pegPrice}>Price</div>
                    <div className={styles.pegDev}>Dev</div>
                    <div className={styles.pegStatus}>Status</div>
                </div>

                {data.map(coin => (
                    <div key={coin.id} className={styles.pegItem} style={coin.status === 'DEPEG ALERT' ? { background: 'rgba(239,68,68,0.05)' } : {}}>
                        <div className={styles.pegCoin}>{coin.symbol}</div>
                        <div className={styles.pegPrice} style={{ fontFamily: 'monospace', fontSize: '13px' }}>{formatPrice(coin.price)}</div>
                        <div className={styles.pegDev} style={{ fontSize: '13px' }}>{formatDev(coin.rawDeviation)}</div>
                        <div className={styles.pegStatus}>{getStatusBadge(coin.status)}</div>
                    </div>
                ))}
            </div>

            <div className={styles.disclaimer} style={{ marginTop: '1.5rem' }}>
                Price data is sourced from DeFiLlama and reflects on-chain oracle prices. It may differ from centralised exchange prices. This is not financial advice.
            </div>
        </div>
    );
}

export function PegHealthMonitorSkeleton() {
    return (
        <div className={styles.card}>
            <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
            {[...Array(8)].map((_, i) => (
                <div key={i} className={`${styles.skeleton} ${styles.skeletonText}`} style={{ height: '1.5rem', marginBottom: '0.75rem' }} />
            ))}
        </div>
    );
}
