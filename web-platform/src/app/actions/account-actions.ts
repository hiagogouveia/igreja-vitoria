'use server'

import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'

export async function changePassword(currentPassword: string, newPassword: string) {
    const session = await auth()
    if (!session?.user?.email) {
        return { success: false, error: 'Não autenticado' }
    }

    if (!newPassword || newPassword.length < 8) {
        return { success: false, error: 'A nova senha deve ter pelo menos 8 caracteres' }
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user || !user.password) {
        return { success: false, error: 'Usuário não encontrado' }
    }

    const matches = await bcrypt.compare(currentPassword, user.password)
    if (!matches) {
        return { success: false, error: 'Senha atual incorreta' }
    }

    const hashed = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashed },
    })

    return { success: true }
}
