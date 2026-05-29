'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './compare.module.css';

interface CompareSelectorProps {
    allCoins: { id: string; name: string; ticker: string }[];
    selectedIds: string[];
}

export default function CompareSelector({ allCoins, selectedIds }: CompareSelectorProps) {
    const router = useRouter();

    const toggleCoin = (id: string) => {
        let newSelection = [...selectedIds];
        if (newSelection.includes(id)) {
            newSelection = newSelection.filter(coinId => coinId !== id);
        } else {
            newSelection.push(id);
        }

        // Limit to 5 coins for UI sanity
        if (newSelection.length > 5) {
            newSelection.shift(); // remove oldest if adding too many
        }

        const queryStr = newSelection.length > 0 ? `?coins=${newSelection.join(',')}` : '';
        router.push(`/compare${queryStr}`, { scroll: false });
    };

    return (
        <div className={styles.selectorContainer}>
            <p className={styles.selectorLabel}>Select up to 5 stablecoins to compare:</p>
            <div className={styles.pillGroup}>
                {allCoins.map(coin => {
                    const isSelected = selectedIds.includes(coin.id);
                    return (
                        <button
                            key={coin.id}
                            onClick={() => toggleCoin(coin.id)}
                            className={`${styles.pill} ${isSelected ? styles.pillSelected : ''}`}
                            title={`Toggle ${coin.name}`}
                        >
                            {coin.ticker}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
