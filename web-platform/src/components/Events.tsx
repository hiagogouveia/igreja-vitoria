import prisma from "@/lib/prisma";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
import Button from "./ui/Button";

// Server Component (Async)
export default async function Events() {
    const events = await prisma.event.findMany({
        where: { active: true },
        orderBy: { startDate: 'asc' },
        take: 3
    });

    return (
        <section className="relative py-24 bg-black overflow-hidden" id="events">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                    <div>
                        <div className="inline-block bg-neon-purple/20 text-neon-purple px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-4 border border-neon-purple/30">
                            Agenda
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white">
                            Próximos <span className="text-neon-purple">Eventos</span>
                        </h2>
                    </div>
                    <Button variant="outline" className="hidden md:block">
                        Ver Agenda Completa
                    </Button>
                </div>

                {events.length === 0 ? (
                    <div className="text-center py-20 border border-white/10 rounded-2xl bg-white/5">
                        <p className="text-gray-400 text-lg">Em breve novidades na nossa agenda.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event) => (
                            <div key={event.id} className="group relative bg-dark-surface rounded-2xl overflow-hidden border border-white/10 hover:border-neon-purple/50 transition-all duration-300">
                                <div className="relative h-48 overflow-hidden">
                                    {event.imageUrl ? (
                                        <Image src={event.imageUrl} alt={event.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                                            <Calendar className="text-white/20 w-16 h-16" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 bg-black/80 backdrop-blur text-white px-3 py-1 rounded text-sm font-bold border border-white/10">
                                        {new Date(event.startDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon-purple transition-colors">{event.title}</h3>
                                    <div className="flex items-center text-gray-400 text-sm mb-4">
                                        <MapPin size={16} className="mr-2" />
                                        {event.location || 'Igreja Vitória'}
                                    </div>
                                    <p className="text-gray-400 text-sm line-clamp-2 mb-6">
                                        {event.description}
                                    </p>
                                    <Button className="w-full">Inscrever-se</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
