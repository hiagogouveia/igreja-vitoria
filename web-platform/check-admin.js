const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    const email = 'admin@igrejavitoria.com'
    const password = 'admin123'

    // 1. Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email }
    })

    console.log('Existing User:', existingUser)

    // 2. Force Reset Password
    const hashedPassword = await bcrypt.hash(password, 10)

    const updated = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: 'ADMIN'
        },
        create: {
            email,
            name: 'Admin',
            password: hashedPassword,
            role: 'ADMIN'
        }
    })

    console.log('Admin user upserted/reset successfully:', updated)

    // 3. Verify Hash (Test comparison)
    const isMatch = await bcrypt.compare(password, updated.password)
    console.log('Password comparison check:', isMatch ? 'MATCH' : 'FAIL') // Should be MATCH
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
