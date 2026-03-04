'use client';

import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './dashboard.module.css';

interface SupplyPoint {
    date: string;
    value: number;
}

export function SupplyChart({ data }: { data: SupplyPoint[] }) {
    // PRD requests 1Y default view, with toggles for 3M/6M/1Y/All
    // For MVP, if we have 365 points, we can slice it. 
    const [period, setPeriod] = useState<number>(365);

    const chartData = data.slice(-period).map(d => ({
        ...d,
        dateValue: new Date(d.date).getTime()
    }));

    const formatXAxis = (tickItem: number) => {
        const d = new Date(tickItem);
        return d.toLocaleDateString('en-US', { month: 'short' });
    };

    const formatYAxis = (tickItem: number) => {
        return `$${(tickItem / 1e9).toFixed(0)}B`;
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const d = new Date(label);
            const val = payload[0].value;
            return (
                <div style={{ background: '#111', border: '1px solid #333', padding: '10px', borderRadius: '8px' }}>
                    <p style={{ margin: 0, color: '#aaa', fontSize: '12px' }}>{d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>${(val / 1e9).toFixed(1)}B</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Total Supply Trend</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {[90, 180, 365].map(days => (
                        <button
                            key={days}
                            onClick={() => setPeriod(days)}
                            style={{
                                background: period === days ? 'var(--primary)' : 'transparent',
                                color: period === days ? '#000' : 'var(--text-secondary)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '4px',
                                padding: '2px 8px',
                                fontSize: '12px',
                                cursor: 'pointer'
                            }}
                        >
                            {days === 90 ? '3M' : days === 180 ? '6M' : '1Y'}
                        </button>
                    ))}
                </div>
            </div>
            <div style={{ width: '100%', flex: 1, minHeight: 300 }}>
                <ResponsiveContainer>
                    <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="dateValue"
                            tickFormatter={formatXAxis}
                            type="number"
                            domain={['dataMin', 'dataMax']}
                            stroke="#666"
                            fontSize={12}
                            minTickGap={30}
                        />
                        <YAxis
                            tickFormatter={formatYAxis}
                            domain={['auto', 'auto']}
                            stroke="#666"
                            fontSize={12}
                            width={60}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export function SupplyChartSkeleton() {
    return (
        <div className={styles.card}>
            <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
            <div className={`${styles.skeleton} ${styles.skeletonChart}`} />
        </div>
    );
}
