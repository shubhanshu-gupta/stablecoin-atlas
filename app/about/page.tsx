import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us',
    description: 'Learn about Stablecoin Atlas and our mission to demystify cryptocurrencies, digital assets, and stablecoins.',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-4" style={{ maxWidth: 800, margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>About Stablecoin Atlas</h1>

            <p style={{ marginBottom: '1.5rem', lineHeight: '1.7' }}>
                Welcome to Stablecoin Atlas, your comprehensive and regulated-first guide to the stablecoin and cryptocurrency ecosystem.
                Our mission is to help individuals and businesses understand, evaluate, and safely interact with digital assets designed for stability.
            </p>

            <h2 style={{ fontSize: '1.75rem', marginTop: '2.5rem', marginBottom: '1rem' }}>Our Mission</h2>
            <p style={{ marginBottom: '1.5rem', lineHeight: '1.7' }}>
                In a rapidly evolving Web3 and decentralized finance (DeFi) landscape, stablecoins act as the crucial bridge between traditional finance (Fiat) and blockchain technologies.
                We provide transparent data, educational playbooks, and the latest updates to ensure you can navigate global payments confidently.
            </p>

            <h2 style={{ fontSize: '1.75rem', marginTop: '2.5rem', marginBottom: '1rem' }}>What We Offer</h2>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', lineHeight: '1.7' }}>
                <li style={{ marginBottom: '0.5rem' }}><strong>Educational Resources:</strong> Learn the basics of how stablecoins like USDC, XSGD, and PYUSD work.</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>Transfer Playbooks:</strong> Step-by-step guides for moving value across borders seamlessly and cheaply.</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>Industry Updates:</strong> The latest news from regulators and digital asset issuers around the world.</li>
            </ul>
        </div>
    );
}
