import Link from 'next/link';
import { notFound } from 'next/navigation';
import { COMPANIES, STABLECOINS } from '@/lib/data';
import styles from './page.module.css';

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
    return COMPANIES.map((company) => ({
        id: company.id,
    }));
}

export default async function CompanyPage({ params }: Props) {
    const { id } = await params;
    const company = COMPANIES.find((c) => c.id === id);

    if (!company) {
        notFound();
    }

    const companyCoins = STABLECOINS.filter(c => c.issuer_company_id === id);

    return (
        <div className={styles.page}>
            <div className={styles.breadcrumb}>
                <Link href="/">Home</Link>
                <span>/</span>
                <Link href="/companies">Companies</Link>
                <span>/</span>
                <span className="text-white">{company.name}</span>
            </div>

            <header className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1 className={`${styles.name} text-gradient`}>{company.name}</h1>
                    <div className={styles.meta}>
                        <span className={styles.badge}>{company.category}</span>
                        <span className="text-[var(--text-secondary)]">
                            {company.jurisdiction_ids.join(', ').toUpperCase()}
                        </span>
                    </div>
                </div>

                <a
                    href={company.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.websiteBtn}
                >
                    Visit Website
                </a>
            </header>

            <section className="mb-12">
                <h2 className={styles.sectionTitle}>Issued Stablecoins</h2>
                {companyCoins.length > 0 ? (
                    <div className={styles.grid}>
                        {companyCoins.map(coin => (
                            <div key={coin.id} className={styles.card}>
                                <h3 className={styles.coinName}>{coin.name} ({coin.ticker})</h3>
                                <div className={styles.coinMeta}>
                                    <span>Peg: {coin.peg_currency}</span>
                                    <span className={styles.tag}>{coin.type}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-[var(--text-secondary)]">No stablecoins listed.</p>
                )}
            </section>
        </div>
    );
}
