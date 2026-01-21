'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, BookOpen, Users, HandHeart, Music } from 'lucide-react';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const Beliefs = () => {
    const sectionRef = useRef(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    const beliefs = [
        {
            icon: <Music className="w-10 h-10 text-neon-blue" />,
            title: "Adoração Vibrante",
            description: "Louvor intenso e uma atmosfera de presença que transforma vidas através da música e adoração sincera."
        },
        {
            icon: <BookOpen className="w-10 h-10 text-neon-purple" />,
            title: "Palavra Transformadora",
            description: "Mensagens bíblicas práticas e profundas que encorajam, desafiam e direcionam para um propósito maior."
        },
        {
            icon: <Users className="w-10 h-10 text-neon-blue" />,
            title: "Casa de Vitória",
            description: "Uma comunidade acolhedora focada em discipulado, famílias fortes e conexões reais entre pessoas."
        },
        {
            icon: <HandHeart className="w-10 h-10 text-neon-purple" />,
            title: "Ação Social",
            description: "Amor na prática através de apoio comunitário, cestas básicas e projetos de misericórdia."
        },
        {
            icon: <Heart className="w-10 h-10 text-white" />,
            title: "Juventude Vitória",
            description: "Um movimento jovem apaixonado, criativo e relevante, focado em viver a fé de forma autêntica."
        }
    ];

    useEffect(() => {
        gsap.fromTo(cardsRef.current,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                }
            }
        );
    }, []);

    return (
        <section ref={sectionRef} className="relative py-20 bg-dark-bg overflow-hidden" id="beliefs">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-blue/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Nossa <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Identidade</span>
                    </h2>
                    <p className="max-w-2xl mx-auto text-gray-400">
                        O que nos move e o que acreditamos como igreja.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {beliefs.map((item, index) => (
                        <div key={index} ref={el => { cardsRef.current[index] = el }}>
                            <div className="bg-dark-surface border border-white/5 p-6 rounded-xl h-full flex flex-col items-center text-center hover:bg-white/10 transition-colors cursor-default group">
                                <div className="mb-6 p-4 rounded-full bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_20px_rgba(31,107,255,0.3)] transition-all">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-neon-blue transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Beliefs;
