import { getAllCavs } from "@/app/actions/cav-actions";
import CavAdminTable from "@/components/admin/CavAdminTable";

export const dynamic = 'force-dynamic';

export default async function AdminCavsPage() {
    const { data: cavs, success, error } = await getAllCavs();

    if (!success) {
        return (
            <div className="text-red-400">
                <h1 className="text-2xl font-bold mb-2">Erro ao carregar CAVs</h1>
                <pre className="text-sm bg-red-950/40 border border-red-500/30 rounded p-3 whitespace-pre-wrap">{error}</pre>
            </div>
        );
    }

    return <CavAdminTable initialCavs={(cavs ?? []) as any} />;
}
