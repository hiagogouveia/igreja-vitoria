import React from 'react';
import { getCavs } from '@/app/actions/cav-actions';
import CavInterface from '@/components/cavs/CavInterface';
import Navbar from '@/components/Navbar';

// Ensure fresh data
export const dynamic = 'force-dynamic';

export default async function CavEnderecosPage() {
    const { data: cavs, success } = await getCavs();

    if (!success) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                Erro ao carregar dados. Tente novamente mais tarde.
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
