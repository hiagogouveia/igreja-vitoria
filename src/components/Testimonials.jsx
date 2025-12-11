import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Quote } from 'lucide-react';

const Testimonials = () => {
    const testimonials = [
        {
            name: "João Silva",
            role: "Membro há 2 anos",
            text: "Encontrei aqui uma família de verdade. Não é sobre religião, é sobre viver Jesus no dia a dia.",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2574&auto=format&fit=crop"
        },
        {
            name: "Maria Oliveira",
            role: "Líder de Jovens",
            text: "A liberdade que temos para adorar mudou minha vida. Aqui posso ser eu mesma e servir com alegria.",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574&auto=format&fit=crop"
        },
        {
            name: "Pedro Santos",
            role: "Voluntário",
            text: "Servir na Casa de Vitória me deu um novo propósito. Ver vidas transformadas não tem preço.",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop"
        }
    ];

    return (
        <section className="relative py-24 bg-dark-bg overflow-hidden" id="testimonials">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Histórias de <span className="text-neon-purple">Transformação</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-white/5 rounded-2xl p-8 border border-white/5 hover:border-neon-purple/50 transition-all duration-300 group">
                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-6">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-neon-purple transition-all duration-300 grayscale group-hover:grayscale-0">
                                        <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-neon-purple text-white p-1.5 rounded-full">
                                        <Quote size={12} fill="currentColor" />
                                    </div>
                                </div>

                                <p className="text-gray-300 italic mb-6 leading-relaxed relative z-10">
                                    "{t.text}"
                                </p>

                                <div>
                                    <h4 className="text-white font-bold">{t.name}</h4>
                                    <p className="text-neon-purple text-xs uppercase tracking-widest">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Call to Action Final */}
            <div className="mt-24 relative py-20 text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 blur-3xl opacity-30"></div>
                <div className="relative z-10 px-4">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
                        Venha Viver uma <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Experiência com Deus</span>
                    </h2>
                    <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                        Domingo às 18h. Você é nosso convidado de honra.
                    </p>
                    <button className="bg-white text-black font-bold uppercase tracking-wider py-4 px-10 rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                        Visite-nos este Domingo
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
