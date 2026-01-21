import prisma from "@/lib/prisma";

export default async function AdminDashboard() {
    const cavCount = await prisma.cav.count();
    const eventCount = await prisma.event.count();
    const userCount = await prisma.user.count();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-dark-surface p-6 rounded-xl border border-white/10">
                    <h3 className="text-gray-400 text-sm font-medium uppercase">Total de Células</h3>
                    <p className="text-4xl font-bold text-neon-blue mt-2">{cavCount}</p>
                </div>
                <div className="bg-dark-surface p-6 rounded-xl border border-white/10">
                    <h3 className="text-gray-400 text-sm font-medium uppercase">Eventos Ativos</h3>
                    <p className="text-4xl font-bold text-neon-purple mt-2">{eventCount}</p>
                </div>
                <div className="bg-dark-surface p-6 rounded-xl border border-white/10">
                    <h3 className="text-gray-400 text-sm font-medium uppercase">Usuários</h3>
                    <p className="text-4xl font-bold text-white mt-2">{userCount}</p>
                </div>
            </div>
        </div>
    );
}
