import { prisma } from '@/lib/prisma'
import ObrerosClient from './obreros-client'

export default async function ObrerosPage() {
    // 1. Fetch Personal Config for 'Obrero'
    const personalData = await prisma.personalConfig.findMany({
        where: { tipo: 'Obrero' },
        orderBy: { id: 'asc' }
    })

    // 2. Fetch Dias Habiles
    const diasHabiles = await prisma.diasHabiles.findMany()

    // 3. Fetch Registros Mensuales (Historia de Asistencia)
    const registros = await prisma.registroMensual.findMany({
        where: { tipoPersonal: 'Obrero' }
    })

    return (
        <ObrerosClient
            personalData={personalData}
            diasHabiles={diasHabiles}
            registros={registros}
        />
    )
}
