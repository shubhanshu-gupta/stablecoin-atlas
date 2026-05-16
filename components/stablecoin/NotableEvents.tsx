import React from 'react';
import { Stablecoin } from '@/lib/types';
import styles from './entity.module.css';

interface Props {
    stablecoin: Stablecoin;
}

const ACTION_TYPE_STYLES: Record<string, string> = {
    'License':        styles.eventTypeLicense,
    'Chain Expansion': styles.eventTypeChain,
    'Attestation':    styles.eventTypeAttestation,
    'Enforcement':    styles.eventTypeEnforcement,
    'Policy Change':  styles.eventTypePolicy,
    'Other':          styles.eventTypeOther,
};

function formatDate(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00Z');
    return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric', day: 'numeric', timeZone: 'UTC' });
}

export default function NotableEvents({ stablecoin }: Props) {
    // Sort reverse-chronological
    const events = [...stablecoin.notable_events].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <div className={styles.card}>
            <h2 className={styles.cardTitle}>
                <span>📋</span> Notable Events
            </h2>

            {events.length === 0 ? (
                <p className={styles.emptyState}>
                    No notable events recorded in Atlas data.
                </p>
            ) : (
                <ol className={styles.timeline} aria-label="Notable events timeline">
                    {events.map((event, idx) => (
                        <li key={idx} className={styles.timelineItem}>
                            <div className={styles.timelineDot} aria-hidden="true" />
                            <div className={styles.timelineContent}>
                                <div className={styles.timelineHeader}>
                                    <time
                                        className={styles.eventDate}
                                        dateTime={event.date}
                                    >
                                        {formatDate(event.date)}
                                    </time>
                                    <span
                                        className={`${styles.eventTypeBadge} ${ACTION_TYPE_STYLES[event.action_type] ?? styles.eventTypeOther}`}
                                    >
                                        {event.action_type}
                                    </span>
                                </div>
                                <p className={styles.eventSummary}>{event.summary}</p>
                                {event.evidence_url && (
                                    <a
                                        href={event.evidence_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.link}
                                        aria-label={`Evidence for: ${event.summary}`}
                                    >
                                        View source →
                                    </a>
                                )}
                            </div>
                        </li>
                    ))}
                </ol>
            )}

            <p className={styles.disclaimerText} style={{ marginTop: '1rem', marginBottom: 0 }}>
                Historical depeg events do not predict future stability. Past performance does not indicate future behaviour.
            </p>
        </div>
    );
}
