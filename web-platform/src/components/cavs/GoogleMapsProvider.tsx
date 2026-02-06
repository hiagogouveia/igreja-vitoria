'use client'

import React from 'react'
import { APIProvider } from '@vis.gl/react-google-maps'

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || 'AIzaSy_PLACEHOLDER_KEY_FOR_DEMO'

export function GoogleMapsProvider({ children }: { children: React.ReactNode }) {
    if (API_KEY === 'AIzaSy_PLACEHOLDER_KEY_FOR_DEMO') {
        console.warn('Google Maps API Key is missing. Using placeholder.')
    }

    return (
        <APIProvider apiKey={API_KEY} libraries={['places', 'geometry']}>
            {children}
        </APIProvider>
    )
}
