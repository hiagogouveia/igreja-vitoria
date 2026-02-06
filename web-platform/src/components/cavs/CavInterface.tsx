'use client';

import React, { useState } from 'react';
import { Plus, List, Map as MapIcon, X } from 'lucide-react';
import CavList from './CavList';
import CavForm from './CavForm';
import CavMap from './CavMap';
import { CavData, createCav, updateCav, deleteCav } from '@/app/actions/cav-actions';
import Button from '@/components/ui/Button'; // Assuming existing component

interface CavInterfaceProps {
    initialCavs: (CavData & { id: string })[];
}

export default function CavInterface({ initialCavs }: CavInterfaceProps) {
    const [cavs, setCavs] = useState(initialCavs);
    const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
    const [selectedCavId, setSelectedCavId] = useState<string | null>(null);
    const [editingCav, setEditingCav] = useState<(CavData & { id: string }) | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Optimistic updates could be improved here, but simple state sync for now
    const refreshList = (updatedCav: CavData & { id: string }, type: 'add' | 'update') => {
        if (type === 'add') {
            setCavs([...cavs, updatedCav]);
        } else {
            setCavs(cavs.map(c => c.id === updatedCav.id ? updatedCav : c));
        }
    };

    const handleSave = async (data: CavData) => {
        if (editingCav) {
            const result = await updateCav(editingCav.id, data);
            if (result.success && result.data) {
                refreshList(result.data as any, 'update');
                setViewMode('list');
                setEditingCav(null);
            }
        } else {
            const result = await createCav(data);
            if (result.success && result.data) {
                refreshList(result.data as any, 'add');
                setViewMode('list');
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja remover esta célula?')) {
            const result = await deleteCav(id);
            if (result.success) {
                setCavs(cavs.filter(c => c.id !== id));
                if (selectedCavId === id) setSelectedCavId(null);
            }
        }
    };

    const handleEdit = (cav: CavData & { id: string }) => {
        setEditingCav(cav);
        setViewMode('form');
        setIsSidebarOpen(true);
    };

    const handleSelect = (cav: CavData & { id: string }) => {
        setSelectedCavId(cav.id);
        if (!isSidebarOpen) setIsSidebarOpen(true);
    };

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] md:h-screen gap-4 p-4 relative overflow-hidden">

            {/* Mobile Toggle */}
            <div className="md:hidden fixed bottom-6 right-6 z-50 flex flex-col gap-2">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="bg-neon-blue text-black p-4 rounded-full shadow-lg"
                >
                    {isSidebarOpen ? <X size={24} /> : <List size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <div
                className={`
            fixed md:relative inset-y-0 left-0 z-40
            w-full md:w-[400px] shrink-0
            bg-black/95 md:bg-dark-surface backdrop-blur-md md:backdrop-blur-0
            border-r border-white/10
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:!w-0 md:!p-0 md:!border-0 md:overflow-hidden'}
            flex flex-col
        `}
            >
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <MapIcon className="text-neon-purple" />
                        Células
                    </h2>
                    {viewMode === 'list' && (
                        <Button
                            size="sm"
                            onClick={() => { setEditingCav(null); setViewMode('form'); }}
                            className="flex items-center gap-2"
                        >
                            <Plus size={16} /> Nova
                        </Button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {viewMode === 'list' ? (
                        <CavList
                            cavs={cavs}
                            onSelect={handleSelect}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            selectedId={selectedCavId}
                        />
                    ) : (
                        <CavForm
                            initialData={editingCav}
                            onSave={handleSave}
                            onCancel={() => { setEditingCav(null); setViewMode('list'); }}
                        />
                    )}
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 rounded-xl overflow-hidden relative border border-white/10">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-full max-w-sm ml-6 md:ml-0 px-4 md:px-0">
                    <div className="bg-black/90 backdrop-blur-sm rounded-lg shadow-2xl p-2 border border-white/20">
                        <AddressSearch onAddressSelect={(addr, lat, lng) => {
                            // Find nearest CAV logic
                            if (cavs.length === 0) return;

                            let minDistance = Infinity;
                            let nearestId: string | null = null;

                            cavs.forEach(cav => {
                                if (cav.latitude && cav.longitude) {
                                    // Simple distance calculation
                                    const dist = Math.sqrt(
                                        Math.pow(cav.latitude - lat, 2) +
                                        Math.pow(cav.longitude - lng, 2)
                                    );
                                    if (dist < minDistance) {
                                        minDistance = dist;
                                        nearestId = cav.id;
                                    }
                                }
                            });

                            if (nearestId) {
                                setSelectedCavId(nearestId);
                            }
                        }} />
                    </div>
                </div>

                <CavMap
                    cavs={cavs}
                    selectedCavId={selectedCavId}
                    onSelectCav={handleSelect}
                />
            </div>

        </div>
    );
}
