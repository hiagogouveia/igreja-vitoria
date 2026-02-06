'use client'

import React from 'react'
import { APIProvider } from '@vis.gl/react-google-maps'
import { AlertCircle } from 'lucide-react'

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ''

export function GoogleMapsProvider({ children }: { children: React.ReactNode }) {
    // Check if API key is missing or is a placeholder
    if (!API_KEY || API_KEY.includes('PLACEHOLDER') || API_KEY.length < 30) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <div className="max-w-2xl bg-red-500/10 border border-red-500/50 rounded-xl p-8">
                    <div className="flex items-start gap-4">
                        <AlertCircle className="text-red-500 shrink-0" size={32} />
                        <div>
                            <h2 className="text-2xl font-bold text-red-500 mb-4">
                                Google Maps API Key Necessária
                            </h2>
                            <p className="text-gray-300 mb-4">
                                Para usar o localizador de células, você precisa configurar uma chave válida da Google Maps API.
                            </p>
                            <div className="bg-black/50 rounded-lg p-4 mb-4">
                                <p className="text-sm text-gray-400 mb-2">Adicione no arquivo <code className="text-neon-blue">.env</code>:</p>
                                <code className="text-green-400 text-sm">
                                    NEXT_PUBLIC_GOOGLE_MAPS_KEY=sua_chave_aqui
                                </code>
                            </div>
                            <div className="text-sm text-gray-400">
                                <p className="mb-2">📝 Como obter uma chave:</p>
                                <ol className="list-decimal list-inside space-y-1 ml-2">
                                    <li>Acesse <a href="https://console.cloud.google.com/google/maps-apis" target="_blank" className="text-neon-blue underline">Google Cloud Console</a></li>
                                    <li>Crie um projeto ou selecione um existente</li>
                                    <li>Ative as APIs: Maps JavaScript API, Places API, Geocoding API</li>
                                    <li>Crie uma credencial (API Key)</li>
                                    <li>Copie a chave e adicione no .env</li>
                                    <li>Reinicie o servidor de desenvolvimento</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <APIProvider apiKey={API_KEY} libraries={['places', 'geometry']}>
            {children}
        </APIProvider>
    )
}
