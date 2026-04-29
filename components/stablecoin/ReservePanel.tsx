import React from 'react';
import styles from './entity.module.css';
import { Stablecoin } from '@/lib/types';

export default function ReservePanel({ stablecoin }: { stablecoin: Stablecoin }) {
    return (
        <div className={styles.card}>
            <h2 className={styles.cardTitle}>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Reserve & Attestation
            </h2>

            <div className={styles.dataRow}>
                <div className={styles.dataLabel}>Backing Mechanism</div>
                <div className={styles.dataValue}>{stablecoin.backing_description || <span className={styles.emptyState}>Not disclosed</span>}</div>
            </div>

            <div className={styles.dataRow}>
                <div className={styles.dataLabel}>Reserve Composition</div>
                <div className={styles.dataValue}>
                    {stablecoin.reserve_composition.length > 0 ? (
                        stablecoin.reserve_composition.map((asset, i) => (
                            <div key={i}>
                                {asset.percentage}% {asset.asset_type}
                                {asset.source_url && (
                                    <> (<a href={asset.source_url} target="_blank" rel="noopener noreferrer" className={styles.link}>source</a>)</>
                                )}
                            </div>
                        ))
                    ) : (
                        <span className={styles.emptyState}>Not publicly available</span>
                    )}
                </div>
            </div>

            <div className={styles.dataRow}>
                <div className={styles.dataLabel}>Attestation Frequency</div>
                <div className={styles.dataValue} style={{ textTransform: 'capitalize' }}>
                    {stablecoin.attestation_frequency.replace('_', ' ')}
                </div>
            </div>

            <div className={styles.dataRow}>
                <div className={styles.dataLabel}>Latest Attestation</div>
                <div className={styles.dataValue}>
                    {stablecoin.latest_attestation_url ? (
                        <a href={stablecoin.latest_attestation_url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                            {stablecoin.latest_attestation_date ? `Report (${stablecoin.latest_attestation_date})` : 'View Report'}
                        </a>
                    ) : (
                        <span className={styles.emptyState}>No public attestation report found as of {stablecoin.last_verified_at}.</span>
                    )}
                </div>
            </div>

            <div className={styles.dataRow}>
                <div className={styles.dataLabel}>Attestation Provider</div>
                <div className={styles.dataValue}>{stablecoin.attestation_provider || <span className={styles.emptyState}>Not disclosed</span>}</div>
            </div>

            <div className={styles.dataRow}>
                <div className={styles.dataLabel}>Redemption Policy</div>
                <div className={styles.dataValue}>
                    {stablecoin.redemption_policy_notes}{' '}
                    {stablecoin.redemption_policy_url && (
                        <a href={stablecoin.redemption_policy_url} target="_blank" rel="noopener noreferrer" className={styles.link}>[Terms]</a>
                    )}
                </div>
            </div>

            <div className={styles.dataRow}>
                <div className={styles.dataLabel}>Depeg History</div>
                <div className={styles.dataValue}>
                    {stablecoin.depeg_events.length > 0 ? (
                        <div className={styles.depegList}>
                            {stablecoin.depeg_events.map((event, i) => (
                                <div key={i} className={styles.depegItem}>
                                    <span className={styles.depegDate}>{event.date}</span>
                                    <span>Deviation: <span className={styles.depegMag}>{event.magnitude_pct}%</span></span>
                                    <div>{event.notes}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <span className={styles.emptyState}>No depeg events recorded in Atlas data.</span>
                    )}
                </div>
            </div>

            <div className={styles.cautionNote} style={{ marginTop: '1.5rem', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', border: 'none', fontSize: '0.75rem' }}>
                Attestation data links to issuer or auditor primary sources. Stablecoin Atlas does not verify or audit reserve claims independently.
                {stablecoin.depeg_events.length > 0 && " Historical depeg events do not predict future stability. Past performance does not indicate future behaviour."}
            </div>
        </div>
    );
}
