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

export type DepegEvent = {
    date: string; // YYYY-MM-DD
    magnitude_pct: number;
    notes: string;
};

export type RegulatoryAlignment = {
    jurisdiction_id: string;
    framework: string;
    status: 'Aligned' | 'Under review' | 'Not applicable' | 'Unknown';
    basis: string;
    evidence_url?: string;
    last_reviewed_at: string;
};

export type SupportedChain = {
    chain_name: string;
    contract_address: string;
    explorer_url: string;
    bridge_supported?: boolean;
};

export type ReserveAsset = {
    asset_type: string;
    percentage: number;
    source_url?: string;
};

export type Stablecoin = {
    id: string;
    name: string; // e.g., 'USDC', 'XSGD'
    ticker: string;
    issuer_company_id: string;
    peg_currency: 'USD' | 'EUR' | 'SGD' | 'GBP' | 'Other';
    type: 'Fiat-Backed' | 'Algorithmic' | 'Commodity-Backed' | 'CDP';
    summary: string;
    badges: string[]; // e.g., 'REGULATED_FRAMEWORK_ALIGNED', 'REDEMPTION_POLICY_DISCLOSED', 'ATTESTATION_OR_AUDIT_LINKED'
    
    // Zone 2
    backing_description: string;
    reserve_composition: ReserveAsset[];
    attestation_frequency: 'monthly' | 'quarterly' | 'annual' | 'not_disclosed';
    latest_attestation_url: string | null;
    latest_attestation_date: string | null;
    attestation_provider: string | null;
    redemption_policy_url: string | null;
    redemption_policy_notes: string;
    depeg_events: DepegEvent[];
    
    // Zone 3
    regulatory_alignments: RegulatoryAlignment[];
    
    // Zone 4
    supported_chains: SupportedChain[];
    
    last_verified_at: string;
    created_at: string;
};

export type Corridor = {
    id: string;
    source_jurisdiction_id: string;
    target_jurisdiction_id: string;
    description: string; // e.g., 'Singapore to UK'
};
