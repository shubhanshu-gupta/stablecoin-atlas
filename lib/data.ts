import { Company, Jurisdiction, Regulator, Stablecoin, Corridor } from './types';

export const JURISDICTIONS: Jurisdiction[] = [
    { id: 'sg', country_or_region: 'Singapore', flag_emoji: '🇸🇬' },
    { id: 'uk', country_or_region: 'United Kingdom', flag_emoji: '🇬🇧' },
    { id: 'us', country_or_region: 'United States', flag_emoji: '🇺🇸' },
    { id: 'eu', country_or_region: 'European Union', flag_emoji: '🇪🇺' },
];

export const REGULATORS: Regulator[] = [
    { id: 'mas', name: 'Monetary Authority of Singapore', jurisdiction_id: 'sg', website_url: 'https://www.mas.gov.sg' },
    { id: 'fca', name: 'Financial Conduct Authority', jurisdiction_id: 'uk', website_url: 'https://www.fca.org.uk' },
    { id: 'nydfs', name: 'NYDFS', jurisdiction_id: 'us', website_url: 'https://www.dfs.ny.gov' },
];

export const COMPANIES: Company[] = [
    { id: 'circle', name: 'Circle', category: 'Issuer', jurisdiction_ids: ['us', 'sg', 'eu'], website_url: 'https://www.circle.com' },
    { id: 'paxos', name: 'Paxos', category: 'Issuer', jurisdiction_ids: ['us', 'sg'], website_url: 'https://paxos.com' },
    { id: 'straitsx', name: 'StraitsX', category: 'Issuer', jurisdiction_ids: ['sg'], website_url: 'https://straitsx.com' },
    { id: 'tether', name: 'Tether', category: 'Issuer', jurisdiction_ids: [], website_url: 'https://tether.to' },
    { id: 'first_digital', name: 'First Digital', category: 'Issuer', jurisdiction_ids: [], website_url: 'https://firstdigitallabs.com' },
    { id: 'stasis', name: 'Stasis', category: 'Issuer', jurisdiction_ids: ['eu'], website_url: 'https://stasis.net' },
    { id: 'sky', name: 'Sky (formerly MakerDAO)', category: 'Issuer', jurisdiction_ids: [], website_url: 'https://sky.money' },
];

export const STABLECOINS: Stablecoin[] = [
    {
        id: 'usdc',
        name: 'USD Coin',
        ticker: 'USDC',
        issuer_company_id: 'circle',
        peg_currency: 'USD',
        type: 'Fiat-Backed',
        summary: 'A fully reserved, fiat-backed stablecoin pegged to the US Dollar, issued by Circle.',
        badges: ['REGULATED_FRAMEWORK_ALIGNED', 'REDEMPTION_POLICY_DISCLOSED', 'ATTESTATION_OR_AUDIT_LINKED'],
        backing_description: 'Held in cash and short-term US Treasuries at regulated financial institutions.',
        reserve_composition: [
            { asset_type: 'US Treasuries', percentage: 80, source_url: 'https://www.circle.com/en/transparency' },
            { asset_type: 'Cash', percentage: 20, source_url: 'https://www.circle.com/en/transparency' }
        ],
        attestation_frequency: 'monthly',
        latest_attestation_url: 'https://www.circle.com/en/transparency',
        latest_attestation_date: '2026-03-31',
        attestation_provider: 'Deloitte',
        redemption_policy_url: 'https://www.circle.com/en/legal/usdc-terms',
        redemption_policy_notes: '1:1 redemption available for registered businesses.',
        depeg_events: [
            { date: '2023-03-11', magnitude_pct: 12, notes: 'Silicon Valley Bank failure' }
        ],
        regulatory_alignments: [
            { jurisdiction_id: 'sg', framework: 'MAS Stablecoin Framework', status: 'Aligned', basis: 'Circle holds an MPI license from MAS.', last_reviewed_at: '2026-04-01' },
            { jurisdiction_id: 'eu', framework: 'MiCA EMT', status: 'Aligned', basis: 'Circle Mint France is an authorized EMI.', last_reviewed_at: '2026-04-01' }
        ],
        supported_chains: [
            { chain_name: 'Ethereum', contract_address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', explorer_url: 'https://etherscan.io/token/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' },
            { chain_name: 'Solana', contract_address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', explorer_url: 'https://solscan.io/token/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' }
        ],
        notable_events: [
            { date: '2023-09-06', action_type: 'Policy Change', summary: 'Circle announces USDC native issuance on Base mainnet.', evidence_url: 'https://www.circle.com/blog/usdc-now-available-natively-on-base' },
            { date: '2023-09-21', action_type: 'License', summary: 'Circle receives Major Payment Institution (MPI) licence from MAS.', evidence_url: 'https://www.mas.gov.sg/regulation/payments/major-payment-institutions' },
            { date: '2024-03-21', action_type: 'License', summary: 'Circle Mint France receives EMI authorisation under MiCA, enabling USDC as a regulated EMT in the EU.', evidence_url: 'https://www.circle.com/blog/circle-receives-emi-license-in-france' },
            { date: '2024-09-05', action_type: 'Chain Expansion', summary: "USDC natively launched on Arbitrum via Circle's CCTP.", evidence_url: 'https://www.circle.com/blog/usdc-now-available-natively-on-arbitrum' },
        ],
        last_verified_at: '2026-04-20',
        created_at: '2026-04-01'
    },
    {
        id: 'usdt',
        name: 'Tether USD',
        ticker: 'USDT',
        issuer_company_id: 'tether',
        peg_currency: 'USD',
        type: 'Fiat-Backed',
        summary: 'The largest fiat-backed stablecoin by market cap, issued by Tether.',
        badges: ['REDEMPTION_POLICY_DISCLOSED', 'ATTESTATION_OR_AUDIT_LINKED'],
        backing_description: 'Backed by US Treasuries, reverse repo notes, money market funds, and other assets.',
        reserve_composition: [
            { asset_type: 'US Treasuries', percentage: 70 },
            { asset_type: 'Other', percentage: 30 }
        ],
        attestation_frequency: 'quarterly',
        latest_attestation_url: 'https://tether.to/en/transparency/',
        latest_attestation_date: '2026-03-31',
        attestation_provider: 'BDO Italia',
        redemption_policy_url: 'https://tether.to/en/legal/',
        redemption_policy_notes: 'Minimum redemption amount of $100k, subject to fees.',
        depeg_events: [],
        regulatory_alignments: [
            { jurisdiction_id: 'eu', framework: 'MiCA EMT', status: 'Unknown', basis: 'Awaiting clarity on EU compliance status.', last_reviewed_at: '2026-04-01' }
        ],
        supported_chains: [
            { chain_name: 'Ethereum', contract_address: '0xdac17f958d2ee523a2206206994597c13d831ec7', explorer_url: 'https://etherscan.io/token/0xdac17f958d2ee523a2206206994597c13d831ec7' },
            { chain_name: 'Tron', contract_address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', explorer_url: 'https://tronscan.org/#/token20/TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t' }
        ],
        notable_events: [
            { date: '2021-10-15', action_type: 'Chain Expansion', summary: 'Tether launches USDT on Avalanche C-Chain.', evidence_url: 'https://tether.to/en/tether-usd-usdt-now-available-on-avalanche/' },
            { date: '2023-06-10', action_type: 'Enforcement', summary: "CFTC and DOJ investigations into Tether's reserve practices cited in Binance settlement documents.", evidence_url: 'https://www.cftc.gov/PressRoom/PressReleases/8774-23' },
            { date: '2024-11-07', action_type: 'Attestation', summary: 'Tether publishes Q3 2024 attestation report showing $125B in reserves.', evidence_url: 'https://tether.to/en/transparency/' },
        ],
        last_verified_at: '2026-04-20',
        created_at: '2026-04-01'
    },
    {
        id: 'pyusd',
        name: 'PayPal USD',
        ticker: 'PYUSD',
        issuer_company_id: 'paxos',
        peg_currency: 'USD',
        type: 'Fiat-Backed',
        summary: 'A fiat-backed stablecoin issued by Paxos for PayPal, designed for payments.',
        badges: ['REGULATED_FRAMEWORK_ALIGNED', 'REDEMPTION_POLICY_DISCLOSED', 'ATTESTATION_OR_AUDIT_LINKED'],
        backing_description: 'Fully backed by US dollar deposits, US Treasuries, and cash equivalents.',
        reserve_composition: [],
        attestation_frequency: 'monthly',
        latest_attestation_url: 'https://paxos.com/pyusd-transparency/',
        latest_attestation_date: '2026-03-31',
        attestation_provider: 'Withum',
        redemption_policy_url: 'https://paxos.com/pyusd-transparency/',
        redemption_policy_notes: '1:1 redemption through Paxos or PayPal interfaces.',
        depeg_events: [],
        regulatory_alignments: [
            { jurisdiction_id: 'us', framework: 'NYDFS BitLicense', status: 'Aligned', basis: 'Issued by Paxos, a NYDFS-regulated trust company.', last_reviewed_at: '2026-04-01' }
        ],
        supported_chains: [
            { chain_name: 'Ethereum', contract_address: '0x6c3ea9036406852006290770bedfcaba0e23a0e8', explorer_url: 'https://etherscan.io/token/0x6c3ea9036406852006290770bedfcaba0e23a0e8' },
            { chain_name: 'Solana', contract_address: '2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZofHmWsZVA2', explorer_url: 'https://solscan.io/token/2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZofHmWsZVA2' }
        ],
        notable_events: [
            { date: '2023-08-07', action_type: 'Other', summary: 'PayPal announces PYUSD launch, the first stablecoin by a major US payments company.', evidence_url: 'https://newsroom.paypal-corp.com/2023-08-07-PayPal-Launches-U-S-Dollar-Stablecoin' },
            { date: '2024-05-29', action_type: 'Chain Expansion', summary: 'PYUSD launches natively on Solana, expanding beyond Ethereum.', evidence_url: 'https://newsroom.paypal-corp.com/2024-05-29-PayPal-USD-Launches-on-Solana' },
        ],
        last_verified_at: '2026-04-20',
        created_at: '2026-04-01'
    },
    {
        id: 'xsgd',
        name: 'XSGD',
        ticker: 'XSGD',
        issuer_company_id: 'straitsx',
        peg_currency: 'SGD',
        type: 'Fiat-Backed',
        summary: 'A stablecoin pegged to the Singapore Dollar, issued by StraitsX.',
        badges: ['REGULATED_FRAMEWORK_ALIGNED', 'REDEMPTION_POLICY_DISCLOSED', 'ATTESTATION_OR_AUDIT_LINKED'],
        backing_description: 'Fully backed by Singapore Dollars held in regulated local banks.',
        reserve_composition: [
            { asset_type: 'Cash', percentage: 100 }
        ],
        attestation_frequency: 'monthly',
        latest_attestation_url: 'https://www.straitsx.com/transparency',
        latest_attestation_date: '2026-03-31',
        attestation_provider: 'RSM',
        redemption_policy_url: 'https://www.straitsx.com',
        redemption_policy_notes: '1:1 redemption through StraitsX platform.',
        depeg_events: [],
        regulatory_alignments: [
            { jurisdiction_id: 'sg', framework: 'MAS Stablecoin Framework', status: 'Aligned', basis: 'StraitsX is a Major Payment Institution licensed by MAS.', last_reviewed_at: '2026-04-01' }
        ],
        supported_chains: [
            { chain_name: 'Ethereum', contract_address: '0x70e8de73ce538da2beed35d14187f6959a8eca96', explorer_url: 'https://etherscan.io/token/0x70e8de73ce538da2beed35d14187f6959a8eca96' },
            { chain_name: 'Polygon', contract_address: '0xdc3326e71d45186f113a2f448984ca0e8d201995', explorer_url: 'https://polygonscan.com/token/0xdc3326e71d45186f113a2f448984ca0e8d201995' }
        ],
        notable_events: [
            { date: '2020-09-21', action_type: 'Other', summary: 'StraitsX launches XSGD, the first regulated SGD-pegged stablecoin.', evidence_url: 'https://straitsx.com' },
            { date: '2023-06-01', action_type: 'License', summary: 'StraitsX (Xfers) granted Major Payment Institution licence by MAS under the Payment Services Act.', evidence_url: 'https://www.mas.gov.sg/regulation/payments/major-payment-institutions' },
            { date: '2024-02-15', action_type: 'Chain Expansion', summary: 'XSGD expands to Polygon network, enabling lower-cost cross-border transfers.', evidence_url: 'https://straitsx.com' },
        ],
        last_verified_at: '2026-04-20',
        created_at: '2026-04-01'
    },
    {
        id: 'eurc',
        name: 'EURC',
        ticker: 'EURC',
        issuer_company_id: 'circle',
        peg_currency: 'EUR',
        type: 'Fiat-Backed',
        summary: 'A euro-backed stablecoin issued by Circle.',
        badges: ['REGULATED_FRAMEWORK_ALIGNED', 'REDEMPTION_POLICY_DISCLOSED', 'ATTESTATION_OR_AUDIT_LINKED'],
        backing_description: 'Backed 100% by euros held in euro-denominated banking accounts.',
        reserve_composition: [
            { asset_type: 'Cash', percentage: 100 }
        ],
        attestation_frequency: 'monthly',
        latest_attestation_url: 'https://www.circle.com/en/transparency',
        latest_attestation_date: '2026-03-31',
        attestation_provider: 'Deloitte',
        redemption_policy_url: 'https://www.circle.com/en/legal/eurc-terms',
        redemption_policy_notes: '1:1 redemption available for registered businesses.',
        depeg_events: [],
        regulatory_alignments: [
            { jurisdiction_id: 'eu', framework: 'MiCA EMT', status: 'Aligned', basis: 'Circle Mint France is an authorized EMI.', last_reviewed_at: '2026-04-01' }
        ],
        supported_chains: [
            { chain_name: 'Ethereum', contract_address: '0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c', explorer_url: 'https://etherscan.io/token/0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c' }
        ],
        notable_events: [
            { date: '2023-07-20', action_type: 'Other', summary: 'Circle launches EURC (formerly EUROC), a fully reserved euro stablecoin.', evidence_url: 'https://www.circle.com/blog/euro-coin-becomes-eurc' },
            { date: '2024-07-01', action_type: 'License', summary: 'EURC becomes MiCA-compliant as Circle Mint France authorised as EMI by ACPR.', evidence_url: 'https://www.circle.com/blog/circle-receives-emi-license-in-france' },
        ],
        last_verified_at: '2026-04-20',
        created_at: '2026-04-01'
    },
    {
        id: 'fdusd',
        name: 'First Digital USD',
        ticker: 'FDUSD',
        issuer_company_id: 'first_digital',
        peg_currency: 'USD',
        type: 'Fiat-Backed',
        summary: 'A fiat-backed USD stablecoin issued in Hong Kong.',
        badges: ['REDEMPTION_POLICY_DISCLOSED', 'ATTESTATION_OR_AUDIT_LINKED'],
        backing_description: 'Backed by high-quality cash and cash equivalent reserves.',
        reserve_composition: [],
        attestation_frequency: 'monthly',
        latest_attestation_url: 'https://firstdigitallabs.com',
        latest_attestation_date: '2026-03-31',
        attestation_provider: 'Prescient Assurance',
        redemption_policy_url: 'https://firstdigitallabs.com',
        redemption_policy_notes: '1:1 redemption via the First Digital Trust portal.',
        depeg_events: [],
        regulatory_alignments: [],
        supported_chains: [
            { chain_name: 'Ethereum', contract_address: '0xc5f0f7b66764f6ec8c8dff7ba683102295e16409', explorer_url: 'https://etherscan.io/token/0xc5f0f7b66764f6ec8c8dff7ba683102295e16409' }
        ],
        notable_events: [
            { date: '2022-06-01', action_type: 'Other', summary: 'First Digital launches FDUSD targeting institutional and exchange use in Asia.', evidence_url: 'https://firstdigitallabs.com' },
            { date: '2023-11-01', action_type: 'Attestation', summary: 'FDUSD publishes first independent attestation report from Prescient Assurance.', evidence_url: 'https://firstdigitallabs.com' },
        ],
        last_verified_at: '2026-04-20',
        created_at: '2026-04-01'
    },
    {
        id: 'eurs',
        name: 'STASIS EURO',
        ticker: 'EURS',
        issuer_company_id: 'stasis',
        peg_currency: 'EUR',
        type: 'Fiat-Backed',
        summary: 'A euro-backed stablecoin with transparent daily account statements.',
        badges: ['REDEMPTION_POLICY_DISCLOSED', 'ATTESTATION_OR_AUDIT_LINKED'],
        backing_description: 'Backed by euro reserves held in partner banks and institutions.',
        reserve_composition: [],
        attestation_frequency: 'not_disclosed',
        latest_attestation_url: 'https://stasis.net/transparency',
        latest_attestation_date: '2026-03-31',
        attestation_provider: 'BDO Malta',
        redemption_policy_url: 'https://stasis.net',
        redemption_policy_notes: 'Redeemable via STASIS wallet operations.',
        depeg_events: [],
        regulatory_alignments: [],
        supported_chains: [
            { chain_name: 'Ethereum', contract_address: '0xdb25f211ab05b1c97d595516f45794528a807ad8', explorer_url: 'https://etherscan.io/token/0xdb25f211ab05b1c97d595516f45794528a807ad8' }
        ],
        notable_events: [
            { date: '2018-04-01', action_type: 'Other', summary: 'STASIS launches EURS, one of the first euro-pegged stablecoins on Ethereum.', evidence_url: 'https://stasis.net' },
            { date: '2023-01-01', action_type: 'Attestation', summary: 'STASIS publishes attestation by BDO Malta confirming 1:1 euro backing.', evidence_url: 'https://stasis.net/transparency' },
        ],
        last_verified_at: '2026-04-20',
        created_at: '2026-04-01'
    },
    {
        id: 'gbpt',
        name: 'Tether GBP',
        ticker: 'GBPT',
        issuer_company_id: 'tether',
        peg_currency: 'GBP',
        type: 'Fiat-Backed',
        summary: 'A British Pound-pegged stablecoin issued by Tether.',
        badges: ['REDEMPTION_POLICY_DISCLOSED', 'ATTESTATION_OR_AUDIT_LINKED'],
        backing_description: 'Backed by GBP-denominated assets and equivalents.',
        reserve_composition: [],
        attestation_frequency: 'quarterly',
        latest_attestation_url: 'https://tether.to/en/transparency/',
        latest_attestation_date: '2026-03-31',
        attestation_provider: 'BDO Italia',
        redemption_policy_url: 'https://tether.to/en/legal/',
        redemption_policy_notes: 'Minimum redemption amounts apply.',
        depeg_events: [],
        regulatory_alignments: [],
        supported_chains: [
            { chain_name: 'Ethereum', contract_address: '0x0000000000000000000000000000000000000000', explorer_url: 'https://etherscan.io/' } // Mock address
        ],
        notable_events: [
            { date: '2021-06-22', action_type: 'Other', summary: 'Tether launches GBPT, a British Pound-pegged stablecoin on Ethereum.', evidence_url: 'https://tether.to/en/tether-launches-gbpt-a-new-pound-sterling-denominated-stablecoin/' },
        ],
        last_verified_at: '2026-04-20',
        created_at: '2026-04-01'
    },
    {
        id: 'dai',
        name: 'DAI / USDS',
        ticker: 'DAI',
        issuer_company_id: 'sky',
        peg_currency: 'USD',
        type: 'CDP',
        summary: 'A decentralized, crypto-backed stablecoin managed by Sky (formerly MakerDAO).',
        badges: ['REDEMPTION_POLICY_DISCLOSED', 'ATTESTATION_OR_AUDIT_LINKED'],
        backing_description: 'Over-collateralized by a diverse portfolio of crypto assets and real-world assets.',
        reserve_composition: [],
        attestation_frequency: 'not_disclosed',
        latest_attestation_url: null,
        latest_attestation_date: null,
        attestation_provider: null,
        redemption_policy_url: 'https://sky.money',
        redemption_policy_notes: 'Redemption occurs via the underlying CDP smart contracts.',
        depeg_events: [
            { date: '2023-03-11', magnitude_pct: 10, notes: 'Depeg mirroring USDC due to backing composition' }
        ],
        regulatory_alignments: [],
        supported_chains: [
            { chain_name: 'Ethereum', contract_address: '0x6b175474e89094c44da98b954eedeac495271d0f', explorer_url: 'https://etherscan.io/token/0x6b175474e89094c44da98b954eedeac495271d0f' }
        ],
        notable_events: [
            { date: '2017-12-17', action_type: 'Other', summary: 'MakerDAO launches DAI on Ethereum mainnet as the first decentralized stablecoin.', evidence_url: 'https://makerdao.com' },
            { date: '2022-11-18', action_type: 'Policy Change', summary: 'MakerDAO community votes to begin DAI rebranding effort to USDS under new Sky protocol.', evidence_url: 'https://sky.money' },
            { date: '2024-08-27', action_type: 'Policy Change', summary: 'MakerDAO rebrands to Sky; DAI officially rebranded to USDS for new mints.', evidence_url: 'https://sky.money' },
        ],
        last_verified_at: '2026-04-20',
        created_at: '2026-04-01'
    },
    {
        id: 'usdp',
        name: 'Pax Dollar',
        ticker: 'USDP',
        issuer_company_id: 'paxos',
        peg_currency: 'USD',
        type: 'Fiat-Backed',
        summary: 'A regulated USD-pegged stablecoin issued by Paxos.',
        badges: ['REGULATED_FRAMEWORK_ALIGNED', 'REDEMPTION_POLICY_DISCLOSED', 'ATTESTATION_OR_AUDIT_LINKED'],
        backing_description: 'Fully backed by US dollar deposits and short-term US Treasuries.',
        reserve_composition: [],
        attestation_frequency: 'monthly',
        latest_attestation_url: 'https://paxos.com/usdp-transparency/',
        latest_attestation_date: '2026-03-31',
        attestation_provider: 'Withum',
        redemption_policy_url: 'https://paxos.com/usdp-transparency/',
        redemption_policy_notes: '1:1 redemption through Paxos platform.',
        depeg_events: [],
        regulatory_alignments: [
            { jurisdiction_id: 'us', framework: 'NYDFS BitLicense', status: 'Aligned', basis: 'Issued by Paxos, a NYDFS-regulated trust company.', last_reviewed_at: '2026-04-01' }
        ],
        supported_chains: [
            { chain_name: 'Ethereum', contract_address: '0x8e870d67f660d95d5be530380d0ec0bd388289e1', explorer_url: 'https://etherscan.io/token/0x8e870d67f660d95d5be530380d0ec0bd388289e1' }
        ],
        notable_events: [
            { date: '2018-09-26', action_type: 'License', summary: 'Paxos Standard Token (PAX, later USDP) launches as one of the first NYDFS-regulated stablecoins.', evidence_url: 'https://paxos.com' },
            { date: '2021-09-28', action_type: 'Policy Change', summary: 'Paxos renames PAX to Pax Dollar (USDP) to differentiate from the Paxos brand.', evidence_url: 'https://paxos.com/2021/09/28/pax-is-now-pax-dollar-usdp/' },
            { date: '2024-10-01', action_type: 'Attestation', summary: 'Paxos publishes monthly attestation confirming full 1:1 USD backing for USDP.', evidence_url: 'https://paxos.com/usdp-transparency/' },
        ],
        last_verified_at: '2026-04-20',
        created_at: '2026-04-01'
    }
];

export const CORRIDORS: Corridor[] = [
    {
        id: 'sg-uk',
        source_jurisdiction_id: 'sg',
        target_jurisdiction_id: 'uk',
        description: 'Singapore to United Kingdom'
    },
    {
        id: 'us-uk',
        source_jurisdiction_id: 'us',
        target_jurisdiction_id: 'uk',
        description: 'United States to United Kingdom'
    },
    {
        id: 'uk-eu',
        source_jurisdiction_id: 'uk',
        target_jurisdiction_id: 'eu',
        description: 'United Kingdom to European Union'
    },
];
