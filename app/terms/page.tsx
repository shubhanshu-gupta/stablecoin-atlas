import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Use',
    description: 'Read the Terms of Use and Terms of Service for Stablecoin Atlas.',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-4" style={{ maxWidth: 800, margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Terms of Use</h1>
            <p style={{ marginBottom: '2rem', fontStyle: 'italic', opacity: 0.8 }}>Last Updated: March 2026</p>

            <p style={{ marginBottom: '1.5rem', lineHeight: '1.7' }}>
                By accessing and using Stablecoin Atlas ("we", "our", or "the Site"), you agree to comply with and be bound by the following Terms of Use. Please read them carefully.
            </p>

            <h2 style={{ fontSize: '1.75rem', marginTop: '2.5rem', marginBottom: '1rem' }}>1. Informational Purposes Only</h2>
            <p style={{ marginBottom: '1.5rem', lineHeight: '1.7' }}>
                All content provided on Stablecoin Atlas is for informational and educational purposes only. We do not provide financial, legal, tax, or investment advice. You should consult a licensed professional before making any financial decisions involving cryptocurrencies, stablecoins, or digital assets.
            </p>

            <h2 style={{ fontSize: '1.75rem', marginTop: '2.5rem', marginBottom: '1rem' }}>2. Accuracy of Information</h2>
            <p style={{ marginBottom: '1.5rem', lineHeight: '1.7' }}>
                While we strive to keep our playbooks, data, and guides up to date, the cryptocurrency ecosystem evolves rapidly. We make no warranties regarding the accuracy, completeness, or reliability of the information provided on our platform.
            </p>

            <h2 style={{ fontSize: '1.75rem', marginTop: '2.5rem', marginBottom: '1rem' }}>3. Third-Party Links</h2>
            <p style={{ marginBottom: '1.5rem', lineHeight: '1.7' }}>
                Our platform may contain links to third-party exchanges, wallets, and decentralized finance (DeFi) services. We are not responsible for the content, privacy policies, or practices of any third-party websites. Use them at your own risk.
            </p>
        </div>
    );
}
