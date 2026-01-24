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
}

const POPULAR_SEARCHES = ["stablecoin", "crypto compliance", "blockchain payments", "digital asset", "VASP"];

export default function CareersPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('');

    useEffect(() => {
        async function fetchJobs() {
            try {
                const res = await fetch('/api/jobs');
                const data = await res.json();
                setJobs(data as Job[]);
            } catch (error) {
                console.error('Failed to fetch jobs', error);
            } finally {
                setLoading(false);
            }
        }
        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter(job => {
        if (!activeFilter) return true;

        const term = activeFilter.toLowerCase();
        return (
            job.tags.some(tag => tag.toLowerCase().includes(term)) ||
            job.title.toLowerCase().includes(term) ||
            job.type.toLowerCase().includes(term)
        );
    });

    const handlePostJob = () => {
        alert("Post a Job flow coming soon! This will open a form for users to submit opportunities.");
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={`${styles.title} text-gradient`}>Stablecoin Careers</h1>
                <p className={styles.description}>
                    Find your role in the future of money. Curated opportunities across Product, Engineering, Compliance, and Policy.
                </p>
                <div className={styles.ctaContainer}>
                    <button className={styles.submitBtn} onClick={handlePostJob}>
                        Post a Job
                    </button>
                    <span className={styles.ctaSubtext}>Hiring? Reach specialized talent.</span>
                </div>
            </header>

            <div className={styles.filters}>
                <span className={styles.filterLabel}>Popular Filters:</span>
                <div className={styles.filterTags}>
                    <button
                        className={`${styles.filterTag} ${activeFilter === '' ? styles.active : ''}`}
                        onClick={() => setActiveFilter('')}
                    >
                        All
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
                <div className="text-center py-12 text-gray-400">Loading opportunities...</div>
            ) : (
                <div className={styles.jobList}>
                    {filteredJobs.map((job) => (
                        <a key={job.id} href="#" className={styles.jobCard}>
                            <div className={styles.jobMain}>
                                <h2 className={styles.jobTitle}>{job.title}</h2>
                                <div className={styles.jobCompany}>{job.company} • {job.type}</div>
                                <div className={styles.tags}>
                                    {job.tags.map(tag => (
                                        <span key={tag} className={styles.miniTag}>#{tag}</span>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.jobMeta}>
                                <span className={styles.location}>{job.location}</span>
                                <span className={styles.applyBtn}>Apply Now</span>
                            </div>
                        </a>
                    ))}
                    {!loading && filteredJobs.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No jobs found matching "{activeFilter}".
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
