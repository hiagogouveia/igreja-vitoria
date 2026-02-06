'use client'

import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { CavData } from '@/app/actions/cav-actions'

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface CavMapProps {
    cavs: (CavData & { id: string })[]
    selectedCavId?: string | null
    onSelectCav: (cav: CavData & { id: string }) => void
}

const CAMPO_GRANDE_CENTER: [number, number] = [-20.4697, -54.6201]

// Custom marker icons
const defaultIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})

const selectedIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})

// Component to handle map centering
function MapController({ selectedCavId, cavs }: { selectedCavId: string | null, cavs: (CavData & { id: string })[] }) {
    const map = useMap()

    useEffect(() => {
        if (selectedCavId) {
            const selectedCav = cavs.find(c => c.id === selectedCavId)
            if (selectedCav && selectedCav.latitude && selectedCav.longitude) {
                map.flyTo([selectedCav.latitude, selectedCav.longitude], 15, {
                    duration: 1.5
                })
            }
        }
    }, [selectedCavId, cavs, map])

    return null
}

export default function CavMap({ cavs, selectedCavId, onSelectCav }: CavMapProps) {
    return (
        <div className="w-full h-full min-h-[500px] rounded-xl overflow-hidden shadow-2xl">
            <MapContainer
                center={CAMPO_GRANDE_CENTER}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController selectedCavId={selectedCavId} cavs={cavs} />

                {cavs.map((cav) => (
                    cav.latitude && cav.longitude && (
                        <Marker
                            key={cav.id}
                            position={[cav.latitude, cav.longitude]}
                            icon={selectedCavId === cav.id ? selectedIcon : defaultIcon}
                            eventHandlers={{
                                click: () => onSelectCav(cav)
                            }}
                        >
                            <Popup>
                                <div className="text-sm">
                                    <h3 className="font-bold text-base mb-1">{cav.name}</h3>
                                    <p className="text-gray-600">{cav.dayOfWeek} às {cav.time}</p>
                                    {cav.leaderName && (
                                        <p className="text-gray-600">Líder: {cav.leaderName}</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">{cav.address}</p>
                                </div>
                            </Popup>
                        </Marker>
                    )
                ))}
            </MapContainer>
        </div>
    )
}
