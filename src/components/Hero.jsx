import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Button from './ui/Button';

const Hero = () => {
    const heroRef = useRef(null);
    const titleRef = useRef(null);
    const textRef = useRef(null);
    const buttonsRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline();

        // Reset initial states
        gsap.set([titleRef.current, textRef.current, buttonsRef.current], { opacity: 0, y: 20 });

        // Title Typing Animation (Simulated with staggered reveal)
        const titleText = "Igreja Vitória";
        // We can do a typing effect by animating opacity of characters, but for simplicity/performance in this initial pass, 
        // let's do a smooth text reveal

        tl.to(titleRef.current, {
            duration: 1.5,
            opacity: 1,
            y: 0,
            ease: "power3.out",
            text: titleText // Requires TextPlugin, simpler to just fade in for v1 or standard fade
        })
            .to(textRef.current, {
                duration: 1,
                opacity: 1,
                y: 0,
                ease: "power3.out"
            }, "-=0.5")
            .to(buttonsRef.current, {
                duration: 1,
                opacity: 1,
                y: 0,
                stagger: 0.2,
                ease: "back.out(1.7)"
            }, "-=0.5");

        // Background particles animation (simple CSS/GSAP loop)
        // Could add more complex particle system here later

    }, []);

    return (
        <div ref={heroRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-dark-bg">
            {/* Dynamic Background with Gradients and simulated lights */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-dark-surface to-black opacity-80"></div>

                {/* Animated Glow spots */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue rounded-full blur-[128px] opacity-20 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple rounded-full blur-[128px] opacity-20 animate-pulse delay-1000"></div>

                {/* Placeholder for Photo/Video */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2673&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

                {/* Animated Logo */}
                <div className="mb-8 flex justify-center">
                    <img
                        src="/logo-v-final.png"
                        alt="Logo V"
                        className="h-32 w-auto object-contain invert drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-pulse"
                    />
                </div>

                <h1
                    ref={titleRef}
                    className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                >
                    Igreja <span className="text-neon-blue inline-block">Vitória</span>
                </h1>

                <div ref={textRef} className="space-y-4 mb-10">
                    <p className="text-xl md:text-2xl text-gray-200 font-medium italic">
                        “Uma igreja formada de pessoas imperfeitas, mas que amam um Deus que é Perfeito.”
                    </p>
                    <p className="text-lg text-gray-400">
                        Seja bem-vindo(a). Aqui você encontra fé, propósito e família.
                    </p>
                </div>

                <div ref={buttonsRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                        variant="primary"
                        className="w-full sm:w-auto text-lg px-8 py-4 shadow-neon-blue hover:shadow-[0_0_30px_rgba(31,107,255,0.6)]"
                        onClick={() => document.getElementById('live').scrollIntoView({ behavior: 'smooth' })}
                    >
                        Assistir Ao Vivo
                    </Button>
                    <Button
                        variant="secondary"
                        className="w-full sm:w-auto text-lg px-8 py-4 shadow-neon-purple hover:shadow-[0_0_30px_rgba(139,47,255,0.6)]"
                        onClick={() => document.getElementById('location').scrollIntoView({ behavior: 'smooth' })}
                    >
                        Visitar a Igreja
                    </Button>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-gray-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </div>
    );
};

export default Hero;
