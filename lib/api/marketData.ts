export type MarketData = {
    market_cap: number | null;
    volume_24h: number | null;
    supply_change_30d: number | null;
    chain_distribution: { chain: string; percentage: number }[];
    supply_history?: { date: string; value: number }[];
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
        return { market_cap: null, volume_24h: null, supply_change_30d: null, chain_distribution: [], supply_history: [] };
    }

    try {
        // Fetch CoinGecko Data
        const cgRes = await fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${geckoId}`,
            fetchOptions
        );
        const cgData = await cgRes.json();
        
        let market_cap = null;
        let volume_24h = null;

        if (Array.isArray(cgData) && cgData.length > 0) {
            market_cap = cgData[0].market_cap || null;
            volume_24h = cgData[0].total_volume || null;
        }

        // Fetch DeFiLlama Data
        const dlRes = await fetch(`https://stablecoins.llama.fi/stablecoins`, fetchOptions);
        const dlData = await dlRes.json();
        
        let supply_change_30d: number | null = null;
        let chain_distribution: { chain: string; percentage: number }[] = [];
        let supply_history: { date: string; value: number }[] = [];

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

            // Fetch historical supply for this specific coin
            try {
                const histRes = await fetch(`https://stablecoins.llama.fi/stablecoin/${dlCoin.id}`, fetchOptions);
                if (histRes.ok) {
                    const histData = await histRes.json();
                    if (histData.tokens && Array.isArray(histData.tokens)) {
                        supply_history = histData.tokens.map((t: any) => ({
                            date: new Date(t.date * 1000).toISOString(),
                            value: t.circulating?.peggedUSD || 0
                        }));
                    }
                }
            } catch (err) {
                console.error(`Error fetching historical data for ${dlCoin.id}:`, err);
            }
        }

        return {
            market_cap,
            volume_24h,
            supply_change_30d,
            chain_distribution,
            supply_history,
        };
    } catch (error) {
        console.error(`Error fetching market data for ${stablecoinId}:`, error);
        return { market_cap: null, volume_24h: null, supply_change_30d: null, chain_distribution: [], supply_history: [] };
    }
}
