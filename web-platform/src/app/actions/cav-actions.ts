'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export type CavData = {
    name: string
    address: string
    neighborhood?: string | null
    city?: string
    state?: string
    dayOfWeek: string
    time: string
    leaderName?: string | null
    latitude?: number | null
    longitude?: number | null
    active?: boolean
}

function revalidateAll() {
    revalidatePath('/cav-enderecos')
    revalidatePath('/admin/cavs')
}

export async function getCavs() {
    try {
        const cavs = await prisma.cav.findMany({
            where: { active: true },
            orderBy: { name: 'asc' },
        })
        return { success: true, data: cavs }
    } catch (error) {
        console.error('Error fetching CAVs:', error)
        return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
}

export async function getAllCavs() {
    try {
        const cavs = await prisma.cav.findMany({
            orderBy: [{ active: 'desc' }, { name: 'asc' }],
        })
        return { success: true, data: cavs }
    } catch (error) {
        console.error('Error fetching all CAVs:', error)
        return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
}

export async function createCav(data: CavData) {
    try {
        const cav = await prisma.cav.create({
            data: {
                ...data,
                city: data.city || 'Campo Grande',
                state: data.state || 'MS',
                active: data.active ?? true,
            },
        })
        revalidateAll()
        return { success: true, data: cav }
    } catch (error) {
        console.error('Error creating CAV:', error)
        return { success: false, error: 'Failed to create CAV' }
    }
}

export async function updateCav(id: string, data: Partial<CavData>) {
    try {
        const cav = await prisma.cav.update({
            where: { id },
            data,
        })
        revalidateAll()
        return { success: true, data: cav }
    } catch (error) {
        console.error('Error updating CAV:', error)
        return { success: false, error: 'Failed to update CAV' }
    }
}

export async function toggleCavActive(id: string) {
    try {
        const current = await prisma.cav.findUnique({ where: { id } })
        if (!current) return { success: false, error: 'CAV not found' }
        const cav = await prisma.cav.update({
            where: { id },
            data: { active: !current.active },
        })
        revalidateAll()
        return { success: true, data: cav }
    } catch (error) {
        console.error('Error toggling CAV:', error)
        return { success: false, error: 'Failed to toggle CAV' }
    }
}

export async function deleteCav(id: string) {
    try {
        const cav = await prisma.cav.update({
            where: { id },
            data: { active: false },
        })
        revalidateAll()
        return { success: true, data: cav }
    } catch (error) {
        console.error('Error deleting CAV:', error)
        return { success: false, error: 'Failed to deactivate CAV' }
    }
}

export async function hardDeleteCav(id: string) {
    try {
        await prisma.cav.delete({ where: { id } })
        revalidateAll()
        return { success: true }
    } catch (error) {
        console.error('Error hard-deleting CAV:', error)
        return { success: false, error: 'Failed to delete CAV' }
    }
}
