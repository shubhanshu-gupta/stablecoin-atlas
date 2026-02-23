'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

const NAV_LINKS = [
    { href: '/learning', label: 'Learning' },
    { href: '/latest', label: 'Latest' },
    { href: '/careers', label: 'Careers' },
];

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className={styles.nav}>
            <div className={styles.container}>
                <div className={styles.content}>
                    {/* Logo */}
                    <Link href="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
                        <div className={styles.logoIcon}>S</div>
                        <span>Stablecoin Atlas</span>
                    </Link>

                    {/* Desktop Nav — centred */}
                    <div className={styles.links}>
                        {NAV_LINKS.map(l => (
                            <Link key={l.href} href={l.href} className={styles.link}>{l.label}</Link>
                        ))}
                    </div>

                    {/* Hamburger (mobile only) */}
                    <button
                        className={styles.mobileMenuBtn}
                        onClick={() => setMenuOpen(o => !o)}
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={menuOpen}
                    >
                        {menuOpen ? (
                            /* X icon */
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            /* Burger icon */
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile drawer */}
            {menuOpen && (
                <div className={styles.mobileMenu}>
                    {NAV_LINKS.map(l => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className={styles.mobileLink}
                            onClick={() => setMenuOpen(false)}
                        >
                            {l.label}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
}
