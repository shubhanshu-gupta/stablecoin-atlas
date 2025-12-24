'use client';
import { useState } from 'react';
import styles from './wizard.module.css';

interface WizardProps {
    corridor: {
        id: string;
        source: string;
        target: string;
        sourceName: string;
        targetName: string;
    };
}

export default function Wizard({ corridor }: WizardProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        amount: '',
        asset: 'USDC',
    });

    const nextStep = () => setStep(s => Math.min(s + 1, 4));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const steps = ['Plan', 'On-Ramp', 'Transfer', 'Off-Ramp'];

    return (
        <div className={styles.wizardContainer}>
            <h1 className={styles.title}>Transfer: {corridor.sourceName} to {corridor.targetName}</h1>

            {/* Stepper */}
            <div className={styles.stepper}>
                {steps.map((label, idx) => {
                    const s = idx + 1;
                    const statusClass = s === step ? styles.activeStep : s < step ? styles.completedStep : '';
                    return (
                        <div key={label} className={`${styles.step} ${statusClass}`}>
                            {s < step ? '✓' : s}
                        </div>
                    );
                })}
            </div>

            {/* Content */}
            <div className={styles.panel}>
                {step === 1 && (
                    <div>
                        <h2 className={styles.stepTitle}>1. Planning your Transfer</h2>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Select Stablecoin</label>
                            <select
                                className={styles.select}
                                value={formData.asset}
                                onChange={(e) => setFormData({ ...formData, asset: e.target.value })}
                            >
                                <option value="USDC">USDC (Circle)</option>
                                <option value="XSGD">XSGD (StraitsX)</option>
                                <option value="PYUSD">PYUSD (Paxos)</option>
                            </select>
                        </div>
                        <div className={styles.warningBox}>
                            ⚠️ Ensure you have a verified account on a regulated exchange in {corridor.sourceName}.
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h2 className={styles.stepTitle}>2. On-Ramp in {corridor.sourceName}</h2>
                        <p className="mb-4 text-[var(--text-secondary)]">
                            Convert your Fiat ({corridor.source === 'sg' ? 'SGD' : 'USD'}) to {formData.asset}.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-[var(--text-secondary)]">
                            <li>Log in to your regulated exchange (e.g. Coinbase, StraitsX).</li>
                            <li>Deposit funds via bank transfer.</li>
                            <li>Buy {formData.asset} on the spot market.</li>
                        </ul>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <h2 className={styles.stepTitle}>3. Transfer on-chain</h2>
                        <p className="mb-4 text-[var(--text-secondary)]">
                            Send {formData.asset} to your destination wallet or exchange.
                        </p>
                        <div className={styles.warningBox}>
                            ⚠️ Double check the network (Ethereum, Polygon, Solana). Sending to the wrong network causes permanent loss.
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div>
                        <h2 className={styles.stepTitle}>4. Off-Ramp in {corridor.targetName}</h2>
                        <p className="mb-4 text-[var(--text-secondary)]">
                            Convert {formData.asset} to Fiat ({corridor.target === 'uk' ? 'GBP' : 'EUR'}) at the destination.
                        </p>
                        <div className="p-4 bg-[rgba(255,255,255,0.1)] rounded-lg text-center">
                            🎉 Transfer Workflow Complete
                        </div>
                    </div>
                )}

                <div className={styles.controls}>
                    <button
                        onClick={prevStep}
                        disabled={step === 1}
                        className={`${styles.btn} ${styles.btnSecondary}`}
                        style={{ visibility: step === 1 ? 'hidden' : 'visible' }}
                    >
                        Back
                    </button>

                    {step < 4 ? (
                        <button
                            onClick={nextStep}
                            className={`${styles.btn} ${styles.btnPrimary}`}
                        >
                            Next Step
                        </button>
                    ) : (
                        <button
                            onClick={() => alert('Done!')}
                            className={`${styles.btn} ${styles.btnPrimary}`}
                        >
                            Finish
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
