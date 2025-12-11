import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import Button from './ui/Button';

const CavSection = () => {
    return (
        <section className="relative py-24 bg-dark-bg border-t border-white/5 overflow-hidden" id="cav-home">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2670&auto=format&fit=crop)' }} // Unity/Gathering image
                ></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/60"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-block bg-neon-blue/20 text-neon-blue px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-6 border border-neon-blue/30">
                            Perto de Você
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                            Casa de <span className="text-neon-blue">Vitória</span>
                        </h2>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                            A igreja não termina no domingo. Durante a semana, nos reunimos nas casas para comunhão, oração e crescimento. Existe uma CAV pertinho de você esperando sua visita.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/cav">
                                <Button variant="primary" className="w-full sm:w-auto flex items-center justify-center gap-2 group">
                                    Encontrar uma CAV
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link to="/#contact">
                                <Button variant="outline" className="w-full sm:w-auto">
                                    Quero ser Anfitrião
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Visual Element / Map Preview */}
                    <div className="relative hidden md:block group">
                        <div className="absolute -inset-2 bg-gradient-to-br from-neon-blue to-neon-purple rounded-2xl opacity-20 blur-xl group-hover:opacity-40 transition-opacity"></div>
                        <div className="relative bg-black/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            <div className="flex items-center gap-4 mb-4 border-b border-white/10 pb-4">
                                <div className="w-12 h-12 bg-neon-blue/20 rounded-full flex items-center justify-center text-neon-blue">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg">Bairro Universitário</h4>
                                    <p className="text-gray-400 text-sm">Terça • 20:00</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 border-b border-white/10 pb-4 mb-4">
                                <div className="w-12 h-12 bg-neon-purple/20 rounded-full flex items-center justify-center text-neon-purple">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg">Centro</h4>
                                    <p className="text-gray-400 text-sm">Quinta • 19:30</p>
                                </div>
                            </div>
                            <div className="text-center pt-2">
                                <p className="text-gray-500 text-sm italic">e muito mais...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CavSection;
