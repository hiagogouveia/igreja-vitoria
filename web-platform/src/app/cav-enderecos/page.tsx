import React from 'react';
import { getCavs } from '@/app/actions/cav-actions';
import CavInterface from '@/components/cavs/CavInterface';
import Navbar from '@/components/Navbar';

// Ensure fresh data
export const dynamic = 'force-dynamic';

export default async function CavEnderecosPage() {
    const { data: cavs, success, error } = await getCavs();

    if (!success) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500 flex-col gap-4 p-8">
                <h1 className="text-2xl font-bold">Erro ao carregar dados</h1>
                <p className="bg-red-950/50 p-4 rounded text-sm font-mono whitespace-pre-wrap text-left max-w-4xl break-words">{error}</p>
                <p>Tente novamente mais tarde.</p>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-black text-white flex flex-col">
            <Navbar />
            <CavInterface initialCavs={cavs as any} />
        </main>
    );
}
