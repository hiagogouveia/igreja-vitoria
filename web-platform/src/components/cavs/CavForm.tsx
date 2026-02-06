'use client';

import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { CavData } from '@/app/actions/cav-actions';
import AddressSearch from './AddressSearch'; // Reuse search for address filling

interface CavFormProps {
    initialData?: (CavData & { id: string }) | null;
    onSave: (data: CavData) => Promise<void>;
    onCancel: () => void;
}

export default function CavForm({ initialData, onSave, onCancel }: CavFormProps) {
    const [formData, setFormData] = useState<CavData>({
        name: initialData?.name || '',
        leaderName: initialData?.leaderName || '',
        address: initialData?.address || '',
        dayOfWeek: initialData?.dayOfWeek || 'Quarta',
        time: initialData?.time || '20:00',
        latitude: initialData?.latitude || null,
        longitude: initialData?.longitude || null,
        neighborhood: initialData?.neighborhood || '',
        city: initialData?.city || 'Campo Grande',
        state: initialData?.state || 'MS',
        active: true,
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(formData);
        } finally {
            setLoading(false);
        }
    };

    const handleAddressSelect = (address: string, lat: number, lng: number) => {
        setFormData(prev => ({
            ...prev,
            address,
            latitude: lat,
            longitude: lng
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">
                    {initialData ? 'Editar Célula' : 'Nova Célula'}
                </h3>
                <button type="button" onClick={onCancel} className="text-gray-400 hover:text-white">
                    <X size={24} />
                </button>
            </div>

            <div>
                <label className="block text-sm text-gray-400 mb-1">Nome da Célula</label>
                <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white focus:ring-2 focus:ring-neon-blue outline-none"
                />
            </div>

            <div>
                <label className="block text-sm text-gray-400 mb-1">Líder</label>
                <input
                    type="text"
                    value={formData.leaderName || ''}
                    onChange={e => setFormData({ ...formData, leaderName: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white focus:ring-2 focus:ring-neon-blue outline-none"
                />
            </div>

            <div>
                <label className="block text-sm text-gray-400 mb-1">Endereço (Busca Automática)</label>
                <AddressSearch onAddressSelect={handleAddressSelect} />
                <div className="mt-2 text-xs text-gray-500">
                    Lat: {formData.latitude?.toFixed(5) || '-'}, Lng: {formData.longitude?.toFixed(5) || '-'}
                </div>
            </div>

            {/* Manual Address Fallback just in case */}
            <div>
                <label className="block text-sm text-gray-400 mb-1">Endereço Completo</label>
                <input
                    required
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Dia</label>
                    <select
                        value={formData.dayOfWeek}
                        onChange={e => setFormData({ ...formData, dayOfWeek: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white focus:ring-2 focus:ring-neon-blue outline-none [&>option]:text-black"
                    >
                        {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map(day => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Horário</label>
                    <input
                        type="time"
                        value={formData.time}
                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white focus:ring-2 focus:ring-neon-blue outline-none"
                    />
                </div>
            </div>

            <div className="pt-4 flex gap-3">
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={onCancel}
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2"
                    disabled={loading}
                >
                    <Save size={18} />
                    {loading ? 'Salvando...' : 'Salvar'}
                </Button>
            </div>
        </form>
    );
}
