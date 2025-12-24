import Link from 'next/link';
import { COMPANIES } from '@/lib/data';
import styles from './page.module.css';

export default function CompaniesPage() {
    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={`${styles.title} text-gradient`}>Regulated Companies</h1>
                <p className={styles.description}>
                    Explore the entities building the stablecoin ecosystem. We prioritize issuers and exchanges with clear regulatory standing.
                </p>
            </header>

            {/* <div className={styles.filters}>
        <input 
          type="text" 
          placeholder="Search companies..." 
          className={styles.search}
        />
      </div> */}

            <div className={styles.grid}>
                {COMPANIES.map((company) => (
                    <Link
                        key={company.id}
                        href={`/companies/${company.id}`}
                        className={styles.card}
                    >
                        <div className={styles.cardHeader}>
                            <h2 className={styles.companyName}>{company.name}</h2>
                            <span className={styles.category}>{company.category}</span>
                        </div>

                        <div className={styles.jurisdictions}>
                            <span>Jurisdictions:</span>
                            <div className="flex gap-2">
                                {company.jurisdiction_ids.map(jid => (
                                    <span key={jid} className={styles.flag}>
                                        {jid}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
