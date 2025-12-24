import styles from './page.module.css';

const JOBS = [
    { id: 1, title: 'Product Manager, Stablecoins', company: 'Circle', location: 'Singapore (Remote)', type: 'Product' },
    { id: 2, title: 'Compliance Officer', company: 'Paxos', location: 'New York, US', type: 'Compliance' },
    { id: 3, title: 'Rust Engineer', company: 'Solana Foundation', location: 'London, UK', type: 'Engineering' },
    { id: 4, title: 'Treasury Analyst', company: 'Tether', location: 'Lugano, CH', type: 'Treasury' },
    { id: 5, title: 'Policy Lead', company: 'Coinbase', location: 'Washington DC, US', type: 'Legal' },
];

export default function CareersPage() {
    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={`${styles.title} text-gradient`}>Stablecoin Careers</h1>
                <p className={styles.description}>
                    Find your role in the future of money. Curated opportunities across Product, Engineering, Compliance, and Policy.
                </p>
            </header>

            <div className={styles.jobList}>
                {JOBS.map((job) => (
                    <a key={job.id} href="#" className={styles.jobCard}>
                        <div>
                            <h2 className={styles.jobTitle}>{job.title}</h2>
                            <div className={styles.jobCompany}>{job.company} • {job.type}</div>
                        </div>

                        <div className={styles.jobMeta}>
                            <span className={styles.location}>{job.location}</span>
                            <span className={styles.tag}>Apply Now</span>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
