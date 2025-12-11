import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './ui/Button';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#home' },
        { name: 'Ao Vivo', href: '#live' },
        { name: 'Casa de Vitória', href: '#ministries' },
        { name: 'Eventos', href: '#events' },
        { name: 'Contribua', href: '#donate' },
    ];

    const scrollToTop = (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsOpen(false);
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-md border-b border-white/10 py-2' : 'bg-transparent py-4'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <a href="/" onClick={scrollToTop}>
                            <img src="/logo-v-final.png" alt="Igreja Vitória" className="h-20 w-auto object-contain invert" />
                        </a>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <a href="/" onClick={scrollToTop} className="text-white hover:text-neon-blue px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:drop-shadow-[0_0_8px_rgba(31,107,255,0.5)]">Home</a>
                            <a href="#live" className="text-gray-300 hover:text-neon-purple px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:drop-shadow-[0_0_8px_rgba(139,47,255,0.5)]">Ao Vivo</a>
                            <a href="#ministries" className="text-gray-300 hover:text-neon-blue px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300">Casa de Vitória</a>
                            <a href="#events" className="text-gray-300 hover:text-neon-purple px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300">Eventos</a>
                            <Link to="/contribua" className="bg-neon-blue/10 text-neon-blue border border-neon-blue/50 hover:bg-neon-blue hover:text-white px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 shadow-[0_0_10px_rgba(31,107,255,0.2)] hover:shadow-[0_0_20px_rgba(31,107,255,0.6)]">
                                Contribua
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-300 hover:text-white p-2"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden absolute w-full bg-black/95 backdrop-blur-xl border-b border-white/10 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'
                }`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="block px-3 py-4 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 border-l-2 border-transparent hover:border-neon-blue transition-all"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
