const fs = require('fs');
const content = fs.readFileSync('app/learning/page.tsx', 'utf8');
const urlRegex = /(https?:\/\/[^\s"',]+\.[^\s"',]+)/g;
const matches = content.match(urlRegex) || [];
const urls = [...new Set(matches)];

async function check() {
    let broken = [];
    console.log(`Checking ${urls.length} URLs in page.tsx...`);
    for (const url of urls) {
        if (url.includes('localhost') || url.includes('placeholder')) continue;
        try {
            const res = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' } });
            if (!res.ok) {
                // fallback to GET
                const res2 = await fetch(url, { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0' } });
                if (!res2.ok) {
                    broken.push({ url, status: res2.status });
                }
            }
        } catch (e) {
            broken.push({ url, err: e.message });
        }
    }
    console.log("Broken links:", JSON.stringify(broken, null, 2));
}

check();
