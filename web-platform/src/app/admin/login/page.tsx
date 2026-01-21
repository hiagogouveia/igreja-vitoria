'use client';

import { authenticate } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { Lock, Mail, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button
            type="submit"
            disabled={pending}
            className="w-full justify-center py-3 text-base font-bold bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/80 hover:to-neon-purple/80 border-0 shadow-[0_0_20px_rgba(31,107,255,0.3)] hover:shadow-[0_0_30px_rgba(31,107,255,0.5)] transition-all duration-300 transform hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {pending ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
            {pending ? 'Entrando...' : 'Entrar no Sistema'}
        </Button>
    )
}

export default function LoginPage() {
    const [errorMessage, dispatch] = useFormState(authenticate, undefined);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex min-h-screen items-center justify-center bg-black relative overflow-hidden">
            {/* Background Video - Reliable Wikimedia Source */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                    // Fallback Image
                    poster="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop"
                >
                    {/* Earth Rotating - Wikimedia Commons (Reliable) */}
                    <source src="https://upload.wikimedia.org/wikipedia/commons/transcoded/2/22/Earth_Western_Hemisphere_-_Transparent_Background.webm/Earth_Western_Hemisphere_-_Transparent_Background.webm.480p.vp9.webm" type="video/webm" />
                </video>

                {/* Overlay Gradients */}
                <div className="absolute inset-0 bg-black/80"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/90"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#000_100%)]"></div>
            </div>

            <div className="w-full max-w-md p-8 relative z-10">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                    <div className="text-center mb-10">
                        <div className="relative w-24 h-24 mx-auto mb-6 group">
                            <div className="absolute inset-0 bg-neon-blue rounded-full blur-[25px] opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                            <Image
                                src="/logo-v-final.png"
                                alt="Logo"
                                fill
                                className="object-contain invert drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] transform group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Área Administrativa</h2>
                        <p className="text-gray-400 text-sm mt-2">Acesse para gerenciar a plataforma</p>
                    </div>

                    <form action={dispatch} className="space-y-6">
                        <style jsx global>{`
                    input:-webkit-autofill,
                    input:-webkit-autofill:hover, 
                    input:-webkit-autofill:focus, 
                    input:-webkit-autofill:active {
                        -webkit-box-shadow: 0 0 0 30px #111111 inset !important;
                        -webkit-text-fill-color: white !important;
                        transition: background-color 5000s ease-in-out 0s;
                    }
                `}</style>

                        <div className="space-y-4">
                            {/* Error Message Alert */}
                            {errorMessage && (
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-shake">
                                    <AlertCircle size={16} />
                                    <p>{errorMessage}</p>
                                </div>
                            )}

                            <div className="group flex items-center bg-dark-bg/50 rounded-lg border border-white/10 focus-within:border-neon-blue focus-within:ring-1 focus-within:ring-neon-blue transition-all overflow-hidden relative h-12">
                                <div className="pl-3 pr-2 text-gray-500 group-focus-within:text-neon-blue transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full bg-transparent border-none text-white placeholder:text-gray-600 focus:ring-0 sm:text-sm focus:outline-none h-full"
                                    placeholder="Email de acesso"
                                />
                            </div>

                            <div className="group flex items-center bg-dark-bg/50 rounded-lg border border-white/10 focus-within:border-neon-purple focus-within:ring-1 focus-within:ring-neon-purple transition-all overflow-hidden relative h-12">
                                <div className="pl-3 pr-2 text-gray-500 group-focus-within:text-neon-purple transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full bg-transparent border-none text-white placeholder:text-gray-600 focus:ring-0 sm:text-sm focus:outline-none h-full"
                                    placeholder="Sua senha"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="pr-3 text-gray-500 hover:text-white transition-colors focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <SubmitButton />
                    </form>
                </div>

                <p className="text-center text-gray-600 text-xs mt-8">
                    &copy; {new Date().getFullYear()} Igreja Vitória. Sistema Interno.
                </p>
            </div>
        </div>
    );
}
