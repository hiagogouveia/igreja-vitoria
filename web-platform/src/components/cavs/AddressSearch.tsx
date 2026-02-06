'use client';

import React, { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { debounce } from 'lodash';

interface AddressSearchProps {
    onAddressSelect: (address: string, lat: number, lng: number) => void;
}

interface NominatimResult {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
}

export default function AddressSearch({ onAddressSelect }: AddressSearchProps) {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Debounced search function
    const searchAddress = useCallback(
        debounce(async (query: string) => {
            if (query.length < 3) {
                setSuggestions([]);
                return;
            }

            setIsLoading(true);
            try {
                // Campo Grande, MS bounding box (southwest to northeast)
                // Southwest: -20.6, -54.8
                // Northeast: -20.3, -54.4
                const viewbox = '-54.8,-20.6,-54.4,-20.3'; // left,bottom,right,top

                // Using Nominatim API (OpenStreetMap geocoding)
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?` +
                    new URLSearchParams({
                        q: `${query}, Campo Grande, MS`, // Add city to query
                        format: 'json',
                        addressdetails: '1',
                        limit: '5',
                        countrycodes: 'br', // Restrict to Brazil
                        viewbox: viewbox, // Prioritize Campo Grande area (not bounded)
                    }),
                    {
                        headers: {
                            'Accept-Language': 'pt-BR',
                        }
                    }
                );

                const data: NominatimResult[] = await response.json();
                setSuggestions(data);
                setShowSuggestions(true);
            } catch (error) {
                console.error('Geocoding error:', error);
                setSuggestions([]);
            } finally {
                setIsLoading(false);
            }
        }, 500),
        []
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        searchAddress(value);
    };

    const handleSelectSuggestion = (suggestion: NominatimResult) => {
        setInputValue(suggestion.display_name);
        setSuggestions([]);
        setShowSuggestions(false);
        onAddressSelect(
            suggestion.display_name,
            parseFloat(suggestion.lat),
            parseFloat(suggestion.lon)
        );
    };

    return (
        <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search size={18} />
            </div>
            <input
                type="text"
                placeholder="Digite seu endereço para encontrar a célula mais próxima..."
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent transition-all"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            />

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-black/95 border border-white/20 rounded-lg shadow-2xl max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion) => (
                        <button
                            key={suggestion.place_id}
                            onClick={() => handleSelectSuggestion(suggestion)}
                            className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/5 last:border-b-0"
                        >
                            <p className="text-sm text-white">{suggestion.display_name}</p>
                        </button>
                    ))}
                </div>
            )}

            {isLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="animate-spin h-4 w-4 border-2 border-neon-blue border-t-transparent rounded-full"></div>
                </div>
            )}
        </div>
    );
}
