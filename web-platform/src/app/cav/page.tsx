import React from 'react';
import prisma from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import { MapPin, Clock, User } from 'lucide-react';
import Button from '@/components/ui/Button';

// Force dynamic behavior so it fetches fresh data on every request
export const dynamic = 'force-dynamic';

export default async function CavPage() {
    const cavs = await prisma.cav.findMany({
        where: { active: true },
    });

    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />

            {/* Header */}
            <section className="relative py-24 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-neon-purple/10 to-black"></div>
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Casa de <span className="text-neon-blue">Vitória</span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-8">
                        Nossos pequenos grupos. Um lugar de comunhão, oração e crescimento.
                        <br />
                        Encontre uma família perto de você.
                    </p>
                </div>
            </section>

            {/* List */}
            <section className="max-w-7xl mx-auto px-4 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {cavs.map((cav) => (
                        <div key={cav.id} className="bg-dark-surface border border-white/10 rounded-2xl p-6 hover:border-neon-blue/50 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-bold text-white group-hover:text-neon-blue transition-colors">
                                    {cav.name}
                                </h2>
                                <span className="bg-neon-blue/20 text-neon-blue px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {cav.dayOfWeek} • {cav.time}
                                </span>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center text-gray-400">
                                    <MapPin size={18} className="mr-3 text-neon-purple" />
                                    <p>{cav.address}, {cav.neighborhood}</p>
                                </div>
                                {cav.leaderName && (
                                    <div className="flex items-center text-gray-400">
                                        <User size={18} className="mr-3 text-neon-purple" />
                                        <p>Líder: {cav.leaderName}</p>
                                    </div>
                                )}
                                <div className="flex items-center text-gray-400">
                                    <Clock size={18} className="mr-3 text-neon-blue" />
                                    <p>Toda {cav.dayOfWeek} às {cav.time}</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                {/* Dynamic Map Embed */}
                                <div className="w-full h-48 rounded-lg overflow-hidden border border-white/5 bg-black/50 relative">
                                    {/* Fallback to simple query based embed if simple coords aren't perfect or just to show location area */}
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        style={{ border: 0 }}
                                        src={`https://maps.google.com/maps?q=${encodeURIComponent(cav.address + ' ' + cav.city)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                        allowFullScreen
                                    ></iframe>
                                </div>

                                <Button className="w-full flex items-center justify-center gap-2 mt-4">
                                    <MapPin size={18} />
                                    <span>Abrir no GPS</span>
                                </Button>
                            </div>
                        </div>
                    ))}

                    {cavs.length === 0 && (
                        <div className="col-span-full text-center py-20 text-gray-500">
                            <p>Nenhuma célula cadastrada no momento.</p>
                        </div>
                    )}
                </div>
            </section>

        </main>
    );
}
