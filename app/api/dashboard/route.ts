import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 60 minutes

export async function GET() {
    try {
        const [stablecoinsRes, chartsRes, chainsRes, cgRes] = await Promise.all([
            fetch('https://stablecoins.llama.fi/stablecoins?includePrices=true', { next: { revalidate: 3600 } }),
            fetch('https://stablecoins.llama.fi/stablecoincharts/all', { next: { revalidate: 3600 } }),
            fetch('https://stablecoins.llama.fi/stablecoinchains', { next: { revalidate: 3600 } }),
            fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=stablecoins&per_page=50', { next: { revalidate: 3600 } })
        ]);

        if (!stablecoinsRes.ok || !chartsRes.ok || !chainsRes.ok || !cgRes.ok) {
            throw new Error('Failed to fetch from APIs');
        }

        const stablecoins = await stablecoinsRes.json();
        const chartsAll = await chartsRes.json();
        const chainsAll = await chainsRes.json();
        const cgData = await cgRes.json();

        // 1. Process KPIs
        const validCoins = stablecoins.peggedAssets?.filter((c: any) => c.circulating?.peggedUSD >= 1000) || [];

        // Sort coins by market cap descending right away
        validCoins.sort((a: any, b: any) => (b.circulating?.peggedUSD || 0) - (a.circulating?.peggedUSD || 0));

        const totalSupply = validCoins.reduce((sum: number, c: any) => sum + (c.circulating?.peggedUSD || 0), 0);
        const numStablecoins = validCoins.length;

        const largestIssuer = validCoins[0];
        const topIssuerShare = largestIssuer ? ((largestIssuer.circulating?.peggedUSD || 0) / totalSupply) * 100 : 0;
        const topIssuerName = largestIssuer?.symbol || 'N/A';

        const activeChainsCount = chainsAll.filter((chain: any) => (chain.totalCirculatingUSD?.peggedUSD || 0) > 100000000).length;

        // Changes calculation (from charts)
        const todayChart = chartsAll[chartsAll.length - 1];
        const chart7dAgo = chartsAll.length >= 8 ? chartsAll[chartsAll.length - 8] : null; // 7 days prior
        const chart30dAgo = chartsAll.length >= 31 ? chartsAll[chartsAll.length - 31] : null;

        let supplyChange7d = 0;
        let supplyChange30d = 0;

        if (todayChart && chart7dAgo) {
            const todaySupply = todayChart.totalCirculatingUSD?.peggedUSD || 0;
            const supply7dAgo = chart7dAgo.totalCirculatingUSD?.peggedUSD || todaySupply;
            supplyChange7d = supply7dAgo > 0 ? ((todaySupply - supply7dAgo) / supply7dAgo) * 100 : 0;
        }

        if (todayChart && chart30dAgo) {
            const todaySupply = todayChart.totalCirculatingUSD?.peggedUSD || 0;
            const supply30dAgo = chart30dAgo.totalCirculatingUSD?.peggedUSD || todaySupply;
            supplyChange30d = supply30dAgo > 0 ? ((todaySupply - supply30dAgo) / supply30dAgo) * 100 : 0;
        }

        const kpis = {
            totalSupply,
            supplyChange7d,
            numStablecoins,
            supplyChange30d, // assuming numStablecoins change isn't trivial to historically compute, we output the overall supply change 30d for context or compute length diff if needed
            topIssuerShare,
            topIssuerName,
            activeChainsCount,
        };

        // 2. Supply History (last 365 days by default)
        const supplyHistory = chartsAll.slice(-365).map((point: any) => ({
            date: new Date(Number(point.date) * 1000).toISOString(),
            value: point.totalCirculatingUSD?.peggedUSD || 0
        }));

        // 3. Leaderboard
        const top10Coins = validCoins.slice(0, 10);

        // Fetch historical data for top 10 coins
        const coinHistories = await Promise.all(
            top10Coins.map((coin: any) =>
                fetch(`https://stablecoins.llama.fi/stablecoin/${coin.id}`, { next: { revalidate: 3600 } })
                    .then(res => res.json())
                    .catch(() => null)
            )
        );

        const leaderboard = top10Coins.map((coin: any, index: number) => {
            // Find volume from CoinGecko
            const cgCoin = cgData.find((c: any) => c.symbol.toLowerCase() === coin.symbol.toLowerCase());
            const volume24h = cgCoin ? cgCoin.total_volume : null;

            // Calculate 7d and 30d change
            const history = coinHistories[index];
            let change7d = null;
            let change30d = null;

            if (history && history.tokens && history.tokens.length > 0) {
                const currentSupply = coin.circulating?.peggedUSD || 0;

                // tokens array usually has daily snapshots
                const tokens = history.tokens;
                const token7dAgo = tokens.length >= 8 ? tokens[tokens.length - 8].circulating?.peggedUSD : null;
                const token30dAgo = tokens.length >= 31 ? tokens[tokens.length - 31].circulating?.peggedUSD : null;

                if (token7dAgo && token7dAgo > 0) {
                    change7d = ((currentSupply - token7dAgo) / token7dAgo) * 100;
                }

                if (token30dAgo && token30dAgo > 0) {
                    change30d = ((currentSupply - token30dAgo) / token30dAgo) * 100;
                }
            }

            return {
                id: coin.id,
                symbol: coin.symbol,
                name: coin.name,
                pegType: coin.pegType || 'peggedUSD',
                marketCap: coin.circulating?.peggedUSD || 0,
                chains: Object.keys(coin.chainBalances || {}).length,
                price: coin.price || null,
                volume24h,
                change7d,
                change30d
            };
        });

        // 4. Chain Distribution
        // Sort chains by supply desc
        chainsAll.sort((a: any, b: any) => (b.totalCirculatingUSD?.peggedUSD || 0) - (a.totalCirculatingUSD?.peggedUSD || 0));
        const top8Chains = chainsAll.slice(0, 8);
        const otherChains = chainsAll.slice(8);

        // Convert to target shape
        const chainDistribution = top8Chains.map((chain: any) => ({
            name: chain.name,
            supply: chain.totalCirculatingUSD?.peggedUSD || 0,
        }));

        const othersSupply = otherChains.reduce((sum: number, chain: any) => sum + (chain.totalCirculatingUSD?.peggedUSD || 0), 0);
        if (othersSupply > 0) {
            chainDistribution.push({
                name: 'Others',
                supply: othersSupply,
                count: otherChains.length
            });
        }

        // 5. Peg Health
        const pegHealth = top10Coins.map((coin: any) => {
            const price = coin.price || 1; // Fallback to 1 if no price available
            // Simple deviation assuming target is $1 for USD pegs
            // For non-USD, we'd need target rate. PRD says: abs(price - targetRate) for others.
            // E.g EURC price is in USD, so to check peg we need EUR/USD rate.
            // DefiLlama 'price' is in USD. This is a known nuance. MVP: we will calculate raw deviation from 1.0 for peggedUSD.

            let devPercentage = 0;
            if (coin.pegType === 'peggedUSD' || coin.pegType === 'peggedEUR' && price) {
                // For simplicity in MVP if not USD, we report raw price, but accurate deviation relies on FX rate
                // Let's assume standard USD peg check for now as majority are USD
                if (coin.pegType === 'peggedUSD') {
                    devPercentage = Math.abs(price - 1.0) * 100;
                }
            }

            let status = 'ON PEG';
            if (devPercentage > 1.0) status = 'DEPEG ALERT';
            else if (devPercentage > 0.5) status = 'WATCH';

            return {
                id: coin.id,
                symbol: coin.symbol,
                price: price,
                devPercentage: devPercentage, // Absolute deviation
                rawDeviation: (price - 1.0) * 100, // Directional deviation (+/-)
                status: status,
                pegType: coin.pegType
            };
        });

        return NextResponse.json({
            kpis,
            supplyHistory,
            leaderboard,
            chainDistribution,
            pegHealth,
            lastUpdatedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
    }
}
