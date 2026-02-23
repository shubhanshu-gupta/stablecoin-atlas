'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Resource {
    id: string;
    title: string;
    type: 'Article' | 'Video' | 'Podcast' | 'Report' | 'Interactive' | 'Reference' | 'Regulation';
    source: string;
    url: string;
    readTime?: string;
    description?: string;
    stage: 1 | 2 | 3 | 4;
}

interface QuizQuestion {
    q: string;
    options: string[];
    correct: number;
    explanation: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const STAGE_INFO = [
    { num: 1, label: 'Foundations', emoji: '🌱', tagline: 'What is a stablecoin?' },
    { num: 2, label: 'Guided Exploration', emoji: '🗺️', tagline: 'How does the ecosystem work?' },
    { num: 3, label: 'Hands-on Practice', emoji: '🧪', tagline: 'Let me try it myself' },
    { num: 4, label: 'Advanced Mastery', emoji: '🎓', tagline: 'I want to go deep' },
];

const RESOURCES: Resource[] = [
    // Stage 1
    { id: 's1-1', stage: 1, title: 'What Are Stablecoins and How Do They Work?', type: 'Article', source: 'CoinDesk Learn', url: 'https://www.coindesk.com/learn/what-are-stablecoins/', readTime: '8 min read', description: 'The definitive beginner introduction to stablecoins.' },
    { id: 's1-2', stage: 1, title: 'The Three Types of Stablecoins', type: 'Article', source: 'Gemini Cryptopedia', url: 'https://www.gemini.com/cryptopedia/stablecoin-types-fiat', readTime: '6 min read', description: 'Fiat-backed, crypto-backed, and algorithmic — explained with visuals.' },
    { id: 's1-3', stage: 1, title: 'USDC Explained Simply', type: 'Video', source: 'Circle (YouTube)', url: 'https://www.youtube.com/results?search_query=Circle+USDC+explained', readTime: '4 min', description: 'Short, clear explanation of how USDC works and why it matters.' },
    { id: 's1-4', stage: 1, title: 'Why Stablecoins Matter', type: 'Article', source: 'a16z Crypto', url: 'https://a16zcrypto.com/posts/article/why-stablecoins-matter/', readTime: '5 min read', description: 'The big-picture case for stablecoins in the global financial system.' },
    { id: 's1-5', stage: 1, title: 'Stablecoin Glossary', type: 'Reference', source: 'Stablecoin Atlas', url: '/tools/glossary', readTime: '—', description: 'Key terms: collateral, redemption, attestation, peg, and more.' },

    // Stage 2
    { id: 's2-1', stage: 2, title: 'The State of Stablecoins (Annual Report)', type: 'Report', source: 'Visa Research', url: 'https://www.visa.com/visa-everywhere/innovation/money-movement/stablecoins.html', readTime: '30 min read', description: 'Comprehensive annual data on stablecoin adoption, volume, and trends.' },
    { id: 's2-2', stage: 2, title: 'Circle USDC Reserve Transparency Reports', type: 'Article', source: 'Circle', url: 'https://www.circle.com/en/transparency', readTime: '10 min read', description: 'Monthly attestation reports on what backs every USDC in circulation.' },
    { id: 's2-3', stage: 2, title: 'How MiCA Regulates Stablecoins', type: 'Article', source: 'Ledger Insights', url: 'https://www.ledgerinsights.com/mica-stablecoin-regulation/', readTime: '12 min read', description: 'Clear breakdown of EU crypto regulation and what it means for issuers.' },
    { id: 's2-4', stage: 2, title: 'MAS Stablecoin Framework Overview', type: 'Article', source: 'MAS (mas.gov.sg)', url: 'https://www.mas.gov.sg/regulation/stablecoins', readTime: '15 min read', description: 'Singapore\'s official regulatory approach to stablecoin issuers.' },
    { id: 's2-5', stage: 2, title: 'Mint, Burn, Redeem — A Visual Guide', type: 'Video', source: 'Finematics', url: 'https://www.youtube.com/c/Finematics', readTime: '12 min', description: 'The lifecycle of a stablecoin explained with clean animations.' },
    { id: 's2-6', stage: 2, title: 'Stablecoin Landscape Map', type: 'Interactive', source: 'The Block Research', url: 'https://www.theblock.co/data/stablecoins/usd-stablecoin-market-cap', readTime: 'Interactive', description: 'Live interactive map of stablecoin market cap, chains, and issuers.' },
    { id: 's2-7', stage: 2, title: 'PayPal PYUSD: What It Is and How It Works', type: 'Article', source: 'CoinDesk', url: 'https://www.coindesk.com/learn/paypal-usd-pyusd/', readTime: '7 min read', description: 'The story behind the flagship corporate stablecoin from PayPal.' },
    { id: 's2-8', stage: 2, title: 'EURC and MiCA: Circle\'s European Stablecoin', type: 'Article', source: 'Circle Blog', url: 'https://www.circle.com/blog', readTime: '8 min read', description: 'How Circle built a MiCA-compliant EUR stablecoin from the ground up.' },
    { id: 's2-9', stage: 2, title: 'Tether\'s Reserves: A Breakdown', type: 'Article', source: 'Protos', url: 'https://protos.com/category/analysis/', readTime: '10 min read', description: 'Independent analysis of what actually backs USDT reserves.' },
    { id: 's2-10', stage: 2, title: 'StraitsX / XSGD Explainer', type: 'Article', source: 'StraitsX Blog', url: 'https://www.straitsx.com/blog', readTime: '6 min read', description: 'The Singapore-dollar backed stablecoin and its regulatory journey.' },
    { id: 's2-11', stage: 2, title: 'Bankless Podcast — Stablecoin Deep Dive', type: 'Podcast', source: 'Bankless', url: 'https://www.bankless.com/episodes', readTime: '60 min listen', description: 'Deep, nuanced conversation on the stablecoin landscape with top guests.' },
    { id: 's2-12', stage: 2, title: 'Why Stellar for Payments?', type: 'Article', source: 'Stellar.org', url: 'https://stellar.org/learn/intro-to-stellar', readTime: '8 min read', description: 'Why Stellar is the preferred chain for cross-border stablecoin payments.' },

    // Stage 3 — external practice resources
    { id: 's3-1', stage: 3, title: 'MetaMask Learn', type: 'Interactive', source: 'MetaMask', url: 'https://learn.metamask.io', readTime: 'Self-paced', description: 'Wallet basics, network selection, and stablecoin transactions step-by-step.' },
    { id: 's3-2', stage: 3, title: 'Layer3 (Rabbit Hole)', type: 'Interactive', source: 'Layer3.xyz', url: 'https://layer3.xyz', readTime: 'Self-paced', description: 'Hands-on onchain tasks with real stablecoins to earn rewards while learning.' },
    { id: 's3-3', stage: 3, title: 'Coinbase Learn & Earn', type: 'Interactive', source: 'Coinbase', url: 'https://www.coinbase.com/earn', readTime: 'Self-paced', description: 'Watch videos, take quizzes, earn crypto — a classic learn-to-earn format.' },
    { id: 's3-4', stage: 3, title: 'Stellar Quest', type: 'Interactive', source: 'Stellar.org', url: 'https://quest.stellar.org', readTime: 'Self-paced', description: 'Task-based coding challenges for building on Stellar with stablecoins.' },
    { id: 's3-5', stage: 3, title: 'Circle Developer Sandbox', type: 'Interactive', source: 'Circle', url: 'https://developers.circle.com', readTime: 'Self-paced', description: 'Test-drive USDC flows end-to-end using Circle\'s free developer sandbox API.' },

    // Stage 4
    { id: 's4-1', stage: 4, title: 'Regulation (EU) 2023/1114 — MiCA Full Text', type: 'Regulation', source: 'EU Official Journal', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32023R1114', readTime: '3–4 hr read', description: 'The primary source for all MiCA requirements on stablecoin issuers (EMT/ART).' },
    { id: 's4-2', stage: 4, title: 'MAS Stablecoin Regulatory Approach', type: 'Regulation', source: 'MAS', url: 'https://www.mas.gov.sg/regulation/stablecoins', readTime: '45 min read', description: 'Consultation paper + final PS-N02 — the definitive SG framework.' },
    { id: 's4-3', stage: 4, title: 'OCC Interpretive Letter #1174', type: 'Regulation', source: 'OCC (occ.gov)', url: 'https://www.occ.gov/topics/charters-and-licensing/fintech/index-fintech.html', readTime: '20 min read', description: 'US federal bank regulator\'s letter permitting crypto custody activities.' },
    { id: 's4-4', stage: 4, title: 'Tether and the Search for Hard Dollars', type: 'Report', source: 'Protos.com', url: 'https://protos.com', readTime: '30 min read', description: 'Investigative long-form on Tether\'s reserve composition and counterparty risk.' },
    { id: 's4-5', stage: 4, title: 'Circle\'s Reserve Composition: Deep Dive', type: 'Article', source: 'Circle Transparency', url: 'https://www.circle.com/en/transparency', readTime: '20 min read', description: 'Monthly breakdown of T-Bill, money market, and cash reserves backing USDC.' },
    { id: 's4-6', stage: 4, title: 'Stablecoin Depeg Events: A Post-Mortem Collection', type: 'Report', source: 'Dune Analytics / Multiple', url: 'https://dune.com/browse/dashboards?q=stablecoin+depeg', readTime: '90 min read', description: 'Aggregated post-mortems on UST/LUNA, USDN, DEI, and other depeg events.' },
    { id: 's4-7', stage: 4, title: 'Tokenised Deposits vs Stablecoins vs CBDCs', type: 'Report', source: 'BIS', url: 'https://www.bis.org/publ/work1087.htm', readTime: '60 min read', description: 'BIS Working Paper 1087 — the foundational comparative analysis.' },
    { id: 's4-8', stage: 4, title: 'Cross-chain Bridge Security: Technical Analysis', type: 'Article', source: 'Rekt.news', url: 'https://rekt.news', readTime: '45 min read', description: 'Breakdown of $2B+ in bridge hacks and the lessons for cross-chain stablecoin movement.' },
    { id: 's4-9', stage: 4, title: 'Institutional Stablecoin Use Cases', type: 'Report', source: 'Fireblocks / Chainalysis', url: 'https://www.chainalysis.com/reports/', readTime: '30 min read', description: 'Survey of how treasury teams, fintechs, and banks deploy stablecoins operationally.' },
    { id: 's4-10', stage: 4, title: 'The Stablecoin Trilemma', type: 'Article', source: 'CoinGecko Research', url: 'https://www.coingecko.com/research', readTime: '20 min read', description: 'Can a stablecoin simultaneously achieve stability, decentralisation, and capital efficiency?' },
    { id: 's4-11', stage: 4, title: 'Bankless: Stablecoin Regulation Deep Dive', type: 'Podcast', source: 'Bankless', url: 'https://www.bankless.com/episodes', readTime: '75 min listen', description: 'Expert roundtable on MiCA, MAS, and the future of compliant stablecoins.' },
    { id: 's4-12', stage: 4, title: 'Unchained Podcast: MiCA and Stablecoins', type: 'Podcast', source: 'Laura Shin / Unchained', url: 'https://unchainedcrypto.com', readTime: '60 min listen', description: 'Policy deep-dive with crypto legal experts on MiCA\'s real-world effects.' },
    { id: 's4-13', stage: 4, title: 'a16z State of Crypto Report', type: 'Report', source: 'a16z Crypto', url: 'https://a16zcrypto.com/state-of-crypto', readTime: '45 min read', description: 'Annual report tracking macro trends, stablecoin data, and what\'s next.' },
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
    { q: 'What does a fiat-backed stablecoin hold in reserve to maintain its peg?', options: ['Other cryptocurrencies', 'Algorithmic formulas', 'Fiat currency or equivalents like T-Bills', 'Nothing — the peg is trust-based'], correct: 2, explanation: 'Fiat-backed stablecoins like USDC hold cash or near-cash assets (e.g. US Treasury Bills) to back each token 1:1.' },
    { q: 'Which regulatory framework governs stablecoin issuers in the European Union?', options: ['Basel III', 'MiCA (Markets in Crypto-Assets Regulation)', 'FATF Guidance', 'PSD2'], correct: 1, explanation: 'MiCA (Reg. EU 2023/1114) is the comprehensive EU crypto framework. "E-money tokens" (EMTs) like USDC EUR fall under its stablecoin provisions.' },
    { q: 'What is an attestation report in the context of stablecoins?', options: ['A marketing document from the issuer', 'A third-party audit confirming reserves match issued supply', 'A legal contract between the holder and issuer', 'A blockchain transaction log'], correct: 1, explanation: 'Attestations are independent accountant reports that verify reserve assets equal or exceed the stablecoins in circulation — a key trust signal.' },
    { q: 'What happens during a "depeg" event?', options: ['The stablecoin gains value above its target', 'The stablecoin loses its fixed value relationship to the underlying asset', 'The issuer mints new tokens', 'The blockchain network pauses'], correct: 1, explanation: 'A depeg occurs when the stablecoin trades materially above or below its peg — e.g. USDT briefly falling to $0.96 or UST collapsing to near zero in 2022.' },
    { q: 'Which Singapore regulatory framework specifically covers single-currency stablecoins?', options: ['MAS Notice PSN02', 'MTI Digital Token Guidelines', 'SFC Circular 2021', 'MAS Guidelines on AML/CFT'], correct: 0, explanation: 'MAS Payment Services Notice PSN02 sets the requirements for MAS-regulated single-currency stablecoins (MAS-regulated SCS).' },
    { q: 'What is the primary purpose of the "burn" mechanism in a stablecoin?', options: ['To destroy excess tokens and reduce supply when redeeming', 'To punish bad actors on the network', 'To generate yield for the issuer', 'To upgrade the smart contract'], correct: 0, explanation: 'When holders redeem stablecoins for fiat, the tokens are "burned" (destroyed) and the corresponding fiat is released from reserves, keeping supply in balance.' },
    { q: 'Which chain is primarily associated with the XSGD stablecoin?', options: ['Solana', 'Tron', 'Ethereum and Zilliqa', 'Avalanche'], correct: 2, explanation: 'XSGD launched on Zilliqa and Ethereum, and is issued by StraitsX — a MAS-licensed major payment institution in Singapore.' },
    { q: 'What is a key risk of cross-chain bridges for stablecoin transfers?', options: ['Transactions are too slow', 'Smart contract exploits can drain bridge reserves', 'You must hold ETH to bridge', 'Stablecoins cannot cross chains at all'], correct: 1, explanation: 'Cross-chain bridges have suffered over $2B in hacks (Ronin, Wormhole, Nomad). Bridge smart contract vulnerabilities remain the #1 risk in cross-chain transfers.' },
    { q: 'For the SG → UK remittance corridor, which stablecoin is most commonly used?', options: ['EURC', 'USDC or USDT', 'XSGD', 'PYUSD'], correct: 1, explanation: 'USDC and USDT are the dominant stablecoins for SG→UK because they are liquid on both sides, widely supported by on/off-ramp providers, and USD-denominated FX is straightforward.' },
    { q: 'Which of these is NOT a feature of algorithmic stablecoins?', options: ['They use smart contracts to control supply', 'They are backed by fiat currency held in a bank', 'They can depeg dramatically if demand falls', 'They rely on arbitrage incentives'], correct: 1, explanation: 'Algorithmic stablecoins (e.g. old UST) are not backed by fiat. They use code and arbitrage mechanisms — and lack the reserve backing that fiat-backed stablecoins provide.' },
];

const TYPE_COLORS: Record<string, string> = {
    Article: '#6366f1',
    Video: '#ef4444',
    Podcast: '#f97316',
    Report: '#8b5cf6',
    Interactive: '#10b981',
    Reference: '#06b6d4',
    Regulation: '#f59e0b',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: string }) {
    return (
        <span className={styles.typeBadge} style={{ background: TYPE_COLORS[type] + '22', color: TYPE_COLORS[type], borderColor: TYPE_COLORS[type] + '44' }}>
            {type}
        </span>
    );
}

function ResourceCard({ r, saved, onToggleSave }: { r: Resource; saved: boolean; onToggleSave: (id: string) => void }) {
    return (
        <div className={styles.resourceCard}>
            <div className={styles.resourceTop}>
                <TypeBadge type={r.type} />
                {r.readTime && <span className={styles.readTime}>{r.readTime}</span>}
            </div>
            <h3 className={styles.resourceTitle}>{r.title}</h3>
            {r.description && <p className={styles.resourceDesc}>{r.description}</p>}
            <div className={styles.resourceSource}>— {r.source}</div>
            <div className={styles.resourceActions}>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>
                    Open resource
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                </a>
                <button
                    className={`${styles.saveBtn} ${saved ? styles.saveBtnActive : ''}`}
                    onClick={() => onToggleSave(r.id)}
                    aria-label={saved ? 'Remove from saved' : 'Save for later'}
                    title={saved ? 'Saved — click to remove' : 'Save for later'}
                >
                    {saved ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
                    )}
                </button>
            </div>
        </div>
    );
}

function QuizModule() {
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [answered, setAnswered] = useState<boolean[]>(new Array(QUIZ_QUESTIONS.length).fill(false));
    const [score, setScore] = useState(0);
    const [done, setDone] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);

    const q = QUIZ_QUESTIONS[current];

    const handleSelect = (idx: number) => {
        if (answered[current]) return;
        setSelected(idx);
        setShowExplanation(true);
        const newAnswered = [...answered];
        newAnswered[current] = true;
        setAnswered(newAnswered);
        if (idx === q.correct) setScore(s => s + 1);
    };

    const handleNext = () => {
        if (current < QUIZ_QUESTIONS.length - 1) {
            setCurrent(c => c + 1);
            setSelected(null);
            setShowExplanation(false);
        } else {
            setDone(true);
        }
    };

    const handleReset = () => {
        setCurrent(0); setSelected(null);
        setAnswered(new Array(QUIZ_QUESTIONS.length).fill(false));
        setScore(0); setDone(false); setShowExplanation(false);
    };

    if (done) {
        const pct = Math.round((score / QUIZ_QUESTIONS.length) * 100);
        return (
            <div className={styles.quizDone}>
                <div className={styles.quizScore}>{score}/{QUIZ_QUESTIONS.length}</div>
                <p className={styles.quizScoreLabel}>
                    {pct >= 80 ? '🎉 Outstanding! You\'ve got a solid grasp of stablecoin fundamentals.' : pct >= 60 ? '👍 Good work! Review the explanations to shore up the gaps.' : '📚 Keep going — revisit Stage 1 & 2 resources and try again.'}
                </p>
                <button className={styles.quizRetryBtn} onClick={handleReset}>Retake Quiz</button>
            </div>
        );
    }

    return (
        <div className={styles.quizCard}>
            <div className={styles.quizProgress}>
                <span className={styles.quizProgressText}>Question {current + 1} of {QUIZ_QUESTIONS.length}</span>
                <div className={styles.quizProgressBar}>
                    <div className={styles.quizProgressFill} style={{ width: `${((current) / QUIZ_QUESTIONS.length) * 100}%` }} />
                </div>
            </div>
            <h3 className={styles.quizQuestion}>{q.q}</h3>
            <div className={styles.quizOptions}>
                {q.options.map((opt, i) => {
                    let cls = styles.quizOption;
                    if (answered[current]) {
                        if (i === q.correct) cls = `${styles.quizOption} ${styles.quizCorrect}`;
                        else if (i === selected) cls = `${styles.quizOption} ${styles.quizWrong}`;
                    }
                    return (
                        <button key={i} className={cls} onClick={() => handleSelect(i)} disabled={answered[current]}>
                            <span className={styles.quizOptionLetter}>{String.fromCharCode(65 + i)}</span>
                            {opt}
                        </button>
                    );
                })}
            </div>
            {showExplanation && (
                <div className={styles.quizExplanation}>
                    <strong>{selected === q.correct ? '✓ Correct!' : '✗ Not quite.'}</strong> {q.explanation}
                </div>
            )}
            {answered[current] && (
                <button className={styles.quizNextBtn} onClick={handleNext}>
                    {current < QUIZ_QUESTIONS.length - 1 ? 'Next Question →' : 'See Results →'}
                </button>
            )}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LearningPage() {
    const [saved, setSaved] = useState<Set<string>>(new Set());
    const [visitedStages, setVisitedStages] = useState<Set<number>>(new Set());
    const [activeStage, setActiveStage] = useState(1);
    const stageRefs = useRef<(HTMLElement | null)[]>([null, null, null, null]);

    // Load saved state from localStorage
    useEffect(() => {
        try {
            const s = localStorage.getItem('sa_saved_resources');
            if (s) setSaved(new Set(JSON.parse(s)));
            const v = localStorage.getItem('sa_visited_stages');
            if (v) setVisitedStages(new Set(JSON.parse(v)));
        } catch { /* ignore */ }
    }, []);

    // Intersection observer to track active stage
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const idx = stageRefs.current.findIndex(r => r === entry.target);
                        if (idx !== -1) {
                            const stageNum = idx + 1;
                            setActiveStage(stageNum);
                            setVisitedStages(prev => {
                                const next = new Set(prev).add(stageNum);
                                localStorage.setItem('sa_visited_stages', JSON.stringify([...next]));
                                return next;
                            });
                        }
                    }
                });
            },
            { threshold: 0.25 }
        );
        stageRefs.current.forEach(r => r && observer.observe(r));
        return () => observer.disconnect();
    }, []);

    const toggleSave = (id: string) => {
        setSaved(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            localStorage.setItem('sa_saved_resources', JSON.stringify([...next]));
            return next;
        });
    };

    const scrollToStage = (num: number) => {
        stageRefs.current[num - 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const stageResources = (num: 1 | 2 | 3 | 4) => RESOURCES.filter(r => r.stage === num);

    return (
        <div className={styles.page}>
            {/* Hero */}
            <header className={styles.hero}>
                <div className={styles.heroBadge}>Learning Hub</div>
                <h1 className={`${styles.heroTitle} text-gradient`}>Your Stablecoin Education Journey</h1>
                <p className={styles.heroSubtitle}>
                    From curious beginner to confident practitioner — four structured stages curated by domain experts.
                </p>
                <div className={styles.heroStats}>
                    <div className={styles.heroStat}><span className={styles.heroStatNum}>4</span><span>Stages</span></div>
                    <div className={styles.heroStat}><span className={styles.heroStatNum}>35+</span><span>Resources</span></div>
                    <div className={styles.heroStat}><span className={styles.heroStatNum}>3</span><span>Interactive Modules</span></div>
                </div>
            </header>

            {/* Sticky Stage Pills */}
            <div className={styles.stagePillNav}>
                {STAGE_INFO.map(s => (
                    <button
                        key={s.num}
                        className={`${styles.stagePill} ${activeStage === s.num ? styles.stagePillActive : ''} ${visitedStages.has(s.num) && activeStage !== s.num ? styles.stagePillVisited : ''}`}
                        onClick={() => scrollToStage(s.num)}
                    >
                        <span className={styles.stagePillEmoji}>{s.emoji}</span>
                        <span className={styles.stagePillLabel}>
                            <span className={styles.stagePillNum}>Stage {s.num}</span>
                            <span className={styles.stagePillName}>{s.label}</span>
                        </span>
                        {visitedStages.has(s.num) && <span className={styles.stagePillDot} />}
                    </button>
                ))}
            </div>

            {/* ── STAGE 1: Foundations ── */}
            <section
                id="stage-1"
                className={styles.stageSection}
                ref={el => { stageRefs.current[0] = el; }}
            >
                <div className={styles.stageHeader}>
                    <div className={styles.stageNum}>01</div>
                    <div>
                        <h2 className={styles.stageTitle}>Foundations <span className={styles.stageEmoji}>🌱</span></h2>
                        <p className={styles.stageTagline}>&ldquo;What is a stablecoin?&rdquo;</p>
                    </div>
                </div>
                <p className={styles.stageDesc}>
                    Start here if you&apos;re new to stablecoins. Build a clear mental model before diving into the ecosystem.
                </p>
                <div className={styles.resourceGrid}>
                    {stageResources(1).map(r => <ResourceCard key={r.id} r={r} saved={saved.has(r.id)} onToggleSave={toggleSave} />)}
                </div>
            </section>

            {/* ── STAGE 2: Guided Exploration ── */}
            <section
                id="stage-2"
                className={styles.stageSection}
                ref={el => { stageRefs.current[1] = el; }}
            >
                <div className={styles.stageHeader}>
                    <div className={styles.stageNum}>02</div>
                    <div>
                        <h2 className={styles.stageTitle}>Guided Exploration <span className={styles.stageEmoji}>🗺️</span></h2>
                        <p className={styles.stageTagline}>&ldquo;Show me how the ecosystem works&rdquo;</p>
                    </div>
                </div>
                <p className={styles.stageDesc}>
                    Map the key actors, understand how minting and burning works, compare major stablecoins, and get up to speed on global regulatory frameworks.
                </p>
                <div className={styles.topicClusters}>
                    {['Minting & Burning', 'Reserves & Attestations', 'Chain Selection', 'Issuer Profiles', 'Regulatory Frameworks', 'Use Case Deep-dives'].map(t => (
                        <span key={t} className={styles.topicCluster}>{t}</span>
                    ))}
                </div>
                <div className={styles.resourceGrid}>
                    {stageResources(2).map(r => <ResourceCard key={r.id} r={r} saved={saved.has(r.id)} onToggleSave={toggleSave} />)}
                </div>
            </section>

            {/* ── STAGE 3: Hands-on Practice ── */}
            <section
                id="stage-3"
                className={styles.stageSection}
                ref={el => { stageRefs.current[2] = el; }}
            >
                <div className={styles.stageHeader}>
                    <div className={styles.stageNum}>03</div>
                    <div>
                        <h2 className={styles.stageTitle}>Hands-on Practice <span className={styles.stageEmoji}>🧪</span></h2>
                        <p className={styles.stageTagline}>&ldquo;Let me try it myself&rdquo;</p>
                    </div>
                </div>
                <p className={styles.stageDesc}>
                    Test your knowledge, work through interactive playbooks, and explore real sandboxes — all without using real funds.
                </p>

                {/* Quiz */}
                <div className={styles.moduleBlock}>
                    <div className={styles.moduleLabel}>
                        <span className={styles.moduleLabelIcon}>📝</span> Interactive Quiz — Stablecoins 101
                    </div>
                    <QuizModule />
                </div>

                {/* Corridor Playbooks */}
                <div className={styles.moduleBlock}>
                    <div className={styles.moduleLabel}>
                        <span className={styles.moduleLabelIcon}>🧭</span> Corridor Playbooks — Simulated Walkthroughs
                    </div>
                    <div className={styles.playbookGrid}>
                        {[
                            { href: '/playbooks/sg-uk', flags: '🇸🇬 → 🇬🇧', label: 'SGD to GBP', desc: 'On-ramp in Singapore, send via USDC/XSGD, off-ramp in UK.' },
                            { href: '/playbooks/us-uk', flags: '🇺🇸 → 🇬🇧', label: 'USD to GBP', desc: 'USDC on-ramp, Stellar or Ethereum transfer, GBP off-ramp.' },
                            { href: '/playbooks/uk-eu', flags: '🇬🇧 → 🇪🇺', label: 'GBP to EUR', desc: 'MiCA-context corridor using EUR-pegged stablecoins.' },
                        ].map(p => (
                            <Link key={p.href} href={p.href} className={styles.playbookCard}>
                                <div className={styles.playbookFlags}>{p.flags}</div>
                                <div className={styles.playbookLabel}>{p.label}</div>
                                <p className={styles.playbookDesc}>{p.desc}</p>
                                <span className={styles.playbookCta}>Start playbook →</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* External practice */}
                <div className={styles.moduleBlock}>
                    <div className={styles.moduleLabel}>
                        <span className={styles.moduleLabelIcon}>🌐</span> External Practice Resources
                    </div>
                    <div className={styles.resourceGrid}>
                        {stageResources(3).map(r => <ResourceCard key={r.id} r={r} saved={saved.has(r.id)} onToggleSave={toggleSave} />)}
                    </div>
                </div>
            </section>

            {/* ── STAGE 4: Advanced Mastery ── */}
            <section
                id="stage-4"
                className={styles.stageSection}
                ref={el => { stageRefs.current[3] = el; }}
            >
                <div className={styles.stageHeader}>
                    <div className={styles.stageNum}>04</div>
                    <div>
                        <h2 className={styles.stageTitle}>Advanced Mastery <span className={styles.stageEmoji}>🎓</span></h2>
                        <p className={styles.stageTagline}>&ldquo;I want to go deep&rdquo;</p>
                    </div>
                </div>
                <p className={styles.stageDesc}>
                    Primary regulatory texts, institutional research, depeg post-mortems, and cross-chain security analysis for practitioners, policy experts, and researchers.
                </p>
                <div className={styles.resourceGrid}>
                    {stageResources(4).map(r => <ResourceCard key={r.id} r={r} saved={saved.has(r.id)} onToggleSave={toggleSave} />)}
                </div>
            </section>

            {/* Community Submission CTA */}
            <section className={styles.submissionCta}>
                <div className={styles.submissionCtaInner}>
                    <div className={styles.submissionCtaIcon}>💡</div>
                    <div className={styles.submissionCtaText}>
                        <h3>Know a great stablecoin resource?</h3>
                        <p>Share it with the community. Our editorial team reviews all submissions within 5 business days.</p>
                    </div>
                    <a
                        href="https://forms.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.submissionCtaBtn}
                    >
                        Submit a Resource →
                    </a>
                </div>
            </section>
        </div>
    );
}
