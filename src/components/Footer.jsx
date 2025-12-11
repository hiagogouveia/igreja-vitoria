import React from 'react';
import { Instagram, Youtube, MapPin, Mail, Phone } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-black border-t border-white/10 py-16 relative overflow-hidden">
            {/* Ambient background light */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-neon-blue/5 blur-[100px] pointer-events-none rounded-full"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <span className="mb-6 block">
                            <img src="/logo-v-final.png" alt="Igreja Vitória" className="h-16 w-auto object-contain invert" />
                        </span>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                            Uma igreja vibrante, apaixonada por Jesus e comprometida em ser luz na nossa cidade.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://www.instagram.com/igrejavitoriacg/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-neon-purple transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="https://www.youtube.com/@igrejavitoriacampogrande" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-neon-blue transition-colors">
                                <Youtube size={20} />
                            </a>
                        </div>
                    </div>

                    <div className="space-y-4 text-sm text-gray-400">
                        <div className="flex items-start gap-3">
                            <MapPin size={18} className="text-neon-blue mt-0.5 flex-shrink-0" />
                            <p>R. Mal. Rondon, 163<br />Amambai, Campo Grande - MS</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone size={18} className="text-neon-purple flex-shrink-0" />
                            <p>(67) 99831-8450</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail size={18} className="text-neon-blue flex-shrink-0" />
                            <p>contato@igrejavitoria.com.br</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
                <p>&copy; {new Date().getFullYear()} Igreja Vitória. Todos os direitos reservados.</p>
                <p className="mt-2 md:mt-0">Desenvolvido com excelência.</p>
            </div>
        </footer>
    );
};

export default Footer;
