import React from 'react';
import { ArrowLeft, CreditCard, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const ContribuaPagamento = () => {
    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
            <div className="max-w-md mx-auto">
                <Link to="/" className="inline-flex items-center text-gray-400 hover:text-neon-blue mb-8 transition-colors">
                    <ArrowLeft size={20} className="mr-2" /> Voltar para Home
                </Link>

                <div className="bg-dark-surface border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue to-neon-purple"></div>

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-neon-purple/20 rounded-full flex items-center justify-center mx-auto mb-4 text-neon-purple">
                            <CreditCard size={32} />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">Contribuição Online</h1>
                        <p className="text-gray-400 text-sm">Ambiente seguro para sua doação</p>
                    </div>

                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Valor da Contribuição (R$)</label>
                            <input
                                type="number"
                                placeholder="0,00"
                                className="w-full bg-black/50 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-neon-purple transition-colors text-lg"
                            />
                        </div>

                        {/* Placeholder for Payment Gateway Fields */}
                        <div className="p-4 bg-neon-blue/5 border border-neon-blue/20 rounded-xl text-center">
                            <p className="text-sm text-gray-300">
                                <Lock size={16} className="inline mr-1 -mt-1" />
                                Este é uma página de demonstração. Em produção, aqui seria integrado o formulário do Gateway de Pagamento (Stripe, Pagar.me, etc).
                            </p>
                        </div>

                        <Button variant="primary" className="w-full py-4 text-lg">
                            Confirmar Doação
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-500">
                            "Deus ama a quem dá com alegria." - 2 Coríntios 9:7
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContribuaPagamento;
