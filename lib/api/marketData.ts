export type MarketData = {
    market_cap: number | null;
    volume_24h: number | null;
    supply_change_30d: number | null;
    chain_distribution: { chain: string; percentage: number }[];
};

const COINGECKO_ID_MAP: Record<string, string> = {
    usdc: 'usd-coin',
    usdt: 'tether',
    pyusd: 'paypal-usd',
    xsgd: 'xsgd',
    eurc: 'euro-coin',
    fdusd: 'first-digital-usd',
    eurs: 'stasis-eurs',
    gbpt: 'tether-gbp',
    dai: 'dai',
    usdp: 'paxos-standard',
};

// Next.js caching configuration
const fetchOptions: RequestInit = {
    next: { revalidate: 86400 }, // Cache for 24 hours
};

export async function getMarketData(stablecoinId: string): Promise<MarketData> {
    const geckoId = COINGECKO_ID_MAP[stablecoinId];
    if (!geckoId) {
        return { market_cap: null, volume_24h: null, supply_change_30d: null, chain_distribution: [] };
    }

    try {
        // Fetch CoinGecko Data
        const cgRes = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${geckoId}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true`,
            fetchOptions
        );
        const cgData = await cgRes.json();
        
        const market_cap = cgData[geckoId]?.usd_market_cap || null;
        const volume_24h = cgData[geckoId]?.usd_24h_vol || null;

        // Fetch DeFiLlama Data
        const dlRes = await fetch(`https://stablecoins.llama.fi/stablecoins`, fetchOptions);
        const dlData = await dlRes.json();
        
        let supply_change_30d: number | null = null;
        let chain_distribution: { chain: string; percentage: number }[] = [];

        const dlCoin = dlData.peggedAssets?.find((asset: any) => asset.gecko_id === geckoId);
        
        if (dlCoin) {
            const currentCirc = dlCoin.circulating?.peggedUSD || 0;
            const prevMonthCirc = dlCoin.circulatingPrevMonth?.peggedUSD || 0;
            
            if (prevMonthCirc > 0) {
                supply_change_30d = ((currentCirc - prevMonthCirc) / prevMonthCirc) * 100;
            }

            if (dlCoin.chainCirculating) {
                const chains = Object.keys(dlCoin.chainCirculating);
                let totalChainSupply = 0;
                const chainAmounts: Record<string, number> = {};

                for (const chain of chains) {
                    const amount = dlCoin.chainCirculating[chain].current?.peggedUSD || 0;
                    chainAmounts[chain] = amount;
                    totalChainSupply += amount;
                }

                if (totalChainSupply > 0) {
                    for (const chain of chains) {
                        const amount = chainAmounts[chain];
                        if (amount > 0) {
                            chain_distribution.push({
                                chain,
                                percentage: (amount / totalChainSupply) * 100
                            });
                        }
                    }
                    
                    // Sort descending and keep top 5
                    chain_distribution.sort((a, b) => b.percentage - a.percentage);
                    chain_distribution = chain_distribution.slice(0, 5);
                }
            }
        }

        return {
            market_cap,
            volume_24h,
            supply_change_30d,
            chain_distribution,
        };
    } catch (error) {
        console.error(`Error fetching market data for ${stablecoinId}:`, error);
        return { market_cap: null, volume_24h: null, supply_change_30d: null, chain_distribution: [] };
    }
}
