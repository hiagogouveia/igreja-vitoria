'use client';

import React from 'react';
import { Edit, Trash2, MapPin, User, Clock } from 'lucide-react';
import { CavData } from '@/app/actions/cav-actions';

interface CavListProps {
    cavs: (CavData & { id: string })[];
    onSelect: (cav: CavData & { id: string }) => void;
    onEdit: (cav: CavData & { id: string }) => void;
    onDelete: (id: string) => void;
    selectedId?: string | null;
}

export default function CavList({ cavs, onSelect, onEdit, onDelete, selectedId }: CavListProps) {
    if (cavs.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                Nenhuma célula encontrada.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {cavs.map((cav) => (
                <div
                    key={cav.id}
                    onClick={() => onSelect(cav)}
                    className={`
            p-4 rounded-xl border cursor-pointer transition-all group
            ${selectedId === cav.id
                            ? 'bg-neon-blue/10 border-neon-blue shadow-[0_0_15px_rgba(0,229,255,0.1)]'
                            : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                        }
          `}
                >
                    <div className="flex justify-between items-start mb-2">
                        <h4 className={`font-bold text-lg ${selectedId === cav.id ? 'text-neon-blue' : 'text-white'}`}>
                            {cav.name}
                        </h4>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={(e) => { e.stopPropagation(); onEdit(cav); }}
                                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
                                title="Editar"
                            >
                                <Edit size={16} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(cav.id); }}
                                className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-full"
                                title="Excluir"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1.5 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                            <Clock size={14} className="text-neon-purple" />
                            <span>{cav.dayOfWeek} às {cav.time}</span>
                        </div>
                        {cav.leaderName && (
                            <div className="flex items-center gap-2">
                                <User size={14} />
                                <span>{cav.leaderName}</span>
                            </div>
                        )}
                        <div className="flex items-start gap-2">
                            <MapPin size={14} className="mt-0.5 shrink-0" />
                            <span className="line-clamp-2">{cav.address}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
