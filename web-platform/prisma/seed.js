const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
    // Admin User
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@igrejavitoria.com' },
        update: {},
        create: {
            email: 'admin@igrejavitoria.com',
            name: 'Admin',
            password: hashedPassword,
            role: 'ADMIN',
        },
    })
    console.log('Admin user created:', admin.email)

    // Ministries
    const ministries = [
        {
            name: "Vitória Kids",
            slug: "kids",
            iconName: "Baby",
            imageUrl: "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?q=80&w=2669&auto=format&fit=crop",
            description: "Ministério infantil focado em ensinar a palavra de Deus de forma divertida."
        },
        {
            name: "Louvor",
            slug: "louvor",
            iconName: "Music",
            imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2670&auto=format&fit=crop",
            description: "Equipe responsável pela adoração e música nos cultos."
        },
        {
            name: "Mídia",
            slug: "midia",
            iconName: "Video",
            imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1080&auto=format&fit=crop",
            description: "Responsáveis pela transmissão, fotografia e projeção."
        },
        {
            name: "Recepção",
            slug: "recepcao",
            iconName: "Coffee",
            imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1080&auto=format&fit=crop",
            description: "Acolhimento e boas-vindas a todos que chegam."
        },
        {
            name: "Intercessão",
            slug: "intercessao",
            iconName: "HeartHandshake",
            imageUrl: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1080&auto=format&fit=crop",
            description: "Grupo de oração e suporte espiritual."
        }
    ]

    for (const min of ministries) {
        await prisma.ministry.upsert({
            where: { slug: min.slug },
            update: {},
            create: min,
        })
    }

    // CAVs
    const cavs = [
        {
            name: "CAV Bairro Universitário",
            address: "Rua Elesbão Murtinho, 250",
            neighborhood: "Bairro Universitário",
            dayOfWeek: "Sexta",
            time: "19:30",
            active: true,
        }
    ]

    for (const cav of cavs) {
        // Check if exists nicely
        const count = await prisma.cav.count({ where: { name: cav.name } })
        if (count === 0) {
            await prisma.cav.create({ data: cav })
        }
    }

    console.log('Seed finished successfully')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
