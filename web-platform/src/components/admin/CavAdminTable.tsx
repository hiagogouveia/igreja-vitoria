'use client';

import React, { useState, useTransition } from 'react';
import { Plus, Pencil, Trash2, Power } from 'lucide-react';
import Button from '@/components/ui/Button';
import CavAdminForm from './CavAdminForm';
import {
    CavData,
    createCav,
    updateCav,
    toggleCavActive,
    hardDeleteCav,
} from '@/app/actions/cav-actions';

type Cav = CavData & { id: string };

interface CavAdminTableProps {
    initialCavs: Cav[];
}

export default function CavAdminTable({ initialCavs }: CavAdminTableProps) {
    const [cavs, setCavs] = useState<Cav[]>(initialCavs);
    const [editing, setEditing] = useState<Cav | null>(null);
    const [creating, setCreating] = useState(false);
    const [pendingId, setPendingId] = useState<string | null>(null);
    const [, startTransition] = useTransition();

    const handleCreate = async (data: CavData) => {
        const result = await createCav(data);
        if (result.success && result.data) {
            setCavs(prev => [...prev, result.data as Cav]);
            setCreating(false);
        } else {
            throw new Error(result.error || 'Falha ao criar CAV');
        }
    };

    const handleUpdate = async (data: CavData) => {
        if (!editing) return;
        const result = await updateCav(editing.id, data);
        if (result.success && result.data) {
            setCavs(prev => prev.map(c => (c.id === editing.id ? (result.data as Cav) : c)));
            setEditing(null);
        } else {
            throw new Error(result.error || 'Falha ao atualizar CAV');
        }
    };

    const handleToggle = (cav: Cav) => {
        setPendingId(cav.id);
        startTransition(async () => {
            const result = await toggleCavActive(cav.id);
            if (result.success && result.data) {
                setCavs(prev => prev.map(c => (c.id === cav.id ? (result.data as Cav) : c)));
            }
            setPendingId(null);
        });
    };

    const handleDelete = (cav: Cav) => {
        if (!confirm(`Excluir permanentemente "${cav.name}"? Esta ação não pode ser desfeita.`)) return;
        setPendingId(cav.id);
        startTransition(async () => {
            const result = await hardDeleteCav(cav.id);
            if (result.success) {
                setCavs(prev => prev.filter(c => c.id !== cav.id));
            } else {
                alert(result.error || 'Falha ao excluir CAV');
            }
            setPendingId(null);
        });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Gerenciar CAVs</h1>
                <Button
                    onClick={() => setCreating(true)}
                    className="flex items-center gap-2"
                >
                    <Plus size={18} />
                    Nova CAV
                </Button>
            </div>

            <div className="bg-dark-surface rounded-xl border border-white/10 overflow-hidden">
                {cavs.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        Nenhuma CAV cadastrada.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-gray-400 text-sm">
                                <tr>
                                    <th className="p-4">Nome</th>
                                    <th className="p-4">Líder</th>
                                    <th className="p-4">Bairro</th>
                                    <th className="p-4">Encontro</th>
                                    <th className="p-4">Coords</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {cavs.map((cav) => {
                                    const isPending = pendingId === cav.id;
                                    return (
                                        <tr key={cav.id} className="hover:bg-white/5">
                                            <td className="p-4 font-medium text-white">{cav.name}</td>
                                            <td className="p-4 text-gray-300">{cav.leaderName || '-'}</td>
                                            <td className="p-4 text-gray-300">{cav.neighborhood || '-'}</td>
                                            <td className="p-4 text-gray-300 whitespace-nowrap">
                                                {cav.dayOfWeek} às {cav.time}
                                            </td>
                                            <td className="p-4 text-xs text-gray-400 whitespace-nowrap">
                                                {cav.latitude && cav.longitude
                                                    ? `${cav.latitude.toFixed(3)}, ${cav.longitude.toFixed(3)}`
                                                    : <span className="text-yellow-500">sem geo</span>}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${cav.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                    {cav.active ? 'Ativa' : 'Inativa'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-end items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditing(cav)}
                                                        className="p-2 rounded hover:bg-white/10 text-neon-blue disabled:opacity-50"
                                                        disabled={isPending}
                                                        title="Editar"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggle(cav)}
                                                        className="p-2 rounded hover:bg-white/10 text-yellow-400 disabled:opacity-50"
                                                        disabled={isPending}
                                                        title={cav.active ? 'Desativar' : 'Ativar'}
                                                    >
                                                        <Power size={16} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(cav)}
                                                        className="p-2 rounded hover:bg-red-500/10 text-red-500 disabled:opacity-50"
                                                        disabled={isPending}
                                                        title="Excluir permanentemente"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {(creating || editing) && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-dark-surface border border-white/10 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <CavAdminForm
                            initial={editing}
                            onSubmit={editing ? handleUpdate : handleCreate}
                            onCancel={() => {
                                setEditing(null);
                                setCreating(false);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
