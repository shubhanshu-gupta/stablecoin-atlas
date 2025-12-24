import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

export const revalidate = 3600; // Cache for 1 hour

const FEED_URLS = [
    'https://pymnts.com/feed',
    'https://paymentsjournal.com/feed'
];

const KEYWORDS = [
    'stablecoin',
    'USDC',
    'USDT',
    'tokenized deposits',
    'MiCA',
    'MAS',
    'GENIUS Act',
    'Circle',
    'Paxos'
];

// Helper to check if text contains any keywords
const containsKeyword = (text: string) => {
    const lowerText = text.toLowerCase();
    return KEYWORDS.some(keyword => lowerText.includes(keyword.toLowerCase()));
};

export async function GET() {
    try {
        const parser = new Parser();

        const feedPromises = FEED_URLS.map(async (url) => {
            try {
                const feed = await parser.parseURL(url);
                const source = url.includes('pymnts.com') ? 'PYMNTS' : 'PaymentsJournal';

                return feed.items.map(item => ({
                    title: item.title,
                    link: item.link,
                    pubDate: item.pubDate,
                    contentSnippet: item.contentSnippet,
                    source: source,
                    isoDate: item.isoDate
                }));
            } catch (err) {
                console.error(`Error fetching feed ${url}:`, err);
                return [];
            }
        });

        const allFeeds = await Promise.all(feedPromises);
        const flatFeeds = allFeeds.flat();

        // Filter by keywords
        const filteredNews = flatFeeds.filter(item => {
            const titleMatch = item.title && containsKeyword(item.title);
            const snippetMatch = item.contentSnippet && containsKeyword(item.contentSnippet);
            return titleMatch || snippetMatch;
        });

        // Sort by date (newest first)
        const sortedNews = filteredNews.sort((a, b) => {
            return new Date(b.isoDate || 0).getTime() - new Date(a.isoDate || 0).getTime();
        });

        return NextResponse.json(sortedNews);

    } catch (error) {
        console.error('RSS Fetch Error:', error);
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}
