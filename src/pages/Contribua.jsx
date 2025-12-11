import React from 'react';

const Contribua = () => {
    return (
        <div className="min-h-screen pt-20 pb-10 px-4 container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 glow-text">
                FAÇA SUA <span className="text-gray-500">CONTRIBUIÇÃO</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
                Sua generosidade nos ajuda a continuar levando a mensagem de esperança.
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-white/20 transition-all">
                    <h3 className="text-2xl font-bold mb-4">Dízimos e Ofertas</h3>
                    <p className="text-gray-400 mb-6">Contribua através de transferência bancária ou PIX.</p>
                    <div className="bg-black/30 p-4 rounded text-left font-mono text-sm">
                        <p className="text-gray-500 mb-2">Chave PIX:</p>
                        <p className="text-white select-all">pix@igrejavitoria.com.br</p>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-white/20 transition-all">
                    <h3 className="text-2xl font-bold mb-4">Projetos Sociais</h3>
                    <p className="text-gray-400 mb-6">Apoie nossas ações na comunidade.</p>
                    <div className="bg-black/30 p-4 rounded text-left font-mono text-sm">
                        <p className="text-gray-500 mb-2">Chave PIX:</p>
                        <p className="text-white select-all">social@igrejavitoria.com.br</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contribua;
