import prisma from "@/lib/prisma";
import Button from "@/components/ui/Button";

export default async function AdminCavsPage() {
    const cavs = await prisma.cav.findMany();

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Gerenciar Células (CAVs)</h1>
                <Button>Nova CAV</Button>
            </div>

            <div className="bg-dark-surface rounded-xl border border-white/10 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-gray-400">
                        <tr>
                            <th className="p-4">Nome</th>
                            <th className="p-4">Dia/Hora</th>
                            <th className="p-4">Bairro</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {cavs.map((cav) => (
                            <tr key={cav.id} className="hover:bg-white/5">
                                <td className="p-4 font-medium text-white">{cav.name}</td>
                                <td className="p-4 text-gray-300">{cav.dayOfWeek} às {cav.time}</td>
                                <td className="p-4 text-gray-300">{cav.neighborhood}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${cav.active ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                        {cav.active ? 'Ativo' : 'Inativo'}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button className="text-neon-blue hover:underline mr-4">Editar</button>
                                    <button className="text-red-500 hover:underline">Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
