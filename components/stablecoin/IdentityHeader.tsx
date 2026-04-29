import React from 'react';
import Image from 'next/image';
import styles from './entity.module.css';
import { Stablecoin, Company } from '@/lib/types';

interface Props {
    stablecoin: Stablecoin;
    issuer: Company | undefined;
}

// Map ticker to coingecko id for the image URL
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

// Fallback logic for badges to format nicely
const formatBadge = (badge: string) => {
    return badge.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
};

export default function IdentityHeader({ stablecoin, issuer }: Props) {
    const geckoId = COINGECKO_ID_MAP[stablecoin.ticker];
    const logoUrl = geckoId ? `https://assets.coingecko.com/coins/images/${geckoId === 'usd-coin' ? '6319' : geckoId === 'tether' ? '325' : geckoId === 'dai' ? '9956' : geckoId === 'stasis-eurs' ? '5164' : geckoId === 'xsgd' ? '12829' : geckoId === 'euro-coin' ? '26081' : geckoId === 'paypal-usd' ? '31160' : geckoId === 'first-digital-usd' ? '31043' : geckoId === 'paxos-standard' ? '6013' : '1'}/standard/${geckoId}.png` : null;

    // Use a generic placeholder or coingecko logo
    const finalLogoUrl = logoUrl || `https://assets.coingecko.com/coins/images/1/standard/bitcoin.png`; // Fallback

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
