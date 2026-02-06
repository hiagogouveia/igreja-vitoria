'use client'

import React, { useState, useEffect } from 'react'
import { Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps'
import { CavData } from '@/app/actions/cav-actions'

interface CavMapProps {
    cavs: (CavData & { id: string })[]
    selectedCavId?: string | null
    onSelectCav: (cav: CavData & { id: string }) => void
}

const CAMPO_GRANDE_CENTER = { lat: -20.4697, lng: -54.6201 }

export default function CavMap({ cavs, selectedCavId, onSelectCav }: CavMapProps) {
    const map = useMap()
    const [hoveredId, setHoveredId] = useState<string | null>(null)

    // Effect to center map on selected CAV
    useEffect(() => {
        if (selectedCavId && map) {
            const selectedCav = cavs.find(c => c.id === selectedCavId)
            if (selectedCav && selectedCav.latitude && selectedCav.longitude) {
                map.panTo({ lat: selectedCav.latitude, lng: selectedCav.longitude })
                map.setZoom(15)
            }
        }
    }, [selectedCavId, map, cavs])

    return (
        <div className="w-full h-full min-h-[500px] bg-gray-900 rounded-xl overflow-hidden shadow-2xl relative">
            <Map
                mapId={'bf51a910020fa25a'} // Map ID required for Advanced Markers, using a generic one or allowing placeholder
                defaultCenter={CAMPO_GRANDE_CENTER}
                defaultZoom={12}
                gestureHandling={'greedy'}
                disableDefaultUI={false}
                className="w-full h-full"
                options={{
                    styles: [
                        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                        {
                            featureType: "administrative.locality",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#d59563" }],
                        },
                    ]
                }}
            >
                {cavs.map((cav) => (
                    (cav.latitude && cav.longitude) && (
                        <AdvancedMarker
                            key={cav.id}
                            position={{ lat: cav.latitude, lng: cav.longitude }}
                            onClick={() => onSelectCav(cav)}
                            onMouseEnter={() => setHoveredId(cav.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            title={cav.name}
                        >
                            <Pin
                                background={selectedCavId === cav.id ? '#00E5FF' : '#FF0055'}
                                borderColor={'#000'}
                                glyphColor={'#FFF'}
                                scale={selectedCavId === cav.id ? 1.2 : 1}
                            />
                            {/* Tooltip on hover if not selected/showing in sidebar */}
                            {hoveredId === cav.id && (
                                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none">
                                    {cav.name}
                                </div>
                            )}
                        </AdvancedMarker>
                    )
                ))}
            </Map>
        </div>
    )
}
