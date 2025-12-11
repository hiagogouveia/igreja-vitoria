import React from 'react';
import { Play } from 'lucide-react';

const VideoSection = () => {
    return (
        <section className="py-24 bg-black relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-900/10 blur-3xl rounded-full"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="w-full md:w-1/2">
                        <div className="relative aspect-video bg-zinc-900 rounded-xl overflow-hidden border border-white/10 group cursor-pointer">
                            {/* Placeholder Thumbnail */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/20 transition-all group-hover:scale-110">
                                    <Play fill="white" className="ml-1" />
                                </div>
                            </div>
                            <div className="absolute bottom-6 left-6 right-6">
                                <span className="text-xs font-bold bg-red-600 px-2 py-1 rounded text-white mb-2 inline-block">NOVO</span>
                                <h3 className="text-xl font-bold">Avisos da Semana</h3>
                                <p className="text-gray-300 text-sm mt-1">Confira tudo o que vai rolar na nossa igreja.</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2">
                        <h2 className="text-3xl font-bold mb-6">FIQUE POR DENTRO</h2>
                        <p className="text-gray-400 mb-8 leading-relaxed">
                            Nossa igreja está sempre em movimento. Acompanhe nossos vídeos semanais para saber sobre eventos, conferências e oportunidades de servir.
                        </p>
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                                    <div className="w-32 aspect-video bg-zinc-800 rounded relative flex-shrink-0">
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Play size={20} fill="white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1 group-hover:text-blue-400 transition-colors">Título do Vídeo Anterior {i}</h4>
                                        <p className="text-xs text-gray-500">Postado há {i} dias</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VideoSection;
