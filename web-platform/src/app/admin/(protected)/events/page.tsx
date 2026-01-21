import prisma from "@/lib/prisma";
import Button from "@/components/ui/Button";

export default async function AdminEventsPage() {
    const events = await prisma.event.findMany();

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Gerenciar Eventos</h1>
                <Button>Novo Evento</Button>
            </div>

            <div className="bg-dark-surface rounded-xl border border-white/10 overflow-hidden">
                {events.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        Nenhum evento cadastrado.
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-gray-400">
                            <tr>
                                <th className="p-4">Título</th>
                                <th className="p-4">Data</th>
                                <th className="p-4">Local</th>
                                <th className="p-4">Preço</th>
                                <th className="p-4">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {events.map((event) => (
                                <tr key={event.id} className="hover:bg-white/5">
                                    <td className="p-4 font-medium text-white">{event.title}</td>
                                    <td className="p-4 text-gray-300">{new Date(event.startDate).toLocaleDateString()}</td>
                                    <td className="p-4 text-gray-300">{event.location}</td>
                                    <td className="p-4 text-gray-300">
                                        {Number(event.price) === 0 ? 'Grátis' : `R$ ${event.price}`}
                                    </td>
                                    <td className="p-4">
                                        <button className="text-neon-blue hover:underline mr-4">Editar</button>
                                        <button className="text-red-500 hover:underline">Excluir</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
