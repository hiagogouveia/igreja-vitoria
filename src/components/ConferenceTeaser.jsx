import React from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * Dobra promocional da Vitória Conference 2026 · RESTORE.
 * Teaser cinematográfico (Broken → Restore) que leva para a landing
 * dedicada em /conference/ (página estática independente do SPA).
 * Usa a identidade visual aprovada (vermelho/lava sobre preto).
 */
const CONFERENCE_URL = '/conference/';

const ConferenceTeaser = () => {
    return (
        <section
            id="conference"
            className="relative overflow-hidden bg-black border-t border-white/5"
            aria-labelledby="conference-title"
        >
            {/* ----- Fundo cinematográfico ----- */}
            <div className="absolute inset-0">
                {/* Pomba / key visual */}
                <div
                    className="absolute inset-0 bg-cover bg-center md:bg-right opacity-70"
                    style={{ backgroundImage: `url('${CONFERENCE_URL}assets/kv-3.png')` }}
                />
                {/* Scrims para legibilidade */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
                {/* Glow vermelho */}
                <div
                    className="absolute -top-1/3 right-0 w-[60vw] h-[85vh] rounded-full blur-[90px] animate-pulse"
                    style={{
                        background:
                            'radial-gradient(circle, rgba(250,77,9,.35), rgba(216,18,6,.16) 45%, transparent 70%)',
                    }}
                />
                {/* Feixes de luz */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-screen">
                    <span
                        className="absolute -top-[10%] left-[58%] w-[4%] h-[130%] blur-md rotate-3"
                        style={{ background: 'linear-gradient(180deg,transparent,rgba(255,227,208,.45),transparent)' }}
                    />
                    <span
                        className="absolute -top-[10%] left-[70%] w-[3%] h-[130%] blur-md -rotate-2 opacity-70"
                        style={{ background: 'linear-gradient(180deg,transparent,rgba(255,227,208,.4),transparent)' }}
                    />
                    <span
                        className="absolute -top-[10%] left-[82%] w-[3%] h-[130%] blur-md rotate-2 opacity-50"
                        style={{ background: 'linear-gradient(180deg,transparent,rgba(255,227,208,.35),transparent)' }}
                    />
                </div>
            </div>

            {/* ----- Conteúdo ----- */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-36">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-3 text-[12px] font-mono uppercase tracking-[0.3em] text-[#FF5A2A] mb-7">
                        <span className="w-8 h-px bg-current" />
                        Vitória Conference 2026
                    </div>

                    <h2
                        id="conference-title"
                        className="text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.95] tracking-tight text-white mb-6"
                    >
                        É tempo de{' '}
                        <span
                            className="text-transparent bg-clip-text"
                            style={{ backgroundImage: 'linear-gradient(100deg,#FA4D09,#E5380A,#FF9900)' }}
                        >
                            restauração.
                        </span>
                    </h2>

                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8 max-w-xl">
                        Três dias que podem marcar a sua história. Uma experiência de adoração,
                        palavra, comunhão e transformação.
                    </p>

                    {/* Datas */}
                    <div className="flex items-center gap-4 mb-10">
                        <div className="flex items-center gap-3 text-2xl md:text-3xl font-black text-white">
                            <span>28</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                            <span>29</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                            <span>30</span>
                        </div>
                        <span className="font-mono text-xs uppercase tracking-[0.24em] text-gray-400">
                            de Agosto
                        </span>
                    </div>

                    {/* CTAs — navegação real para a landing estática */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <a
                            href={CONFERENCE_URL}
                            className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full font-bold uppercase tracking-wider text-sm text-white transition-all duration-300 hover:-translate-y-0.5"
                            style={{
                                background: 'linear-gradient(100deg,#D81206,#FA4D09)',
                                boxShadow: '0 10px 30px rgba(216,18,6,.42)',
                            }}
                        >
                            Garantir minha vaga
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a
                            href={CONFERENCE_URL}
                            className="inline-flex items-center justify-center px-7 py-4 rounded-full font-bold uppercase tracking-wider text-sm text-white border border-white/30 transition-all duration-300 hover:border-[#FA4D09] hover:text-[#FA4D09] hover:-translate-y-0.5"
                        >
                            Saiba mais
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ConferenceTeaser;
