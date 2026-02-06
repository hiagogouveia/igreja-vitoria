'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { Search } from 'lucide-react';

interface AddressSearchProps {
    onAddressSelect: (address: string, lat: number, lng: number) => void;
}

export default function AddressSearch({ onAddressSelect }: AddressSearchProps) {
    const [inputValue, setInputValue] = useState('');
    const placesLibrary = useMapsLibrary('places');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!placesLibrary || !inputRef.current) return;

        const autocomplete = new placesLibrary.Autocomplete(inputRef.current, {
            fields: ['geometry', 'formatted_address'],
            componentRestrictions: { country: 'br' }, // Restrict to Brazil
        });

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (!place.geometry || !place.geometry.location) return;

            const address = place.formatted_address || '';
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            setInputValue(address);
            onAddressSelect(address, lat, lng);
        });
    }, [placesLibrary, onAddressSelect]);

    return (
        <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search size={18} />
            </div>
            <input
                ref={inputRef}
                type="text"
                placeholder="Digite seu endereço para encontrar a célula mais próxima..."
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent transition-all"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
        </div>
    );
}
