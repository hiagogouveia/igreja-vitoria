'use client';

import React, { useState } from 'react';
import { Save } from 'lucide-react';
import Button from '@/components/ui/Button';
import { CavData } from '@/app/actions/cav-actions';
import AddressSearch from './AddressSearch';

interface CavFormProps {
    onSave: (data: CavData) => Promise<void>;
    onCancel: () => void;
}

export default function CavForm({ onSave, onCancel }: CavFormProps) {
    const [formData, setFormData] = useState<CavData>({
        name: '',
        leaderName: '',
        address: '',
        dayOfWeek: 'Quarta',
        time: '20:00',
        latitude: null,
        longitude: null,
        neighborhood: '',
        city: 'Campo Grande',
        state: 'MS',
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
            <h3 className="text-xl font-bold text-white mb-4">Nova CAV</h3>

            <div>
                <label className="block text-sm text-gray-400 mb-1">Nome da Célula *</label>
                <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white focus:ring-2 focus:ring-neon-blue outline-none"
                    placeholder="Ex: Célula Centro"
                />
            </div>

            <div>
                <label className="block text-sm text-gray-400 mb-1">Líder</label>
                <input
                    type="text"
                    value={formData.leaderName || ''}
                    onChange={e => setFormData({ ...formData, leaderName: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white focus:ring-2 focus:ring-neon-blue outline-none"
                    placeholder="Nome do líder"
                />
            </div>

            <div>
                <label className="block text-sm text-gray-400 mb-1">Buscar Endereço *</label>
                <AddressSearch onAddressSelect={handleAddressSelect} />
                {formData.latitude && formData.longitude && (
                    <p className="text-xs text-green-400 mt-1">✓ Localização definida</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Dia *</label>
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
                    <label className="block text-sm text-gray-400 mb-1">Horário *</label>
                    <input
                        required
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
                    disabled={loading || !formData.latitude || !formData.longitude}
                >
                    <Save size={18} />
                    {loading ? 'Salvando...' : 'Salvar'}
                </Button>
            </div>
        </form>
    );
}
