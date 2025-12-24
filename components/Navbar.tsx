import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
    return (
        <nav className={styles.nav}>
            <div className={styles.container}>
                <div className={styles.content}>
                    {/* Logo */}
                    <Link href="/" className={styles.logo}>
                        <div className={styles.logoIcon}>
                            S
                        </div>
                        <span>Stablecoin Atlas</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className={styles.links}>
                        <Link href="/learn" className={styles.link}>Learn</Link>
                        <Link href="/latest" className={styles.link}>Latest</Link>
                        <Link href="/careers" className={styles.link}>Careers</Link>
                        <Link href="/companies" className={styles.link}>Companies</Link>
                        <Link href="/regulators" className={styles.link}>Regulators</Link>
                        <Link href="/playbooks" className={styles.link}>Playbooks</Link>
                    </div>

                    {/* CTA / Mobile Menu Trigger */}
                    <div className={styles.cta}>
                        {/* Mobile Menu Button - Placeholder */}
                        <button className={styles.mobileMenuBtn}>
                            <span className="sr-only">Open menu</span>
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
