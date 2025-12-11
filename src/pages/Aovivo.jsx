import React from 'react';
import LiveSection from '../components/LiveSection';

const Aovivo = () => {
    return (
        <div className="bg-black min-h-screen pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Culto <span className="text-neon-blue">Ao Vivo</span>
                </h1>
                <p className="text-gray-400">
                    Participe dos nossos cultos de onde estiver.
                </p>
            </div>
            <LiveSection />
        </div>
    );
};

export default Aovivo;
