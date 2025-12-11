import React from 'react';
import { Clock, MapPin, Calendar } from 'lucide-react';

const ServiceInfo = () => {
    return (
        <section className="py-24 bg-zinc-950">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                            JUNTE-SE <br />
                            <span className="text-gray-500">A NÓS</span>
                        </h2>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            Não importa quem você é ou de onde vem, há um lugar para você aqui.
                            Venha fazer parte da nossa família e viver o extraordinário de Deus.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/5 rounded-lg text-white">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Localização</h3>
                                    <p className="text-gray-400">Rua Exemplo, 123 - Bairro Vitória<br />Cidade - ES</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        <div className="p-6 border border-white/10 rounded-xl bg-gradient-to-br from-zinc-900 to-black hover:border-white/30 transition-colors">
                            <div className="flex items-center gap-3 mb-4 text-purple-400">
                                <Calendar size={20} />
                                <span className="font-bold tracking-wider text-sm">DOMINGO</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xl font-bold">Culto de Celebração</span>
                                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold">18:00</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-bold text-gray-500">Escola Bíblica</span>
                                <span className="px-3 py-1 bg-white/5 text-gray-400 rounded-full text-xs font-bold">09:00</span>
                            </div>
                        </div>

                        <div className="p-6 border border-white/10 rounded-xl bg-gradient-to-br from-zinc-900 to-black hover:border-white/30 transition-colors">
                            <div className="flex items-center gap-3 mb-4 text-blue-400">
                                <Calendar size={20} />
                                <span className="font-bold tracking-wider text-sm">QUARTA-FEIRA</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-bold">Culto de Ensino</span>
                                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold">20:00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServiceInfo;
