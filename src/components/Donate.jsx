import React from 'react';
import { Copy, CreditCard, Heart, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './ui/Button';

const Donate = () => {
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Chave PIX copiada para a área de transferência!');
    };

    return (
        <section className="relative py-24 bg-black overflow-hidden" id="donate">
            {/* Background with soft golden/blue glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500/5 via-black to-black"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Faça Parte da <span className="text-neon-blue">Missão</span>
                    </h2>
                    <p className="max-w-xl mx-auto text-gray-400">
                        Sua generosidade mantém nossos projetos sociais e leva a mensagem a mais lugares.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* PIX Option */}
                    <div className="bg-white/5 backdrop-blur-md border border-neon-purple/30 rounded-2xl p-8 relative overflow-hidden group hover:border-neon-purple/60 transition-colors duration-300">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-neon-purple/20 rounded-full blur-[60px] group-hover:bg-neon-purple/30 transition-all"></div>

                        <div className="flex items-center space-x-4 mb-6">
                            <div className="p-3 bg-neon-purple/10 rounded-lg text-neon-purple">
                                <Smartphone size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Contribua via PIX</h3>
                        </div>

                        <p className="text-gray-400 mb-6 text-sm">
                            Use a chave abaixo para dízimos e ofertas. É rápido, seguro e sem taxas.
                        </p>

                        <div className="bg-black/30 p-4 rounded text-left font-mono text-sm mb-6 flex items-center justify-between group cursor-pointer hover:bg-black/50 transition-colors" onClick={() => copyToClipboard('60.753.546/0001-45')}>
                            <div>
                                <p className="text-gray-500 mb-1 text-xs uppercase tracking-wider">Chave PIX (CNPJ)</p>
                                <p className="text-white text-lg select-all">60.753.546/0001-45</p>
                            </div>
                            <div className="text-neon-blue opacity-0 group-hover:opacity-100 transition-opacity">
                                <Copy size={18} />
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-white"
                            onClick={() => copyToClipboard('60.753.546/0001-45')}
                        >
                            Copiar Chave PIX
                        </Button>
                    </div>

                    {/* Card Option */}
                    <div className="bg-white/5 backdrop-blur-md border border-neon-blue/30 rounded-2xl p-8 relative overflow-hidden group hover:border-neon-blue/60 transition-colors duration-300">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-neon-blue/20 rounded-full blur-[60px] group-hover:bg-neon-blue/30 transition-all"></div>

                        <div className="flex items-center space-x-4 mb-6">
                            <div className="p-3 bg-neon-blue/10 rounded-lg text-neon-blue">
                                <CreditCard size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Cartão ou Boleto</h3>
                        </div>

                        <p className="text-gray-400 mb-6 text-sm">
                            Faça sua doação única ou recorrente através da nossa plataforma segura.
                        </p>

                        <Link to="/contribua-pagamento">
                            <Button variant="primary" className="w-full justify-center shadow-lg hover:shadow-neon-blue/40">
                                Contribuir Agora
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Transparency Note */}
                <div className="mt-16 text-center border-t border-white/5 pt-10">
                    <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm mb-4">
                        <Heart size={16} className="text-red-500" />
                        <span>Transparência e Gratidão</span>
                    </div>
                    <p className="text-gray-600 text-xs max-w-2xl mx-auto">
                        Todas as ofertas são destinadas à manutenção do templo, projetos sociais e expansão missionária.
                        Relatórios disponíveis para membros na secretaria.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Donate;
