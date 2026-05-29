const fs = require('fs');
const https = require('https');
const path = require('path');

const dir = path.join(__dirname, 'public', 'images', 'coins');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// CoinGecko coin IDs mapped to our ticker names
const coins = {
    usdc:  'usd-coin',
    usdt:  'tether',
    pyusd: 'paypal-usd',
    xsgd:  'xsgd',
    eurc:  'euro-coin',
    fdusd: 'first-digital-usd',
    eurs:  'stasis-eurs',
    gbpt:  'tether-eurt',  // try alt
    dai:   'dai',
    usdp:  'pax-dollar',
};

const get = (url, headers = {}) => new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0', ...headers } }, (res) => {
        let data = '';
        res.on('data', d => data += d);
        res.on('end', () => {
            if (res.statusCode !== 200) reject(new Error(`HTTP ${res.statusCode} for ${url}`));
            else resolve(data);
        });
    }).on('error', reject);
});

const downloadBinary = (url, outPath) => new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outPath);
    const doReq = (u) => {
        https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) { doReq(res.headers.location); return; }
            if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
            res.pipe(file);
            file.on('finish', () => {
                const size = fs.statSync(outPath).size;
                if (size < 1000) reject(new Error(`too small: ${size} bytes`));
                else resolve(size);
            });
        }).on('error', reject);
    };
    doReq(url);
});

(async () => {
    // Fetch image URLs from CoinGecko API
    const ids = Object.values(coins).join(',');
    console.log('Fetching coin data from CoinGecko API...');
    
    try {
        const apiData = await get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&per_page=50`);
        const coinList = JSON.parse(apiData);
        
        // Build ticker -> image URL map
        const geckoMap = {};
        for (const c of coinList) {
            geckoMap[c.id] = c.image; // CoinGecko /thumb or /small from their own API
        }
        
        // Now download each
        for (const [ticker, geckoId] of Object.entries(coins)) {
            const imgUrl = geckoMap[geckoId];
            if (!imgUrl) { console.error(`✗ ${ticker}: no image URL found`); continue; }
            
            // Upgrade to large image
            const largeUrl = imgUrl.replace('/thumb/', '/large/').replace('/small/', '/large/');
            const outPath = path.join(dir, `${ticker}.png`);
            
            try {
                const size = await downloadBinary(largeUrl, outPath);
                console.log(`✓ ${ticker}.png (${size} bytes) from ${largeUrl}`);
            } catch (e) {
                // Fallback to thumb
                try {
                    const size = await downloadBinary(imgUrl, outPath);
                    console.log(`✓ ${ticker}.png (${size} bytes) [thumb fallback]`);
                } catch (e2) {
                    console.error(`✗ ${ticker}: ${e2.message}`);
                }
            }
        }
    } catch (e) {
        console.error('API error:', e.message);
    }
    
    console.log('\nDone!');
})();
