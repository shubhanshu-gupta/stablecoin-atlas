'use client';

import React, { useEffect, useState } from 'react';
import styles from './entity.module.css';

interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    contentSnippet: string;
    source: string;
    isoDate: string;
}

interface Props {
    ticker: string;
    name: string;
}

function formatDate(pubDate: string): string {
    try {
        return new Date(pubDate).toLocaleDateString('en-GB', {
            month: 'short', day: 'numeric', year: 'numeric',
        });
    } catch {
        return pubDate;
    }
}

export default function RelatedNews({ ticker, name }: Props) {
    const [articles, setArticles] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchNews() {
            try {
                const res = await fetch('/api/news');
                if (!res.ok) return;
                const data: NewsItem[] = await res.json();

                const terms = [ticker.toLowerCase(), name.toLowerCase()];
                const matched = data.filter((item) => {
                    const haystack = `${item.title} ${item.contentSnippet}`.toLowerCase();
                    return terms.some((t) => haystack.includes(t));
                });

                // Sort newest first, take top 3
                matched.sort((a, b) =>
                    new Date(b.isoDate || 0).getTime() - new Date(a.isoDate || 0).getTime()
                );
                setArticles(matched.slice(0, 3));
            } catch {
                // Silent fail — section simply stays hidden
            } finally {
                setLoading(false);
            }
        }
        fetchNews();
    }, [ticker, name]);

    if (loading || articles.length === 0) return null;

    return (
        <div className={styles.card}>
            <h2 className={styles.cardTitle}>
                <span>📰</span> Related News
            </h2>
            <ul className={styles.relatedNewsList}>
                {articles.map((item, idx) => (
                    <li key={idx} className={styles.relatedNewsItem}>
                        <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.relatedNewsLink}
                        >
                            <div className={styles.relatedNewsMeta}>
                                <span className={styles.relatedNewsSource}>{item.source}</span>
                                <time className={styles.relatedNewsDate}>{formatDate(item.pubDate)}</time>
                            </div>
                            <p className={styles.relatedNewsTitle}>{item.title}</p>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
