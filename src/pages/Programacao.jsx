import React from 'react';

const Programacao = () => {
    return (
        <div className="pt-24 container mx-auto px-4 min-h-screen">
            <h1 className="text-4xl font-bold mb-8">Programação Semanal</h1>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 border border-white/10 rounded-lg bg-zinc-900">
                    <h2 className="text-2xl font-bold mb-2">Domingo</h2>
                    <p className="text-gray-400">10h - Culto da Manhã</p>
                    <p className="text-gray-400">18h - Culto da Noite</p>
                </div>
                <div className="p-6 border border-white/10 rounded-lg bg-zinc-900">
                    <h2 className="text-2xl font-bold mb-2">Quarta-feira</h2>
                    <p className="text-gray-400">20h - Culto de Ensino</p>
                </div>
            </div>
        </div>
    );
};

export default Programacao;
