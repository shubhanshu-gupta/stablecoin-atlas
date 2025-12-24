export type Jurisdiction = {
    id: string;
    country_or_region: string; // e.g., 'Singapore', 'European Union'
    flag_emoji: string;
    notes?: string;
};

export type Regulator = {
    id: string;
    name: string; // e.g., 'MAS', 'FCA'
    jurisdiction_id: string;
    website_url: string;
};

export type Company = {
    id: string;
    name: string; // e.g., 'Circle', 'Paxos'
    logo_url?: string;
    category: 'Issuer' | 'Exchange' | 'Custodian' | 'Infrastructure';
    jurisdiction_ids: string[];
    website_url: string;
};

export type Stablecoin = {
    id: string;
    name: string; // e.g., 'USDC', 'XSGD'
    ticker: string;
    issuer_company_id: string;
    peg_currency: 'USD' | 'EUR' | 'SGD' | 'GBP';
    type: 'Fiat-Backed' | 'Crypto-Backed' | 'Algorithmic'; // Mostly Fiat-Backed for regulated
    manual_rating?: number; // Internal confidence score
    badges: ('REGULATED' | 'AUDITED' | 'TRANSPARENT')[];
};

export type Corridor = {
    id: string;
    source_jurisdiction_id: string;
    target_jurisdiction_id: string;
    description: string; // e.g., 'Singapore to UK'
};
