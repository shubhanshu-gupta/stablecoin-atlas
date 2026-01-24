import Link from 'next/link';
import styles from './page.module.css';

export default function LearningPage() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className="text-gradient">Stablecoin Learning Hub</h1>
                <p className={styles.subtitle}>
                    Master the fundamentals of stablecoins, global regulations, and operational playbooks.
                </p>
            </header>

            <div className={styles.grid}>
                {/* Playbooks Section */}
                <div className={styles.card}>
                    <h2>Transfer Playbooks</h2>
                    <p>Step-by-step guides for moving money across borders using stablecoins.</p>
                    <ul className={styles.list}>
                        <li><Link href="/playbooks/us-uk">🇺🇸 USD to 🇬🇧 GBP</Link></li>
                        <li><Link href="/playbooks/uk-eu">🇬🇧 GBP to 🇪🇺 EUR</Link></li>
                        <li><Link href="/playbooks/sg-uk">🇸🇬 SGD to 🇬🇧 GBP</Link></li>
                    </ul>
                    <Link href="/playbooks" className={styles.cta}>View All Playbooks &rarr;</Link>
                </div>

                {/* Future Sections Placeholder */}
                <div className={styles.card}>
                    <h2>Stablecoin Basics</h2>
                    <p>Coming Soon. extensive guides on how stablecoins work, types of collateral, and risks.</p>
                    <span className={styles.disabledCta}>Coming Soon</span>
                </div>

                <div className={styles.card}>
                    <h2>Global Regulations</h2>
                    <p>Coming Soon. Deep dive into MiCA, VARA, MAS, and other regulatory frameworks.</p>
                    <span className={styles.disabledCta}>Coming Soon</span>
                </div>
            </div>
        </div>
    );
}
