'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, Music, Video, HeartHandshake, Baby, Coffee, Wrench } from 'lucide-react';
import Link from 'next/link';

// Register Plugin safely for Next.js
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const Ministries = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);

    const ministries = [
        { id: 'kids', name: "Vitória Kids", icon: <Baby />, color: "text-neon-blue", img: "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?q=80&w=2669&auto=format&fit=crop" },
        { id: 'operacionais', name: "Operacionais", icon: <Wrench />, color: "text-neon-purple", img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1080&auto=format&fit=crop" },
        { id: 'louvor', name: "Louvor", icon: <Music />, color: "text-neon-blue", img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2670&auto=format&fit=crop" },
        { id: 'midia', name: "Mídia", icon: <Video />, color: "text-white", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1080&auto=format&fit=crop" },
        { id: 'intercessao', name: "Intercessão", icon: <HeartHandshake />, color: "text-neon-purple", img: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1080&auto=format&fit=crop" },
        { id: 'recepcao', name: "Recepção", icon: <Coffee />, color: "text-neon-blue", img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop" },
        { id: 'welcome', name: "Welcome", icon: <HeartHandshake />, color: "text-neon-purple", img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1080&auto=format&fit=crop" },
    ];

    useEffect(() => {
        // Title Animation
        gsap.fromTo(titleRef.current,
            { opacity: 0, scale: 0.9 },
            {
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                }
            }
        );

        // Cards Animation
        const cards = gsap.utils.toArray('.ministry-card') as HTMLElement[];
        cards.forEach((card, i) => {
            gsap.fromTo(card,
                { opacity: 0, y: 100, rotate: 5 },
                {
                    opacity: 1,
                    y: 0,
                    rotate: 0,
                    duration: 0.8,
                    delay: i * 0.1,
                    ease: "back.out(1.2)",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 90%",
                    }
                }
            );
        });
    }, []);

    return (
        <section ref={sectionRef} className="relative py-24 bg-black overflow-hidden" id="ministries">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900/40 via-black to-black"></div>

            {/* Light Beams */}
            <div className="absolute top-0 left-1/3 w-32 h-[1000px] bg-gradient-to-b from-neon-blue/10 to-transparent transform -rotate-12 blur-3xl rounded-full pointer-events-none"></div>
            <div className="absolute top-0 right-1/3 w-32 h-[1000px] bg-gradient-to-b from-neon-purple/10 to-transparent transform rotate-12 blur-3xl rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div ref={titleRef} className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
                        Nossos <span className="text-neon-blue drop-shadow-[0_0_15px_rgba(31,107,255,0.5)]">Ministérios</span>
                    </h2>
                    <p className="mt-4 text-xl text-gray-400">
                        Existe um lugar para você servir e crescer.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {ministries.map((min, index) => (
                        <Link
                            href={`/ministerios/${min.id}`} // Updated to href for Next.js
                            key={index}
                            className="ministry-card group relative h-80 rounded-2xl overflow-hidden cursor-pointer block"
                        >
                            {/* Background Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: `url(${min.img})` }}
                            >
                                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500"></div>
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center transition-all duration-300">
                                <div className={`mb-4 transform scale-0 group-hover:scale-110 transition-transform duration-500 delay-100 ${min.color} p-4 rounded-full bg-black/30 backdrop-blur-md`}>
                                    {React.cloneElement(min.icon as React.ReactElement, { size: 40 })}
                                </div>

                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 break-words w-full px-2">
                                    {min.name}
                                </h3>

                                <div className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75">
                                    <span className="text-sm font-bold tracking-widest uppercase text-neon-blue border-b border-neon-blue pb-1">
                                        Saiba Mais
                                    </span>
                                </div>
                            </div>

                            {/* Neon Border Effect */}
                            <div className="absolute inset-0 border-2 border-transparent group-hover:border-neon-blue/50 rounded-2xl transition-colors duration-300 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] group-hover:shadow-[inset_0_0_30px_rgba(31,107,255,0.2)]"></div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Ministries;
