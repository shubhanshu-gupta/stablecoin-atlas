import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Disclaimer',
    description: 'Financial and legal disclaimer for Stablecoin Atlas.',
};

export default function DisclaimerPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-4" style={{ maxWidth: 800, margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Disclaimer</h1>

            <p style={{ marginBottom: '1.5rem', lineHeight: '1.7', fontWeight: 'bold', fontSize: '1.125rem' }}>
                Stablecoin Atlas is an educational platform. The information provided does not constitute investment advice, financial advice, trading advice, or any other sort of advice.
            </p>

            <p style={{ marginBottom: '1.5rem', lineHeight: '1.7' }}>
                Cryptocurrencies, including stablecoins and other digital assets, are highly volatile and carry a high level of risk. The regulatory landscape for digital assets is uncertain and varies significantly by jurisdiction.
            </p>

            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', lineHeight: '1.7' }}>
                <li style={{ marginBottom: '0.5rem' }}>
                    <strong>No Guarantees:</strong> We do not guarantee that any "stablecoin" will maintain its peg. Past performance of a digital asset is not indicative of future results.
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                    <strong>Do Your Own Research (DYOR):</strong> You must conduct your own due diligence before interacting with any decentralized finance (DeFi) protocols, smart contracts, or centralized exchanges (CEX).
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                    <strong>Loss of Funds:</strong> Sending cryptoassets to the wrong network (e.g., Ethereum, Solana, Polygon) or to the wrong address can result in permanent and unrecoverable loss. Always double-check your transactions.
                </li>
            </ul>
        </div>
    );
}
