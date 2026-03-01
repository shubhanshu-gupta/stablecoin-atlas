import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'Privacy Policy for Stablecoin Atlas detailing how we handle data.',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-4" style={{ maxWidth: 800, margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Privacy Policy</h1>
            <p style={{ marginBottom: '2rem', fontStyle: 'italic', opacity: 0.8 }}>Last Updated: March 2026</p>

            <p style={{ marginBottom: '1.5rem', lineHeight: '1.7' }}>
                At Stablecoin Atlas, we take your privacy seriously. This Privacy Policy outlines how we collect, use, and protect your information when you visit our website for cryptocurrency and stablecoin educational resources.
            </p>

            <h2 style={{ fontSize: '1.75rem', marginTop: '2.5rem', marginBottom: '1rem' }}>Information We Collect</h2>
            <p style={{ marginBottom: '1.5rem', lineHeight: '1.7' }}>
                We use analytics infrastructure (such as PostHog) to collect aggregated usage data—such as page views and interaction metrics—to improve the user experience.
                By default, this site does not collect personally identifiable information unless it is explicitly volunteered by you.
            </p>

            <h2 style={{ fontSize: '1.75rem', marginTop: '2.5rem', marginBottom: '1rem' }}>Cookies and Analytics</h2>
            <p style={{ marginBottom: '1.5rem', lineHeight: '1.7' }}>
                We use cookies and similar tracking technologies to track activity on our Site. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Site.
            </p>

            <h2 style={{ fontSize: '1.75rem', marginTop: '2.5rem', marginBottom: '1rem' }}>Data Security</h2>
            <p style={{ marginBottom: '1.5rem', lineHeight: '1.7' }}>
                We implement commercially acceptable security measures to protect your information. However, please remember that no method of transmission over the internet or modern digital storage is 100% secure.
            </p>
        </div>
    );
}
