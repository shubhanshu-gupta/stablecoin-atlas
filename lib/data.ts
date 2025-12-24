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
];

export const STABLECOINS: Stablecoin[] = [
    {
        id: 'usdc',
        name: 'USD Coin',
        ticker: 'USDC',
        issuer_company_id: 'circle',
        peg_currency: 'USD',
        type: 'Fiat-Backed',
        badges: ['REGULATED', 'AUDITED', 'TRANSPARENT']
    },
    {
        id: 'xsgd',
        name: 'XSGD',
        ticker: 'XSGD',
        issuer_company_id: 'straitsx',
        peg_currency: 'SGD',
        type: 'Fiat-Backed',
        badges: ['REGULATED', 'AUDITED']
    },
    {
        id: 'pypusd',
        name: 'PayPal USD',
        ticker: 'PYUSD',
        issuer_company_id: 'paxos',
        peg_currency: 'USD',
        type: 'Fiat-Backed',
        badges: ['REGULATED', 'AUDITED']
    },
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
