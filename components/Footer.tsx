import styles from './Footer.module.css';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.brand}>
                    <h3>Stablecoin Atlas</h3>
                    <p>
                        The regulated-first guide to the stablecoin ecosystem. We prioritize transparency and safety.
                    </p>
                </div>

                <div className={styles.column}>
                    <h4>Platform</h4>
                    <ul className={styles.links}>
                        <li><Link href="/learn">Learn Basics</Link></li>
                        <li><Link href="/latest">Latest Updates</Link></li>
                        <li><Link href="/playbooks">Playbooks</Link></li>
                        <li><Link href="/careers">Careers</Link></li>
                    </ul>
                </div>

                <div className={styles.column}>
                    <h4>Legal & Compliance</h4>
                    <ul className={styles.links}>
                        <li><Link href="/disclaimer">Disclaimer</Link></li>
                        <li><Link href="/terms">Terms of Use</Link></li>
                        <li><Link href="/privacy">Privacy Policy</Link></li>
                    </ul>
                </div>

                <div className={styles.column}>
                    <div className={styles.disclaimerBox}>
                        <strong>Disclaimer</strong>
                        This website is for informational purposes only and does not constitute financial or legal advice. Cryptoassets are high-risk.
                    </div>
                </div>
            </div>

            <div className={styles.bottom}>
                &copy; {new Date().getFullYear()} Stablecoin Atlas. All rights reserved.
            </div>
        </footer>
    );
}
