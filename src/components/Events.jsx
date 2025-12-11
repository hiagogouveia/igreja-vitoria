import React from 'react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import Button from './ui/Button';

const Events = () => {
    const events = [
        {
            title: "Conferência Vitória",
            date: "15 AGO",
            time: "19:00",
            location: "Auditório Principal",
            image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2670&auto=format&fit=crop",
            featured: true
        },
        {
            title: "Noite de Adoração",
            date: "22 AGO",
            time: "20:00",
            location: "Sede",
            image: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=2670&auto=format&fit=crop",
            featured: false
        },
        {
            title: "Acampamento Jovem",
            date: "10 SET",
            time: "18:00",
            location: "Sítio Vitória",
            image: "https://images.unsplash.com/photo-1478147427282-58a87a120781?q=80&w=2670&auto=format&fit=crop",
            featured: false
        }
    ];

    return (
        <section className="relative py-24 bg-black overflow-hidden" id="events">
            {/* Spotlight Effect */}
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-neon-purple/20 via-transparent to-transparent pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row items-end justify-between mb-12">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">Próximos <span className="text-neon-blue">Eventos</span></h2>
                        <p className="text-gray-400">Não perca o que está por vir na nossa família.</p>
                    </div>
                    <Button variant="ghost" className="hidden md:flex items-center group">
                        Ver Agenda Completa <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {events.map((event, index) => (
                        <div
                            key={index}
                            className={`relative rounded-2xl overflow-hidden group border border-white/10 hover:border-white/30 transition-all duration-300 ${event.featured ? 'lg:col-span-2 lg:row-span-2' : ''
                                }`}
                        >
                            {/* Background Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                style={{ backgroundImage: `url(${event.image})` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                            </div>

                            {/* Content */}
                            <div className="relative p-6 h-full flex flex-col justify-end min-h-[300px]">
                                <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2 text-center group-hover:bg-neon-blue group-hover:border-neon-blue transition-colors duration-300">
                                    <span className="block text-xs uppercase tracking-wider text-white mb-0.5">{event.date.split(' ')[1]}</span>
                                    <span className="block text-2xl font-bold text-white leading-none">{event.date.split(' ')[0]}</span>
                                </div>

                                <div className="space-y-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <div className="flex items-center text-xs text-gray-300 space-x-3 mb-2">
                                        <span className="flex items-center"><Calendar size={14} className="mr-1" /> {event.time}</span>
                                        <span className="flex items-center"><MapPin size={14} className="mr-1" /> {event.location}</span>
                                    </div>

                                    <h3 className={`font-bold text-white leading-tight ${event.featured ? 'text-3xl md:text-4xl' : 'text-xl'}`}>
                                        {event.title}
                                    </h3>

                                    <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <Button variant="outline" className="text-xs py-2 px-4 shadow-none hover:shadow-none hover:border-neon-blue hover:text-neon-blue hover:bg-black/50">
                                            Quero Participar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 md:hidden text-center">
                    <Button variant="ghost" className="inline-flex items-center group">
                        Ver Agenda Completa <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default Events;
