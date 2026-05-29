import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
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
                
                <Link 
                    href={`/compare?coins=${stablecoin.id},usdc,usdt`} 
                    style={{ 
                        padding: '0.4rem 0.8rem', 
                        border: '1px solid var(--glass-border)',
                        background: 'transparent',
                        color: 'var(--foreground)', 
                        borderRadius: 'var(--radius-sm)', 
                        textDecoration: 'none', 
                        fontSize: '0.85rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                    }}
                >
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Compare
                </Link>
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
