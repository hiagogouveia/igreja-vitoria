'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// Define types for CAV creation/update to ensure type safety
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

export async function getCavs() {
    try {
        const cavs = await prisma.cav.findMany({
            where: { active: true },
            orderBy: { name: 'asc' },
        })
        return { success: true, data: cavs }
    } catch (error) {
        console.error('Error fetching CAVs:', error)
        return { success: false, error: 'Failed to fetch CAVs' }
    }
}

export async function createCav(data: CavData) {
    try {
        const cav = await prisma.cav.create({
            data: {
                ...data,
                city: data.city || 'Campo Grande',
                state: data.state || 'MS',
                active: true,
            },
        })
        revalidatePath('/cav-enderecos')
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
        revalidatePath('/cav-enderecos')
        return { success: true, data: cav }
    } catch (error) {
        console.error('Error updating CAV:', error)
        return { success: false, error: 'Failed to update CAV' }
    }
}

export async function deleteCav(id: string) {
    try {
        // Soft delete usually per requirement, but schema has active boolean.
        // Let's toggle active to false instead of hard delete for safety
        const cav = await prisma.cav.update({
            where: { id },
            data: { active: false },
        })
        revalidatePath('/cav-enderecos')
        return { success: true, data: cav }
    } catch (error) {
        console.error('Error deleting CAV:', error)
        return { success: false, error: 'Failed to delete CAV' }
    }
}
