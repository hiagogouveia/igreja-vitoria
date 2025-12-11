import React from 'react';

const Cav = () => {
    return (
        <div className="pt-24 container mx-auto px-4 min-h-screen">
            <h1 className="text-4xl font-bold mb-6">Casas de Vitória (CAV)</h1>
            <p className="text-gray-400 max-w-2xl mb-8">
                Nossas células acontecem semanalmente em diversos bairros. Encontre uma CAV perto de você.
            </p>
            {/* Placeholder for map or list */}
            <div className="p-12 border border-dashed border-white/20 rounded-lg text-center text-gray-500">
                Lista de CAVs em breve...
            </div>
        </div>
    );
};

export default Cav;
