import React from 'react';
import styles from './entity.module.css';
import { Stablecoin } from '@/lib/types';

export default function RegulatoryAlignment({ stablecoin }: { stablecoin: Stablecoin }) {
    if (!stablecoin.regulatory_alignments || stablecoin.regulatory_alignments.length === 0) {
        return null;
    }

    return (
        <div className={styles.card}>
            <h2 className={styles.cardTitle}>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                Regulatory Alignment
            </h2>

            <div className={styles.jurisdictionGrid}>
                {stablecoin.regulatory_alignments.map((reg, index) => (
                    <div key={index} className={styles.regCard}>
                        <div className={styles.regCardHeader}>
                            <div className={styles.jurisdictionName}>
                                {reg.jurisdiction_id.toUpperCase()}
                            </div>
                            <span className={`${styles.statusBadge} ${reg.status === 'Aligned' ? styles.statusAligned : styles.statusUnknown}`}>
                                {reg.status}
                            </span>
                        </div>
                        <div className={styles.regBasis}>
                            {reg.basis}
                        </div>
                        <div className={styles.regFramework}>
                            {reg.framework} &bull; Last reviewed: {reg.last_reviewed_at}
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.cautionNote} style={{ marginTop: '1rem', background: 'transparent', border: 'none', padding: '0', color: 'var(--text-secondary)' }}>
                Regulatory status reflects Atlas editorial assessment and may not reflect current legal status. Verify directly with the relevant regulatory body.
            </div>
        </div>
    );
}
