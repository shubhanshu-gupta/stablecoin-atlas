import React from 'react';
import Image from 'next/image';
import styles from './entity.module.css';
import { Stablecoin, Company } from '@/lib/types';

interface Props {
    stablecoin: Stablecoin;
    issuer: Company | undefined;
}

// Map ticker to local image
const getLocalLogoUrl = (ticker: string) => {
    return `/images/coins/${ticker.toLowerCase()}.png`;
};

// Fallback logic for badges to format nicely
const formatBadge = (badge: string) => {
    if (badge === 'ATTESTATION_OR_AUDIT_LINKED') return 'Attestation Linked';
    return badge.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
};

export default function IdentityHeader({ stablecoin, issuer }: Props) {
    const finalLogoUrl = getLocalLogoUrl(stablecoin.ticker);

    return (
        <section className={styles.identityHeader}>
            <div className={styles.coinIdentity}>
                {finalLogoUrl && (
                    <Image 
                        src={finalLogoUrl} 
                        alt={`${stablecoin.name} logo`} 
                        width={48} 
                        height={48} 
                        className={styles.logo}
                        unoptimized
                    />
                )}
                <h1 className={styles.title}>{stablecoin.name}</h1>
                <span className={styles.ticker}>({stablecoin.ticker})</span>
            </div>
            
            <div className={styles.metaRow}>
                <span><strong>Type:</strong> {stablecoin.type}</span>
                <span><strong>Peg:</strong> {stablecoin.peg_currency}</span>
                {issuer && (
                    <span><strong>Issuer:</strong> <a href={issuer.website_url} target="_blank" rel="noopener noreferrer" className={styles.link}>{issuer.name}</a></span>
                )}
            </div>

            <p className={styles.summary}>{stablecoin.summary}</p>

            {stablecoin.badges && stablecoin.badges.length > 0 && (
                <div className={styles.badgeContainer}>
                    {stablecoin.badges.map(badge => (
                        <span key={badge} className={styles.trustBadge}>
                            {formatBadge(badge)}
                        </span>
                    ))}
                </div>
            )}
            
            <div className={styles.lastVerified}>
                Last verified: {stablecoin.last_verified_at}
            </div>
        </section>
    );
}
