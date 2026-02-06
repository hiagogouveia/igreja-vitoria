'use client';

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import CavForm from './CavForm';
import CavMap from './CavMap';
import AddressSearch from './AddressSearch';
import { CavData, createCav } from '@/app/actions/cav-actions';
import Button from '@/components/ui/Button';

interface CavInterfaceProps {
    initialCavs: (CavData & { id: string })[];
}

export default function CavInterface({ initialCavs }: CavInterfaceProps) {
    const [cavs, setCavs] = useState(initialCavs);
    const [showForm, setShowForm] = useState(false);
    const [selectedCavId, setSelectedCavId] = useState<string | null>(null);

    const handleSave = async (data: CavData) => {
        const result = await createCav(data);
        if (result.success && result.data) {
            setCavs([...cavs, result.data as any]);
            setShowForm(false);
        }
    };

    const handleFindNearest = (address: string, lat: number, lng: number) => {
        if (cavs.length === 0) return;

        let minDistance = Infinity;
        let nearestId: string | null = null;

        cavs.forEach(cav => {
            if (cav.latitude && cav.longitude) {
                // Simple Euclidean distance
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
    };

    return (
        <div className="relative w-full h-[calc(100vh-80px)] md:h-screen">
            {/* Map */}
            <CavMap
                cavs={cavs}
                selectedCavId={selectedCavId}
                onSelectCav={(cav) => setSelectedCavId(cav.id)}
            />

            {/* Search Bar - Floating on top */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-full max-w-md px-4">
                <div className="bg-black/90 backdrop-blur-sm rounded-lg shadow-2xl p-3 border border-white/20">
                    <AddressSearch onAddressSelect={handleFindNearest} />
                </div>
            </div>

            {/* Add Button - Bottom Right */}
            <div className="absolute bottom-6 right-6 z-10">
                <Button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 shadow-2xl"
                >
                    <Plus size={20} />
                    Nova Célula
                </Button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex items-center justify-center p-4">
                    <div className="bg-dark-surface border border-white/10 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <CavForm
                            onSave={handleSave}
                            onCancel={() => setShowForm(false)}
                        />
                    </div>
                </div>
            )}

            {/* Selected CAV Info - Bottom Left */}
            {selectedCavId && (
                <div className="absolute bottom-6 left-6 z-10 bg-black/90 backdrop-blur-sm rounded-lg p-4 border border-neon-blue max-w-xs">
                    {(() => {
                        const selected = cavs.find(c => c.id === selectedCavId);
                        if (!selected) return null;
                        return (
                            <>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-neon-blue">{selected.name}</h3>
                                    <button
                                        onClick={() => setSelectedCavId(null)}
                                        className="text-gray-400 hover:text-white"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                                <p className="text-sm text-gray-300 mb-1">
                                    {selected.dayOfWeek} às {selected.time}
                                </p>
                                {selected.leaderName && (
                                    <p className="text-sm text-gray-400">
                                        Líder: {selected.leaderName}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-2">
                                    {selected.address}
                                </p>
                            </>
                        );
                    })()}
                </div>
            )}
        </div>
    );
}
