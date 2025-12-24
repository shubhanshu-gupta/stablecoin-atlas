import { notFound } from 'next/navigation';
import { CORRIDORS, JURISDICTIONS } from '@/lib/data';
import Wizard from './Wizard';

interface Props {
    params: Promise<{ corridor: string }>;
}

export async function generateStaticParams() {
    return CORRIDORS.map((c) => ({
        corridor: c.id,
    }));
}

export default async function PlaybookPage({ params }: Props) {
    const { corridor: corridorId } = await params;
    const corridor = CORRIDORS.find((c) => c.id === corridorId);

    if (!corridor) {
        notFound();
    }

    const sourceName = JURISDICTIONS.find(j => j.id === corridor.source_jurisdiction_id)?.country_or_region || corridor.source_jurisdiction_id;
    const targetName = JURISDICTIONS.find(j => j.id === corridor.target_jurisdiction_id)?.country_or_region || corridor.target_jurisdiction_id;

    const corridorData = {
        id: corridor.id,
        source: corridor.source_jurisdiction_id,
        target: corridor.target_jurisdiction_id,
        sourceName,
        targetName,
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-4">
            <Wizard corridor={corridorData} />
        </div>
    );
}
