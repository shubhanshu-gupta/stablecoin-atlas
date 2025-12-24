'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    contentSnippet: string;
    source: string;
    isoDate: string;
}

export default function LatestPage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');

    useEffect(() => {
        async function fetchNews() {
            try {
                const res = await fetch('/api/news');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setNews(data);
                }
            } catch (error) {
                console.error('Failed to fetch news', error);
            } finally {
                setLoading(false);
            }
        }
        fetchNews();
    }, []);

    const filteredNews = news
        .filter(item => {
            const term = search.toLowerCase();
            return (
                item.title.toLowerCase().includes(term) ||
                item.contentSnippet.toLowerCase().includes(term) ||
                item.source.toLowerCase().includes(term)
            );
        })
        .sort((a, b) => {
            const dateA = new Date(a.isoDate || 0).getTime();
            const dateB = new Date(b.isoDate || 0).getTime();
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={`${styles.title} text-gradient`}>Latest Developments</h1>
                <p className={styles.description}>
                    Stay updated with the most important news, regulatory updates, and ecosystem changes in the stablecoin world.
                </p>
            </header>

            <div className={styles.controls}>
                <input
                    type="text"
                    placeholder="Search news..."
                    className={styles.search}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    className={styles.select}
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                </select>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-400">Loading latest news...</div>
            ) : (
                <div className={styles.grid}>
                    {filteredNews.map((item, index) => (
                        <a
                            key={index}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.card}
                        >
                            <div className={styles.cardContent}>
                                <div className={styles.meta}>
                                    <span className={styles.tag}>{item.source}</span>
                                    <span className={styles.date}>
                                        {new Date(item.pubDate).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <h2 className={styles.headline}>{item.title}</h2>
                                <p className={styles.excerpt}>
                                    {item.contentSnippet?.slice(0, 120)}
                                    {item.contentSnippet?.length > 120 ? '...' : ''}
                                </p>
                            </div>
                        </a>
                    ))}
                    {!loading && filteredNews.length === 0 && (
                        <div className="col-span-full text-center text-gray-500">
                            No news found matching your search.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
