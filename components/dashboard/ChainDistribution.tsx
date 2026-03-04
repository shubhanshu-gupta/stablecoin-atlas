'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import styles from './dashboard.module.css';

interface ChainItem {
    name: string;
    supply: number;
    count?: number;
}

export function ChainDistribution({ data }: { data: ChainItem[] }) {
    const COLORS = ['#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8'];

    const formatCurrency = (val: number) => {
        if (val >= 1e9) return `$${(val / 1e9).toFixed(0)}B`;
        if (val >= 1e6) return `$${(val / 1e6).toFixed(0)}M`;
        return `$${val.toLocaleString()}`;
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const val = payload[0].value;
            const count = payload[0].payload.count;
            return (
                <div style={{ background: '#111', border: '1px solid #333', padding: '10px', borderRadius: '8px', zIndex: 100 }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{label} {count ? `(${count} chains)` : ''}</p>
                    <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>Supply: {formatCurrency(val)}</p>
                </div>
            );
        }
        return null;
    };

    const renderCustomLabel = (props: any) => {
        const { x, y, width, height, value } = props;
        if (width < 40) return null; // don't render if too small
        return (
            <text x={x + width - 5} y={y + height / 2 + 4} fill="#fff" textAnchor="end" fontSize="12" fontWeight="bold">
                {formatCurrency(value)}
            </text>
        );
    };

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Chain Distribution</h3>
            </div>
            <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                    <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} style={{ fill: '#ccc', fontSize: '13px' }} />
                        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} content={<CustomTooltip />} />
                        <Bar dataKey="supply" radius={[0, 4, 4, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                            <LabelList dataKey="supply" content={renderCustomLabel} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export function ChainDistributionSkeleton() {
    return (
        <div className={styles.card}>
            <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
            <div className={`${styles.skeleton} ${styles.skeletonChart}`} style={{ height: '350px' }} />
        </div>
    );
}
