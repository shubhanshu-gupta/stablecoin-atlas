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
    const [filterType, setFilterType] = useState('all'); // 'all' | 'regulations' | 'companies'

    // Placeholder for submission logic - to be connected to Supabase later
    const handleSubmitNews = () => {
        alert("News submission flow coming soon! This will open a form to submit stories.");
    };

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
            const matchesSearch = (
                item.title.toLowerCase().includes(term) ||
                item.contentSnippet.toLowerCase().includes(term) ||
                item.source.toLowerCase().includes(term)
            );

            if (!matchesSearch) return false;

            if (filterType === 'all') return true;
            if (filterType === 'regulations') {
                return (
                    item.title.toLowerCase().includes('regulation') ||
                    item.title.toLowerCase().includes('compliance') ||
                    item.title.toLowerCase().includes('law') ||
                    item.contentSnippet.toLowerCase().includes('regulation')
                );
            }
            if (filterType === 'companies') {
                // Heuristic: check if title/snippet contains known company names could be improved
                // For now, relies on keywords often associated with corporate news
                return (
                    item.title.toLowerCase().includes('launch') ||
                    item.title.toLowerCase().includes('partnership') ||
                    item.source.toLowerCase().includes('company') // Hypothetical
                );
            }
            return true;
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
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="all">All News</option>
                    <option value="regulations">Regulatory Updates</option>
                    <option value="companies">Company News</option>
                </select>
                <select
                    className={styles.select}
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                </select>
                <button className={styles.submitBtn} onClick={handleSubmitNews}>
                    Submit News
                </button>
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
