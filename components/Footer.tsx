import styles from './Footer.module.css';

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
                        <li><a href="/learn">Learn Basics</a></li>
                        <li><a href="/latest">Latest Updates</a></li>
                        <li><a href="/playbooks">Playbooks</a></li>
                        <li><a href="/careers">Careers</a></li>
                    </ul>
                </div>

                <div className={styles.column}>
                    <h4>Legal & Compliance</h4>
                    <ul className={styles.links}>
                        <li><a href="/disclaimer">Disclaimer</a></li>
                        <li><a href="/terms">Terms of Use</a></li>
                        <li><a href="/privacy">Privacy Policy</a></li>
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
