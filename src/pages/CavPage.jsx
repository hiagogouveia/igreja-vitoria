import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MapPin, Calendar, Users } from 'lucide-react';

const CavPage = () => {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-neon-blue selection:text-white">
            <Navbar />

            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
                        Casa de <span className="text-neon-blue">Vitória</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        A igreja nos lares. Um tempo de comunhão, palavra e oração perto de você.
                    </p>
                </div>

                {/* Info Cards */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white/5 border border-white/10 p-8 rounded-2xl text-center hover:border-neon-blue/50 transition-colors group">
                        <div className="w-16 h-16 bg-neon-blue/20 rounded-full flex items-center justify-center mx-auto mb-6 text-neon-blue group-hover:scale-110 transition-transform">
                            <Calendar size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Dias de Encontro</h3>
                        <p className="text-gray-400">Terça, Quinta e Sexta-feira</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-8 rounded-2xl text-center hover:border-neon-purple/50 transition-colors group">
                        <div className="w-16 h-16 bg-neon-purple/20 rounded-full flex items-center justify-center mx-auto mb-6 text-neon-purple group-hover:scale-110 transition-transform">
                            <Users size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Comunhão</h3>
                        <p className="text-gray-400">Tempo de qualidade, partilhar o pão e fortalecer vínculos.</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-8 rounded-2xl text-center hover:border-neon-blue/50 transition-colors group">
                        <div className="w-16 h-16 bg-neon-blue/20 rounded-full flex items-center justify-center mx-auto mb-6 text-neon-blue group-hover:scale-110 transition-transform">
                            <MapPin size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Perto de Você</h3>
                        <p className="text-gray-400">Encontre uma CAV no seu bairro e participe.</p>
                    </div>
                </div>

                {/* Map Section */}
                <div className="bg-dark-surface border border-white/10 rounded-2xl overflow-hidden">
                    <div className="p-8 border-b border-white/10">
                        <h2 className="text-2xl font-bold mb-2">CAV - Bairro Universitário</h2>
                        <p className="text-gray-400 flex items-center">
                            <MapPin size={18} className="mr-2 text-neon-blue" />
                            Av. Vitor Meireles, 163 - Casa 03 (Sexta às 19:30)
                        </p>
                    </div>
                    <div className="w-full h-[400px] bg-gray-800 relative">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3737.5686036814467!2d-54.60627592475659!3d-20.49303358097956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9486e8851493108b%3A0x6b49080985c5b597!2sAv.%20Vitor%20Meireles%2C%20163%20-%20Universit%C3%A1rio%2C%20Campo%20Grande%20-%20MS%2C%2079060-490!5e0!3m2!1spt-BR!2sbr!4v1715456128452!5m2!1spt-BR!2sbr"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default CavPage;
