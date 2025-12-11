import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Play } from 'lucide-react';
import Button from './ui/Button';

const LiveSection = () => {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

    // Simulate countdown to next Sunday 10am or similar
    // Countdown Logic
    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const today = now.getDay(); // 0 is Sunday
            const currentHour = now.getHours();

            // Target: Next Sunday at 18:00
            let targetDate = new Date(now);
            targetDate.setHours(18, 0, 0, 0);

            if (today === 0 && currentHour < 18) {
                // It's Sunday but before 18:00, target is today 18:00
            } else {
                // Calculate days until next Sunday
                const daysUntilSunday = (7 - today) % 7;
                const daysToAdd = daysUntilSunday === 0 ? 7 : daysUntilSunday;
                targetDate.setDate(now.getDate() + daysToAdd);
            }

            const difference = targetDate - now;

            if (difference > 0) {
                return {
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                    days: Math.floor(difference / (1000 * 60 * 60 * 24))
                };
            }
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        };

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative py-20 bg-dark-bg border-t border-white/5" id="live">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

                    {/* Main Player Area - Centered if possible, or large */}
                    <div className="lg:col-span-3 relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl opacity-50 blur-lg group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                        <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center">
                            <iframe
                                width="100%"
                                height="100%"
                                src="https://www.youtube.com/embed/MzUZeGObs4Y"
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="relative z-10"
                            ></iframe>
                        </div>
                    </div>

                    {/* Sidebar / Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-dark-surface p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2">
                                <div className="flex items-center space-x-2">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                    </span>
                                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Offline</span>
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2">Próximo Culto</h3>
                            <p className="text-gray-400 mb-6">Domingo às 18:00 (Culto da Família)</p>

                            <div className="grid grid-cols-3 gap-2 text-center mb-8">
                                <div className="bg-black/50 p-2 rounded-lg border border-white/10">
                                    <span className="text-2xl font-mono text-neon-blue font-bold">{timeLeft.hours}</span>
                                    <p className="text-[10px] text-gray-500 uppercase">Horas</p>
                                </div>
                                <div className="bg-black/50 p-2 rounded-lg border border-white/10">
                                    <span className="text-2xl font-mono text-neon-blue font-bold">{timeLeft.minutes}</span>
                                    <p className="text-[10px] text-gray-500 uppercase">Min</p>
                                </div>
                                <div className="bg-black/50 p-2 rounded-lg border border-white/10">
                                    <span className="text-2xl font-mono text-neon-blue font-bold">{timeLeft.seconds}</span>
                                    <p className="text-[10px] text-gray-500 uppercase">Seg</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                                    <div className="bg-neon-purple/20 p-2 rounded-lg text-neon-purple group-hover:text-white group-hover:bg-neon-purple transition-all">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium text-sm group-hover:text-neon-blue transition-colors">Culto da Família</h4>
                                        <p className="text-xs text-gray-500">Domingo • 18:00</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                                    <div className="bg-neon-blue/20 p-2 rounded-lg text-neon-blue group-hover:text-white group-hover:bg-neon-blue transition-all">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium text-sm group-hover:text-neon-blue transition-colors">Quarta-Flow</h4>
                                        <p className="text-xs text-gray-500">Quarta • 19:30</p>
                                    </div>
                                </div>
                            </div>

                            <Button variant="primary" className="w-full mt-6 shadow-none hover:shadow-neon-blue">
                                Ver Programação
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default LiveSection;
