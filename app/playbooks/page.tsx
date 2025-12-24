import Link from 'next/link';
import { CORRIDORS, JURISDICTIONS } from '@/lib/data';
import styles from './page.module.css';

export default function PlaybooksPage() {
    const getFlag = (id: string) => JURISDICTIONS.find(j => j.id === id)?.flag_emoji || '🏳️';

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={`${styles.title} text-gradient`}>Corridor Playbooks</h1>
                <p className={styles.description}>
                    Select a transfer corridor to see step-by-step guides, regulated pathways, and safety checklists.
                </p>
            </header>

            <div className={styles.grid}>
                {CORRIDORS.map((corridor) => (
                    <Link
                        key={corridor.id}
                        href={`/playbooks/${corridor.id}`}
                        className={styles.card}
                    >
                        <div className={styles.flags}>
                            {getFlag(corridor.source_jurisdiction_id)}
                            <span className={styles.arrow}>→</span>
                            {getFlag(corridor.target_jurisdiction_id)}
                        </div>

                        <h2 className={styles.corridorName}>
                            {corridor.source_jurisdiction_id.toUpperCase()} to {corridor.target_jurisdiction_id.toUpperCase()}
                        </h2>

                        <p className="text-sm text-[var(--text-secondary)]">
                            Full playbook including on-ramps, transfers, and off-ramps.
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
