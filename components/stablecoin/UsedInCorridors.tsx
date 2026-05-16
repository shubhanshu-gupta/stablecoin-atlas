import React from 'react';
import Link from 'next/link';
import { Stablecoin, Corridor } from '@/lib/types';
import { JURISDICTIONS } from '@/lib/data';
import styles from './entity.module.css';

interface Props {
    stablecoin: Stablecoin;
    relevantCorridors: Corridor[];
}

const PEG_TO_JURISDICTIONS: Record<string, string[]> = {
    USD: ['us'],
    EUR: ['eu'],
    GBP: ['uk'],
    SGD: ['sg'],
    Other: [],
};

export function computeRelevantCorridors(stablecoin: Stablecoin, corridors: Corridor[]): Corridor[] {
    const pegJurisdictions = PEG_TO_JURISDICTIONS[stablecoin.peg_currency] ?? [];
    const regulatoryJurisdictions = stablecoin.regulatory_alignments.map((ra) => ra.jurisdiction_id);
    const allRelevant = new Set([...pegJurisdictions, ...regulatoryJurisdictions]);

    return corridors.filter(
        (c) => allRelevant.has(c.source_jurisdiction_id) || allRelevant.has(c.target_jurisdiction_id)
    );
}

export default function UsedInCorridors({ stablecoin, relevantCorridors }: Props) {
    if (relevantCorridors.length === 0) return null;

    return (
        <div className={styles.card}>
            <h2 className={styles.cardTitle}>
                <span>🗺️</span> Used in Corridors
            </h2>
            <p className={styles.disclaimerText}>
                {stablecoin.ticker} is relevant to the following remittance playbooks.
            </p>
            <div className={styles.corridorList}>
                {relevantCorridors.map((corridor) => {
                    const source = JURISDICTIONS.find((j) => j.id === corridor.source_jurisdiction_id);
                    const target = JURISDICTIONS.find((j) => j.id === corridor.target_jurisdiction_id);
                    return (
                        <Link
                            key={corridor.id}
                            href={`/playbooks/${corridor.id}`}
                            className={styles.corridorPill}
                            aria-label={`View ${corridor.description} playbook`}
                        >
                            <span aria-hidden="true">{source?.flag_emoji ?? '🏳️'}</span>
                            <span className={styles.corridorArrow}>→</span>
                            <span aria-hidden="true">{target?.flag_emoji ?? '🏳️'}</span>
                            <span className={styles.corridorLabel}>{corridor.description}</span>
                            <span className={styles.corridorCta}>View playbook →</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
