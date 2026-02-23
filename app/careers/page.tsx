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
    role_family?: string;
}

const ROLE_FAMILIES = ['Product', 'Engineering', 'Compliance', 'Legal', 'BD', 'Treasury', 'Operations', 'Design', 'Data', 'Other'];
const LOCATION_TYPES = ['Remote', 'Hybrid', 'On-site'];
const LOCATION_REGIONS = ['Global', 'SG', 'UK', 'EU', 'US'];
const DATE_RANGES = [
    { label: 'Last 24h', days: 1 },
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
];

const ROLE_FAMILY_COLORS: Record<string, string> = {
    Product: '#6366f1',
    Engineering: '#06b6d4',
    Compliance: '#f59e0b',
    Legal: '#f43f5e',
    BD: '#10b981',
    Treasury: '#8b5cf6',
    Operations: '#f97316',
    Design: '#ec4899',
    Data: '#14b8a6',
    Other: '#6b7280',
};

// Google Form placeholder — team should replace with actual form URL
const JOB_SUBMISSION_FORM_URL = 'https://forms.google.com';

export default function CareersPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [activeRoleFamily, setActiveRoleFamily] = useState('');
    const [activeLocType, setActiveLocType] = useState('');
    const [activeRegion, setActiveRegion] = useState('');
    const [activeDateRange, setActiveDateRange] = useState<number | null>(null);
    const [alertEmail, setAlertEmail] = useState('');
    const [alertSubscribed, setAlertSubscribed] = useState(false);
    const [alertLoading, setAlertLoading] = useState(false);

    useEffect(() => {
        async function fetchJobs() {
            setLoading(true);
            try {
                const query = [activeRoleFamily, searchKeyword].filter(Boolean).join(' ') ||
                    'stablecoin compliance blockchain crypto payments defi web3';
                const res = await fetch('/api/jobs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query,
                        location: activeRegion || locationFilter,
                        role_family: activeRoleFamily,
                        location_type: activeLocType,
                        date_range_days: activeDateRange,
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
        const timeoutId = setTimeout(fetchJobs, 400);
        return () => clearTimeout(timeoutId);
    }, [searchKeyword, locationFilter, activeRoleFamily, activeLocType, activeRegion, activeDateRange]);

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const diffTime = Math.abs(new Date().getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 1) return 'New';
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    const handleSubscribe = () => {
        if (!alertEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(alertEmail)) return;
        setAlertLoading(true);
        setTimeout(() => {
            setAlertLoading(false);
            setAlertSubscribed(true);
            // Store in localStorage for MVP
            const existing = JSON.parse(localStorage.getItem('sa_job_alerts') || '[]');
            localStorage.setItem('sa_job_alerts', JSON.stringify([...existing, alertEmail]));
        }, 800);
    };

    const clearFilters = () => {
        setActiveRoleFamily('');
        setActiveLocType('');
        setActiveRegion('');
        setActiveDateRange(null);
        setSearchKeyword('');
        setLocationFilter('');
    };

    const hasActiveFilters = activeRoleFamily || activeLocType || activeRegion || activeDateRange || searchKeyword || locationFilter;

    return (
        <div className={styles.page}>
            {/* Hero */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.heroBadge}>Careers Hub</div>
                    <h1 className={`${styles.title} text-gradient`}>Find Your Role in the Future of Money</h1>
                    <p className={styles.description}>
                        Curated opportunities across Product, Engineering, Compliance, and Policy in the stablecoin ecosystem.
                    </p>
                    <div className={styles.ctaCard}>
                        <div className={styles.ctaCardInner}>
                            <h3 className={styles.ctaTitle}>Hiring?</h3>
                            <p className={styles.ctaText}>Reach specialised talent in the stablecoin ecosystem.</p>
                            <a
                                href={JOB_SUBMISSION_FORM_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.submitBtn}
                            >
                                Post a Job
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            {/* Search + Filters */}
            <div className={styles.controlsSection}>
                {/* Search bar */}
                <div className={styles.searchBar}>
                    <div className={styles.searchInputWrapper}>
                        <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        <input
                            type="text"
                            placeholder="Search by keyword…"
                            className={styles.searchInput}
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                    </div>
                    <div className={styles.searchInputWrapper}>
                        <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                        <input
                            type="text"
                            placeholder="Location (e.g. Remote, London)"
                            className={styles.searchInput}
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                        />
                    </div>
                    {hasActiveFilters && (
                        <button className={styles.clearBtn} onClick={clearFilters}>
                            Clear all
                        </button>
                    )}
                </div>

                {/* Filter rows */}
                <div className={styles.filterSection}>
                    <div className={styles.filterRow}>
                        <span className={styles.filterLabel}>Role</span>
                        <div className={styles.filterTags}>
                            <button
                                className={`${styles.filterTag} ${activeRoleFamily === '' ? styles.active : ''}`}
                                onClick={() => setActiveRoleFamily('')}
                            >All</button>
                            {ROLE_FAMILIES.map(rf => (
                                <button
                                    key={rf}
                                    className={`${styles.filterTag} ${activeRoleFamily === rf ? styles.active : ''}`}
                                    onClick={() => setActiveRoleFamily(activeRoleFamily === rf ? '' : rf)}
                                    style={activeRoleFamily === rf ? {
                                        background: ROLE_FAMILY_COLORS[rf] + '33',
                                        borderColor: ROLE_FAMILY_COLORS[rf] + '66',
                                        color: ROLE_FAMILY_COLORS[rf],
                                    } : {}}
                                >
                                    {rf}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.filterRow}>
                        <span className={styles.filterLabel}>Type</span>
                        <div className={styles.filterTags}>
                            {LOCATION_TYPES.map(lt => (
                                <button
                                    key={lt}
                                    className={`${styles.filterTag} ${activeLocType === lt ? styles.active : ''}`}
                                    onClick={() => setActiveLocType(activeLocType === lt ? '' : lt)}
                                >
                                    {lt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.filterRow}>
                        <span className={styles.filterLabel}>Region</span>
                        <div className={styles.filterTags}>
                            {LOCATION_REGIONS.map(r => (
                                <button
                                    key={r}
                                    className={`${styles.filterTag} ${activeRegion === r ? styles.active : ''}`}
                                    onClick={() => setActiveRegion(activeRegion === r ? '' : r)}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.filterRow}>
                        <span className={styles.filterLabel}>Posted</span>
                        <div className={styles.filterTags}>
                            {DATE_RANGES.map(dr => (
                                <button
                                    key={dr.days}
                                    className={`${styles.filterTag} ${activeDateRange === dr.days ? styles.active : ''}`}
                                    onClick={() => setActiveDateRange(activeDateRange === dr.days ? null : dr.days)}
                                >
                                    {dr.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Results count */}
            {!loading && (
                <div className={styles.resultsRow}>
                    <span className={styles.resultsCount}>{jobs.length} roles found</span>
                </div>
            )}

            {/* Job List */}
            {loading ? (
                <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <p>Searching opportunities…</p>
                </div>
            ) : jobs.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>🔍</div>
                    <h3>No matches found</h3>
                    <p>Try removing some filters, or help the community by submitting a role you know about.</p>
                    <a href={JOB_SUBMISSION_FORM_URL} target="_blank" rel="noopener noreferrer" className={styles.emptyCtaBtn}>
                        Submit a Role →
                    </a>
                </div>
            ) : (
                <div className={styles.jobList}>
                    {jobs.map((job) => {
                        const family = job.role_family || job.type || 'Other';
                        const familyColor = ROLE_FAMILY_COLORS[family] || ROLE_FAMILY_COLORS.Other;
                        return (
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
                                        <span
                                            className={styles.roleFamilyBadge}
                                            style={{ background: familyColor + '22', color: familyColor, borderColor: familyColor + '44' }}
                                        >
                                            {family}
                                        </span>
                                        {job.tags?.slice(0, 2).map(tag => (
                                            <span key={tag} className={styles.techTag}>{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className={styles.jobMeta}>
                                    <span className={styles.location}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                        {job.location}
                                    </span>
                                    <span className={styles.applyBtn}>Apply &rarr;</span>
                                </div>
                            </a>
                        );
                    })}
                </div>
            )}

            {/* Job Alert Subscription Banner */}
            <div className={styles.alertBanner}>
                <div className={styles.alertBannerInner}>
                    <div className={styles.alertBannerText}>
                        <div className={styles.alertBannerTitle}>
                            <span className={styles.alertBannerIcon}>🔔</span>
                            Get weekly job alerts
                        </div>
                        <p>New stablecoin roles delivered to your inbox every week.</p>
                    </div>
                    {alertSubscribed ? (
                        <div className={styles.alertSuccess}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                            You&apos;re subscribed!
                        </div>
                    ) : (
                        <div className={styles.alertForm}>
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className={styles.alertInput}
                                value={alertEmail}
                                onChange={e => setAlertEmail(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
                            />
                            <button
                                className={styles.alertBtn}
                                onClick={handleSubscribe}
                                disabled={alertLoading}
                            >
                                {alertLoading ? '…' : 'Subscribe'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Community Submission Banner - keeping BAU CTA per feedback */}
            <div className={styles.communityBanner}>
                <div className={styles.communityBannerInner}>
                    <span className={styles.communityBannerText}>
                        Know of a great open role? Help the community.
                    </span>
                    <a
                        href={JOB_SUBMISSION_FORM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.communityBannerBtn}
                    >
                        Share a Job →
                    </a>
                </div>
            </div>
        </div>
    );
}
