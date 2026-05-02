/* eslint-disable */
/**
 * Sync CAVs - sincroniza a tabela `Cav` com a lista oficial.
 *
 * Uso:
 *   node prisma/sync-cavs.js              # ativa as 8 oficiais e desativa as demais
 *   node prisma/sync-cavs.js --hard       # remove (DELETE) as CAVs que não estão na lista
 *
 * Geocoding via Nominatim (OpenStreetMap). Respeita rate-limit de 1 req/s.
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const HARD = process.argv.includes('--hard')

const CAVS = [
    {
        name: 'CAV Centro',
        leaderName: 'Thiago / Karla',
        address: 'Rua dos Ferroviários, 412, Campo Grande, MS',
        neighborhood: 'Centro',
        dayOfWeek: 'Terça',
        time: '19:30',
    },
    {
        name: 'CAV Rita Vieira',
        leaderName: 'Pr. Hiago & Isa',
        address: 'Rua Antônio Alves, 406, Rita Vieira, Campo Grande, MS',
        neighborhood: 'Rita Vieira',
        dayOfWeek: 'Sexta',
        time: '19:30',
    },
    {
        name: 'CAV Coophafe',
        leaderName: 'Ev. Amândio / Otávio',
        address: 'Rua Neuza Vargas de Alencar, 332, Campo Grande, MS',
        neighborhood: 'Coophafe',
        dayOfWeek: 'Terça',
        time: '19:00',
    },
    {
        name: 'CAV Winners',
        leaderName: 'Pr. Eriel & Júlia',
        address: 'Rua Ipitanga, 204, Novos Estados, Campo Grande, MS',
        neighborhood: 'Novos Estados',
        dayOfWeek: 'Terça',
        time: '19:00',
    },
    {
        name: 'CAV Sírio Libanês',
        leaderName: 'Vinicius & Eliene',
        address: 'Rua Fuad Gelelaite, 185, Campo Grande, MS',
        neighborhood: 'Sírio Libanês',
        dayOfWeek: 'Quinta',
        time: '19:30',
    },
    {
        name: 'CAV São J. Lagoa',
        leaderName: 'Mis. Cleyde & Rafaela',
        address: 'Rua Porto Rico, 852, Campo Grande, MS',
        neighborhood: 'São Conrado',
        dayOfWeek: 'Terça',
        time: '19:30',
    },
    {
        name: 'CAV Parati',
        leaderName: 'Stefanny',
        address: 'Rua do Bandolim, 236, Campo Grande, MS',
        neighborhood: 'Parati',
        dayOfWeek: 'Terça',
        time: '19:30',
    },
    {
        name: 'CAV Joquei',
        leaderName: 'Ana / Jhony & Tainara',
        address: 'Rua Carandá, 35, Campo Grande, MS',
        neighborhood: 'Joquei',
        dayOfWeek: 'Sexta',
        time: '19:30',
    },
]

async function geocode(address) {
    const url = 'https://nominatim.openstreetmap.org/search?' + new URLSearchParams({
        q: address,
        format: 'json',
        limit: '1',
        countrycodes: 'br',
    }).toString()

    const res = await fetch(url, {
        headers: {
            'Accept-Language': 'pt-BR',
            'User-Agent': 'igreja-vitoria-cav-sync/1.0 (admin@igrejavitoria.com)',
        },
    })
    if (!res.ok) {
        throw new Error(`Nominatim ${res.status} para "${address}"`)
    }
    const data = await res.json()
    if (!data.length) return null
    return { latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) }
}

async function sleep(ms) {
    return new Promise(r => setTimeout(r, ms))
}

async function main() {
    console.log(`Sincronizando ${CAVS.length} CAVs (modo ${HARD ? 'HARD-DELETE' : 'SOFT (active=false)'})...`)

    const wantedNames = new Set(CAVS.map(c => c.name))

    for (const cav of CAVS) {
        process.stdout.write(`  ↳ ${cav.name}: geocoding... `)
        let coords = null
        try {
            coords = await geocode(cav.address)
            console.log(coords ? `OK (${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)})` : 'sem resultado')
        } catch (e) {
            console.log(`falhou (${e.message})`)
        }

        const existing = await prisma.cav.findFirst({ where: { name: cav.name } })
        const data = {
            name: cav.name,
            leaderName: cav.leaderName,
            address: cav.address,
            neighborhood: cav.neighborhood,
            city: 'Campo Grande',
            state: 'MS',
            dayOfWeek: cav.dayOfWeek,
            time: cav.time,
            active: true,
            ...(coords && { latitude: coords.latitude, longitude: coords.longitude }),
        }

        if (existing) {
            await prisma.cav.update({ where: { id: existing.id }, data })
            console.log(`     atualizada (id=${existing.id})`)
        } else {
            const created = await prisma.cav.create({ data })
            console.log(`     criada (id=${created.id})`)
        }

        // Respeita rate-limit do Nominatim (1 req/s)
        await sleep(1100)
    }

    // Lida com CAVs que não estão na lista
    const others = await prisma.cav.findMany({
        where: { name: { notIn: Array.from(wantedNames) } },
    })

    if (others.length === 0) {
        console.log('\nNenhuma CAV fora da lista oficial.')
    } else {
        console.log(`\n${others.length} CAV(s) fora da lista oficial:`)
        for (const o of others) {
            console.log(`  - ${o.name} (id=${o.id})`)
        }

        if (HARD) {
            await prisma.cav.deleteMany({ where: { id: { in: others.map(o => o.id) } } })
            console.log('  → removidas permanentemente.')
        } else {
            await prisma.cav.updateMany({
                where: { id: { in: others.map(o => o.id) } },
                data: { active: false },
            })
            console.log('  → desativadas (active=false). Use --hard para remover do banco.')
        }
    }

    console.log('\nSync concluído.')
}

main()
    .then(async () => { await prisma.$disconnect() })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
