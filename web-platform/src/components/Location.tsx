'use client';

import React from 'react';
import { MapPin, Clock } from 'lucide-react';

const Location = () => {
    return (
        <section className="relative py-24 bg-dark-bg border-t border-white/5" id="location">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Info Side */}
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            Onde <span className="text-neon-blue">Estamos</span>
                        </h2>
                        <div className="space-y-8">
                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-neon-blue/10 rounded-lg text-neon-blue">
                                    <MapPin size={28} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Endereço</h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        R. Mal. Rondon, 163 - Amambai<br />
                                        Campo Grande - MS, 79008-000
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-neon-purple/10 rounded-lg text-neon-purple">
                                    <Clock size={28} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Horários</h3>
                                    <p className="text-gray-400">Domingo: 10h e 18h</p>
                                    <p className="text-gray-400">Quarta-feira: 20h</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map Side */}
                    <div className="relative h-[400px] rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-neon-blue to-neon-purple opacity-30 blur-lg group-hover:opacity-50 transition duration-500"></div>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3738.356399066497!2d-54.618642423985225!3d-20.450269381057863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9486e60b1e46633b%3A0x628331d24c049449!2sR.%20Mal.%20Rondon%2C%20163%20-%20Amambai%2C%20Campo%20Grande%20-%20MS%2C%2079008-000!5e0!3m2!1spt-BR!2sbr!4v1709221234567!5m2!1spt-BR!2sbr"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="relative z-10 grayscale hover:grayscale-0 transition-all duration-700"
                        ></iframe>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Location;
