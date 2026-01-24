'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    tags: string[];
    url?: string;
    created_at: string;
}

const POPULAR_SEARCHES = ["Stablecoin", "Compliance", "Payments", "Legal", "Engineering"];

export default function CareersPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [locationFilter, setLocationFilter] = useState('');

    useEffect(() => {
        async function fetchJobs() {
            setLoading(true);
            try {
                const res = await fetch('/api/jobs', {
                    method: 'POST',
                    body: JSON.stringify({
                        query: activeFilter || searchKeyword,
                        location: locationFilter
                    })
                });
                const data = await res.json();
                setJobs(data as Job[]);
            } catch (error) {
                console.error('Failed to fetch jobs', error);
            } finally {
                setLoading(false);
            }
        }
        // Debounce
        const timeoutId = setTimeout(fetchJobs, 500);
        return () => clearTimeout(timeoutId);
    }, [activeFilter, searchKeyword, locationFilter]);

    const handlePostJob = () => {
        alert("Post a Job flow coming soon! This will open a form for users to submit opportunities.");
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        // Calculate days ago
        const diffTime = Math.abs(new Date().getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 1) return 'New';
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={`${styles.title} text-gradient`}>Future of Money Careers</h1>
                    <p className={styles.description}>
                        Find your role in the future of money. Curated opportunities across Product, Engineering, Compliance, and Policy.
                    </p>

                    <div className={styles.ctaCard}>
                        <div className={styles.ctaCardInner}>
                            <h3 className={styles.ctaTitle}>Hiring?</h3>
                            <p className={styles.ctaText}>Reach specialized talent in the stablecoin ecosystem.</p>
                            <button className={styles.submitBtn} onClick={handlePostJob}>
                                Post a Job
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className={styles.controlsSection}>
                <div className={styles.searchBar}>
                    <input
                        type="text"
                        placeholder="Search by keyword..."
                        className={styles.searchInput}
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Location (e.g. Remote, NY)"
                        className={styles.searchInput}
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                    />
                </div>

                <div className={styles.filterTags}>
                    <button
                        className={`${styles.filterTag} ${activeFilter === '' ? styles.active : ''}`}
                        onClick={() => setActiveFilter('')}
                    >
                        All Roles
                    </button>
                    {POPULAR_SEARCHES.map(tag => (
                        <button
                            key={tag}
                            className={`${styles.filterTag} ${activeFilter === tag ? styles.active : ''}`}
                            onClick={() => setActiveFilter(tag)}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <p>Searching opportunities...</p>
                </div>
            ) : (
                <div className={styles.jobList}>
                    {jobs.map((job) => (
                        <a key={job.id} href={job.url} target="_blank" rel="noopener noreferrer" className={styles.jobCard}>
                            <div className={styles.jobMain}>
                                <div className={styles.titleRow}>
                                    <h2 className={styles.jobTitle}>{job.title}</h2>
                                    {job.created_at && (
                                        <span className={styles.dateBadge}>{formatDate(job.created_at)}</span>
                                    )}
                                </div>
                                <div className={styles.jobCompany}>{job.company}</div>
                                <div className={styles.tags}>
                                    <span className={styles.typeTag}>{job.type}</span>
                                    {job.tags?.slice(0, 3).map(tag => (
                                        <span key={tag} className={styles.techTag}>{tag}</span>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.jobMeta}>
                                <span className={styles.location}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                    {job.location}
                                </span>
                                <span className={styles.applyBtn}>Apply &rarr;</span>
                            </div>
                        </a>
                    ))}
                    {!loading && jobs.length === 0 && (
                        <div className={styles.emptyState}>
                            No jobs found matching your criteria.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
