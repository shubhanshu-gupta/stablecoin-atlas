'use client';

import React, { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';

// ─── Stablecoin Atlas brand tokens ────────────────────────────────────────────
const C = {
  navy: "#0B1628",
  blue: "#1A56DB",
  blueMid: "#1E40AF",
  blueLight: "#3B82F6",
  glow: "#60A5FA",
  white: "#FFFFFF",
  offWhite: "#F0F6FF",
  gray: "#94A3B8",
  grayDark: "#334155",
  border: "rgba(99,179,255,0.15)",
};

const benefits = [
  {
    icon: "⚖️",
    title: "Regulatory moves",
    desc: "MiCA, GENIUS Act, MAS updates — explained in plain language, every week.",
  },
  {
    icon: "🏢",
    title: "Company actions",
    desc: "What Circle, Tether, StraitsX, and others actually did — not just the press release.",
  },
  {
    icon: "📖",
    title: "One concept, clearly explained",
    desc: "From reserve attestations to cross-chain bridges — one idea per week, no jargon.",
  },
  {
    icon: "💼",
    title: "Career opportunities",
    desc: "Top new roles in stablecoins, digital assets, and VASP — curated, not scraped.",
  },
];

// ─── Shared styles ─────────────────────────────────────────────────────────────
const sharedStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  .sa-widget *, .sa-overlay * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .sa-widget, .sa-overlay, .sa-footer-form {
    font-family: 'DM Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  /* ── Inline section ── */
  .sa-inline {
    background: ${C.navy};
    border: 1px solid ${C.border};
    border-radius: 20px;
    padding: 56px 48px;
    max-width: 760px;
    margin: 0 auto;
    position: relative;
    overflow: hidden;
  }

  .sa-inline::before {
    content: '';
    position: absolute;
    top: -120px; right: -120px;
    width: 360px; height: 360px;
    background: radial-gradient(circle, rgba(26,86,219,0.25) 0%, transparent 70%);
    pointer-events: none;
  }

  .sa-inline::after {
    content: '';
    position: absolute;
    bottom: -80px; left: -80px;
    width: 260px; height: 260px;
    background: radial-gradient(circle, rgba(96,165,250,0.12) 0%, transparent 70%);
    pointer-events: none;
  }

  .sa-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${C.glow};
    background: rgba(96,165,250,0.1);
    border: 1px solid rgba(96,165,250,0.2);
    padding: 5px 12px;
    border-radius: 20px;
    margin-bottom: 20px;
  }

  .sa-eyebrow::before {
    content: '';
    width: 6px; height: 6px;
    border-radius: 50%;
    background: ${C.glow};
    animation: sa-pulse 2s infinite;
  }

  @keyframes sa-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  .sa-headline {
    font-family: 'DM Serif Display', serif;
    font-size: 36px;
    line-height: 1.15;
    color: ${C.white};
    margin-bottom: 10px;
  }

  .sa-headline em {
    font-style: italic;
    color: ${C.glow};
  }

  .sa-subline {
    font-size: 15px;
    line-height: 1.65;
    color: ${C.gray};
    margin-bottom: 32px;
    max-width: 100%;
    text-align: center;
  }

  /* ── Benefits grid ── */
  .sa-benefits {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 32px;
  }

  .sa-benefit {
    background: rgba(255,255,255,0.03);
    border: 1px solid ${C.border};
    border-radius: 12px;
    padding: 16px 18px;
    transition: border-color 0.2s, background 0.2s;
    cursor: default;
  }

  .sa-benefit:hover {
    background: rgba(26,86,219,0.08);
    border-color: rgba(99,179,255,0.3);
  }

  .sa-benefit-icon {
    font-size: 20px;
    margin-bottom: 8px;
    display: block;
  }

  .sa-benefit-title {
    font-size: 13px;
    font-weight: 600;
    color: ${C.white};
    margin-bottom: 4px;
  }

  .sa-benefit-desc {
    font-size: 12px;
    color: ${C.gray};
    line-height: 1.5;
  }

  /* ── Input row ── */
  .sa-form {
    display: flex;
    gap: 10px;
    position: relative;
    z-index: 1;
  }

  .sa-input {
    flex: 1;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(99,179,255,0.2);
    border-radius: 10px;
    padding: 13px 18px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: ${C.white};
    outline: none;
    transition: border-color 0.2s, background 0.2s;
  }

  .sa-input::placeholder { color: rgba(148,163,184,0.6); }

  .sa-input:focus {
    border-color: ${C.blue};
    background: rgba(26,86,219,0.08);
  }

  .sa-btn {
    background: ${C.blue};
    color: ${C.white};
    border: none;
    border-radius: 10px;
    padding: 13px 26px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.2s, transform 0.15s;
    position: relative;
    overflow: hidden;
  }

  .sa-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
    pointer-events: none;
  }

  .sa-btn:hover { background: ${C.blueMid}; transform: translateY(-1px); }
  .sa-btn:active { transform: translateY(0); }
  .sa-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .sa-legal {
    margin-top: 14px;
    font-size: 11.5px;
    color: rgba(148,163,184,0.5);
    position: relative;
    z-index: 1;
  }

  /* ── Success state ── */
  .sa-success {
    text-align: center;
    padding: 20px 0;
    animation: sa-fadein 0.4s ease;
  }

  @keyframes sa-fadein {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .sa-success-icon {
    width: 52px; height: 52px;
    background: rgba(26,86,219,0.15);
    border: 1px solid rgba(96,165,250,0.3);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    margin: 0 auto 16px;
  }

  .sa-success-title {
    font-family: 'DM Serif Display', serif;
    font-size: 24px;
    color: ${C.white};
    margin-bottom: 8px;
  }

  .sa-success-desc {
    font-size: 14px;
    color: ${C.gray};
    line-height: 1.6;
  }

  /* ── Sticky bar ── */
  .sa-sticky {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    background: rgba(11,22,40,0.96);
    backdrop-filter: blur(16px);
    border-top: 1px solid ${C.border};
    padding: 16px 24px;
    display: flex;
    align-items: center;
    gap: 16px;
    z-index: 900;
    transform: translateY(100%);
    transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
  }

  .sa-sticky.sa-sticky--visible {
    transform: translateY(0);
  }

  .sa-sticky-text {
    flex: 1;
  }

  .sa-sticky-title {
    font-size: 14px;
    font-weight: 600;
    color: ${C.white};
  }

  .sa-sticky-sub {
    font-size: 12px;
    color: ${C.gray};
    margin-top: 2px;
  }

  .sa-sticky-form {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
  }

  .sa-sticky-input {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(99,179,255,0.2);
    border-radius: 8px;
    padding: 9px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: ${C.white};
    outline: none;
    width: 220px;
    transition: border-color 0.2s;
  }

  .sa-sticky-input::placeholder { color: rgba(148,163,184,0.5); }
  .sa-sticky-input:focus { border-color: ${C.blue}; }

  .sa-sticky-btn {
    background: ${C.blue};
    color: ${C.white};
    border: none;
    border-radius: 8px;
    padding: 9px 18px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    white-space: nowrap;
  }

  .sa-sticky-btn:hover { background: ${C.blueMid}; }

  .sa-sticky-close {
    background: none;
    border: none;
    color: ${C.gray};
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
    padding: 4px;
    flex-shrink: 0;
    transition: color 0.2s;
  }

  .sa-sticky-close:hover { color: ${C.white}; }

  /* ── Modal overlay ── */
  .sa-overlay {
    position: fixed;
    inset: 0;
    background: rgba(7,15,30,0.85);
    backdrop-filter: blur(8px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: sa-overlay-in 0.25s ease;
  }

  @keyframes sa-overlay-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .sa-modal {
    background: ${C.navy};
    border: 1px solid ${C.border};
    border-radius: 24px;
    padding: 48px;
    max-width: 560px;
    width: 100%;
    position: relative;
    overflow: hidden;
    animation: sa-modal-in 0.35s cubic-bezier(0.34,1.4,0.64,1);
  }

  @keyframes sa-modal-in {
    from { opacity: 0; transform: scale(0.92) translateY(16px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  .sa-modal::before {
    content: '';
    position: absolute;
    top: -100px; right: -100px;
    width: 320px; height: 320px;
    background: radial-gradient(circle, rgba(26,86,219,0.2) 0%, transparent 70%);
    pointer-events: none;
  }

  .sa-modal-close {
    position: absolute;
    top: 18px; right: 18px;
    background: rgba(255,255,255,0.05);
    border: 1px solid ${C.border};
    border-radius: 8px;
    color: ${C.gray};
    cursor: pointer;
    font-size: 16px;
    width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s, color 0.2s;
    z-index: 2;
  }

  .sa-modal-close:hover {
    background: rgba(255,255,255,0.1);
    color: ${C.white};
  }

  /* ── Frequency badge ── */
  .sa-freq {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 20px;
    font-size: 12px;
    color: rgba(148,163,184,0.6);
  }

  .sa-freq-dot {
    width: 4px; height: 4px;
    border-radius: 50%;
    background: rgba(148,163,184,0.3);
  }

  /* ── Footer Form ── */
  .sa-footer-form {
    display: flex;
    gap: 10px;
  }

  /* ── Responsive ── */
  @media (max-width: 600px) {
    .sa-inline { padding: 36px 24px; }
    .sa-benefits { grid-template-columns: 1fr; }
    .sa-form { flex-direction: column; }
    .sa-headline { font-size: 28px; }
    .sa-sticky { flex-wrap: wrap; }
    .sa-sticky-form { width: 100%; }
    .sa-sticky-input { flex: 1; width: auto; min-width: 0; }
    .sa-modal { padding: 36px 24px; }
  }
`;

// ─── Shared form logic hook ───────────────────────────────────────────────
function useSubscribeForm(source: string, onSuccess?: (email: string) => void) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess?.(email);
        setEmail("");
      } else {
        setError(data.message || 'Something went wrong. Try again.');
      }
    } catch (err) {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, loading, error, handleSubmit };
}

// ─── Success view ──────────────────────────────────────────────────────────────
function SuccessView({ email, onClose }: { email: string; onClose?: () => void }) {
  return (
    <div className="sa-success" style={{ position: 'relative' }}>
      {onClose && (
        <button
          style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(99,179,255,0.15)',
            borderRadius: '8px',
            color: '#94A3B8',
            cursor: 'pointer',
            fontSize: '16px',
            width: '32px', height: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s, color 0.2s',
            zIndex: 2,
          }}
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
      )}
      <div className="sa-success-icon">✓</div>
      <div className="sa-success-title">You're in.</div>
      <div className="sa-success-desc">
        First edition lands in your inbox this week.<br />
        <span style={{ color: "rgba(148,163,184,0.5)", fontSize: "12px" }}>
          Sent to {email}
        </span>
      </div>
    </div>
  );
}

// ─── 1. Inline section widget ─────────────────────────────────────────────────
export function InlineSubscribe({ source = 'inline_homepage' }: { source?: string }) {
  const [done, setDone] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState("");
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('atlas_subscribed_email');
    if (savedEmail) {
      setDismissed(true);
    }
    setInitialCheckComplete(true);
  }, []);

  const { email, setEmail, loading, error, handleSubmit } = useSubscribeForm(source, (e) => {
    localStorage.setItem('atlas_subscribed_email', e);
    setSubscribedEmail(e);
    setDone(true);
  });

  if (!initialCheckComplete || dismissed) return null;

  return (
    <div className="sa-widget">
      <style>{sharedStyles}</style>
      <div className="sa-inline">
        {!done ? (
          <>
            <div className="sa-eyebrow">Weekly digest</div>
            <h2 className="sa-headline" style={{ textAlign: 'center' }}>
              The stablecoin week,<br /><em>in five minutes.</em>
            </h2>
            <p className="sa-subline">
              Every week: one regulatory move that matters, one company action worth tracking, one concept explained without jargon, and the best new roles in the space. No noise. Just signal.
            </p>

            <div className="sa-benefits">
              {benefits.map((b) => (
                <div className="sa-benefit" key={b.title}>
                  <span className="sa-benefit-icon">{b.icon}</span>
                  <div className="sa-benefit-title">{b.title}</div>
                  <div className="sa-benefit-desc">{b.desc}</div>
                </div>
              ))}
            </div>

            <form className="sa-form" onSubmit={handleSubmit}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <input
                  className="sa-input"
                  style={{ width: '100%' }}
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {error && <span style={{ color: '#F87171', fontSize: '12px', marginTop: '4px' }}>{error}</span>}
              </div>
              <button className="sa-btn" type="submit" disabled={loading}>
                {loading ? "Subscribing…" : "Get the weekly digest"}
              </button>
            </form>

            <div className="sa-legal">
              Free forever · No spam · Unsubscribe in one click
            </div>

            <div className="sa-freq">
              <span>Sent every Sunday</span>
              <span className="sa-freq-dot" />
              <span>~5 min read</span>
              <span className="sa-freq-dot" />
              <span>stablecoinatlas.app</span>
            </div>
          </>
        ) : (
          <SuccessView email={subscribedEmail} onClose={() => setDismissed(true)} />
        )}
      </div>
    </div>
  );
}

// ─── 2. Sticky bottom bar ─────────────────────────────────────────────────────
export function StickySubscribeBar() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [done, setDone] = useState(false);
  const pathname = usePathname();

  const { email, setEmail, loading, error, handleSubmit } = useSubscribeForm('sticky_bar', (e) => {
    localStorage.setItem('atlas_subscribed_email', e);
    setDone(true);
    localStorage.setItem('atlas_newsletter_dismissed', 'true');
    setTimeout(() => {
      setVisible(false);
    }, 4000);
  });

  useEffect(() => {
    const isDismissed = localStorage.getItem('atlas_newsletter_dismissed') === 'true';
    const isSubscribed = localStorage.getItem('atlas_subscribed_email') !== null;

    // If they already subscribed, never show the sticky bar
    if (isSubscribed) {
      setDismissed(true);
      return;
    }

    setDismissed(isDismissed);

    if (isDismissed || pathname === '/careers') return;

    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight || 1;
      const scrolled = window.scrollY / docHeight;
      if (scrolled > 0.35) setVisible(true);
    };
    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  if (dismissed || pathname === '/careers') return null;

  return (
    <div className="sa-widget">
      <style>{sharedStyles}</style>
      <div className={`sa-sticky ${visible ? "sa-sticky--visible" : ""}`}>
        <div className="sa-sticky-text">
          {done ? (
            <div className="sa-sticky-title" style={{ color: C.glow }}>
              ✓ You're subscribed — first edition this Sunday.
            </div>
          ) : (
            <>
              <div className="sa-sticky-title">The Stablecoin Atlas weekly digest</div>
              <div className="sa-sticky-sub">
                Regulatory moves · Company actions · Concepts · Careers
              </div>
            </>
          )}
        </div>

        {!done && (
          <form className="sa-sticky-form" onSubmit={handleSubmit} style={{ alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <input
                className="sa-sticky-input"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {error && <span style={{ color: '#F87171', fontSize: '12px', marginTop: '2px', position: 'absolute', bottom: '-20px' }}>{error}</span>}
            </div>
            <button className="sa-sticky-btn" type="submit" disabled={loading}>
              {loading ? "…" : "Get the digest"}
            </button>
          </form>
        )}

        <button
          className="sa-sticky-close"
          onClick={() => {
            setVisible(false);
            setDismissed(true);
            localStorage.setItem('atlas_newsletter_dismissed', 'true');
          }}
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// ─── 3. Modal / popup ─────────────────────────────────────────────────────────
export function SubscribeModal({ onClose, isOpen = false, source = 'modal_nav' }: { onClose: () => void; isOpen?: boolean; source?: string; }) {
  const [done, setDone] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem('atlas_subscribed_email');
    if (savedEmail) {
      setSubscribedEmail(savedEmail);
      setDone(true);
    }
  }, [isOpen]);

  const { email, setEmail, loading, error, handleSubmit } = useSubscribeForm(source, (e) => {
    localStorage.setItem('atlas_subscribed_email', e);
    setSubscribedEmail(e);
    setDone(true);
  });

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="sa-widget">
      <style>{sharedStyles}</style>
      <div className="sa-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
        <div className="sa-modal">
          <button className="sa-modal-close" onClick={onClose} aria-label="Close">✕</button>

          {!done ? (
            <>
              <div className="sa-eyebrow">Weekly digest</div>
              <h2 className="sa-headline" style={{ fontSize: "30px" }}>
                Five minutes.<br /><em>The full picture.</em>
              </h2>
              <p className="sa-subline" style={{ marginBottom: "24px", maxWidth: '100%' }}>
                Every week: one regulatory move that matters, one company action worth tracking, one concept explained without jargon, and the best new roles in the space. No noise. Just signal.
              </p>

              <div className="sa-benefits" style={{ marginBottom: "24px" }}>
                {benefits.map((b) => (
                  <div className="sa-benefit" key={b.title}>
                    <span className="sa-benefit-icon">{b.icon}</span>
                    <div className="sa-benefit-title">{b.title}</div>
                    <div className="sa-benefit-desc">{b.desc}</div>
                  </div>
                ))}
              </div>

              <form className="sa-form" onSubmit={handleSubmit}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <input
                    className="sa-input"
                    style={{ width: '100%' }}
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {error && <span style={{ color: '#F87171', fontSize: '12px', marginTop: '4px' }}>{error}</span>}
                </div>
                <button className="sa-btn" type="submit" disabled={loading}>
                  {loading ? "Subscribing…" : "Get the digest"}
                </button>
              </form>

              <div className="sa-legal" style={{ marginTop: "12px" }}>
                Free forever · No spam · Unsubscribe anytime
              </div>

              <div className="sa-freq">
                <span>Every Sunday</span>
                <span className="sa-freq-dot" />
                <span>~5 min read</span>
                <span className="sa-freq-dot" />
                <span>stablecoinatlas.app</span>
              </div>
            </>
          ) : (
            <SuccessView email={subscribedEmail} onClose={() => setDone(true)} />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── 4. Footer form (Added to match project implementation requirements) ──────
export function FooterSubscribe() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('atlas_subscribed_email')) {
      setDone(true);
    }
  }, []);

  const { email, setEmail, loading, error, handleSubmit } = useSubscribeForm('footer', (e) => {
    localStorage.setItem('atlas_subscribed_email', e);
    setDone(true);
  });

  return (
    <div className="sa-widget" style={{ width: '100%' }}>
      <style>{sharedStyles}</style>
      {done ? (
        <div style={{ color: C.glow, fontSize: '14px', fontWeight: 500 }}>
          ✓ Thanks for subscribing!
        </div>
      ) : (
        <>
          <form className="sa-footer-form" onSubmit={handleSubmit}>
            <input
              className="sa-input"
              style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}
              type="email"
              placeholder="Subscribe to newsletter"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="sa-btn" style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px' }} type="submit" disabled={loading}>
              {loading ? "…" : "Join"}
            </button>
          </form>
          {error && <div style={{ color: '#F87171', fontSize: '12px', marginTop: '4px' }}>{error}</div>}
        </>
      )}
    </div>
  );
}
