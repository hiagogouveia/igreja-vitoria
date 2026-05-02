'use client';

import React, { useState } from 'react';
import { Save } from 'lucide-react';
import Button from '@/components/ui/Button';
import { CavData } from '@/app/actions/cav-actions';
import AddressSearch from '@/components/cavs/AddressSearch';

export type CavWithId = CavData & { id?: string };

interface CavAdminFormProps {
    initial?: CavWithId | null;
    onSubmit: (data: CavData) => Promise<void>;
    onCancel: () => void;
}

const DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

export default function CavAdminForm({ initial, onSubmit, onCancel }: CavAdminFormProps) {
    const isEdit = !!initial?.id;

    const [formData, setFormData] = useState<CavData>({
        name: initial?.name ?? '',
        leaderName: initial?.leaderName ?? '',
        address: initial?.address ?? '',
        neighborhood: initial?.neighborhood ?? '',
        city: initial?.city ?? 'Campo Grande',
        state: initial?.state ?? 'MS',
        dayOfWeek: initial?.dayOfWeek ?? 'Terça',
        time: initial?.time ?? '19:30',
        latitude: initial?.latitude ?? null,
        longitude: initial?.longitude ?? null,
        active: initial?.active ?? true,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await onSubmit(formData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao salvar');
        } finally {
            setLoading(false);
        }
    };

    const handleAddressSelect = (address: string, lat: number, lng: number) => {
        setFormData(prev => ({ ...prev, address, latitude: lat, longitude: lng }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">
                {isEdit ? `Editar ${initial?.name}` : 'Nova CAV'}
            </h3>

            <div>
                <label className="block text-sm text-gray-400 mb-1">Nome da CAV *</label>
                <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white focus:ring-2 focus:ring-neon-blue outline-none"
                    placeholder="Ex: CAV Centro"
                />
            </div>

            <div>
                <label className="block text-sm text-gray-400 mb-1">Líder(es)</label>
                <input
                    type="text"
                    value={formData.leaderName || ''}
                    onChange={e => setFormData({ ...formData, leaderName: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white focus:ring-2 focus:ring-neon-blue outline-none"
                    placeholder="Ex: Pr. Hiago & Isa"
                />
            </div>

            <div>
                <label className="block text-sm text-gray-400 mb-1">
                    Buscar Endereço {isEdit ? '(deixe em branco para manter)' : '*'}
                </label>
                <AddressSearch onAddressSelect={handleAddressSelect} />
                {formData.address && (
                    <p className="text-xs text-gray-400 mt-1 break-words">
                        Atual: {formData.address}
                    </p>
                )}
                {formData.latitude && formData.longitude && (
                    <p className="text-xs text-green-400 mt-1">
                        ✓ Localização: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm text-gray-400 mb-1">Bairro</label>
                <input
                    type="text"
                    value={formData.neighborhood || ''}
                    onChange={e => setFormData({ ...formData, neighborhood: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white focus:ring-2 focus:ring-neon-blue outline-none"
                    placeholder="Ex: Rita Vieira"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Dia *</label>
                    <select
                        value={formData.dayOfWeek}
                        onChange={e => setFormData({ ...formData, dayOfWeek: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white focus:ring-2 focus:ring-neon-blue outline-none [&>option]:text-black"
                    >
                        {DAYS.map(day => (
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

            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input
                    type="checkbox"
                    checked={!!formData.active}
                    onChange={e => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 accent-neon-blue"
                />
                CAV ativa (visível no site público)
            </label>

            {error && (
                <p className="text-sm text-red-400 bg-red-950/40 border border-red-500/30 rounded px-3 py-2">
                    {error}
                </p>
            )}

            <div className="pt-2 flex gap-3">
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
                    disabled={loading || !formData.name || !formData.address}
                >
                    <Save size={18} />
                    {loading ? 'Salvando...' : 'Salvar'}
                </Button>
            </div>
        </form>
    );
}
