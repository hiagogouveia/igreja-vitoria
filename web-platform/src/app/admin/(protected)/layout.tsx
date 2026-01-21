import { auth, signOut } from "@/auth";
import Link from 'next/link';
import { LayoutDashboard, Users, Calendar, Settings, LogOut } from 'lucide-react';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth();

    return (
        <div className="flex h-screen bg-black text-white">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-dark-surface hidden md:flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <h1 className="text-xl font-bold">Admin <span className="text-neon-blue">Panel</span></h1>
                    <p className="text-xs text-gray-400 mt-1">Bem-vindo, {session?.user?.name || 'Admin'}</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link href="/admin/cavs" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
                        <Users size={20} />
                        <span>Células (CAVs)</span>
                    </Link>
                    <Link href="/admin/events" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
                        <Calendar size={20} />
                        <span>Eventos</span>
                    </Link>
                    {/* Stub settings */}
                    <Link href="/admin/settings" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
                        <Settings size={20} />
                        <span>Configurações</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <form action={async () => {
                        'use server';
                        await signOut();
                    }}>
                        <button type="submit" className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg hover:bg-red-500/10 text-red-500 hover:text-red-400 transition-colors">
                            <LogOut size={20} />
                            <span>Sair</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-dark-bg p-8">
                {children}
            </main>
        </div>
    );
}
