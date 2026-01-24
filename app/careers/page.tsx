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
}

const POPULAR_SEARCHES = ["Stablecoin", "Compliance", "Payments", "Legal", "Engineering"];

export default function CareersPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('');

    useEffect(() => {
        async function fetchJobs() {
            setLoading(true);
            try {
                const res = await fetch('/api/jobs', {
                    method: 'POST',
                    body: JSON.stringify({ query: activeFilter })
                });
                const data = await res.json();
                setJobs(data as Job[]);
            } catch (error) {
                console.error('Failed to fetch jobs', error);
            } finally {
                setLoading(false);
            }
        }
        // Debounce could be added here
        const timeoutId = setTimeout(fetchJobs, 500);
        return () => clearTimeout(timeoutId);
    }, [activeFilter]);

    const handlePostJob = () => {
        alert("Post a Job flow coming soon! This will open a form for users to submit opportunities.");
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
                        <div className={styles.ctaText}>
                            <h3>Hiring?</h3>
                            <p>Reach specialized talent in the stablecoin ecosystem.</p>
                        </div>
                        <button className={styles.submitBtn} onClick={handlePostJob}>
                            Post a Job
                        </button>
                    </div>
                </div>
            </header>

            <div className={styles.filtersSection}>
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
                                <h2 className={styles.jobTitle}>{job.title}</h2>
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
