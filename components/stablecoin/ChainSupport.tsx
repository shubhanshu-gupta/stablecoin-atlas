'use client';

import React from 'react';
import styles from './entity.module.css';
import { Stablecoin } from '@/lib/types';

export default function ChainSupport({ stablecoin }: { stablecoin: Stablecoin }) {
    if (!stablecoin.supported_chains || stablecoin.supported_chains.length === 0) {
        return null;
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could add a toast notification here
    };

    const truncateAddress = (addr: string) => {
        if (addr.length <= 12) return addr;
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    return (
        <div className={styles.card}>
            <h2 className={styles.cardTitle}>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Chain & Network Support
            </h2>

            <div style={{ overflowX: 'auto' }}>
                <table className={styles.chainTable}>
                    <thead>
                        <tr>
                            <th>Network</th>
                            <th>Contract Address</th>
                            <th style={{ textAlign: 'right' }}>Explorer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stablecoin.supported_chains.map((chain, idx) => (
                            <tr key={idx}>
                                <td>{chain.chain_name}</td>
                                <td>
                                    <div className={styles.contractAddress}>
                                        {truncateAddress(chain.contract_address)}
                                        <button 
                                            className={styles.copyButton} 
                                            onClick={() => copyToClipboard(chain.contract_address)}
                                            title="Copy to clipboard"
                                        >
                                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <a href={chain.explorer_url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className={styles.cautionNote}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ flexShrink: 0 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Always verify the contract address before sending. Using an unofficial contract can result in permanent loss of funds.
            </div>
        </div>
    );
}
