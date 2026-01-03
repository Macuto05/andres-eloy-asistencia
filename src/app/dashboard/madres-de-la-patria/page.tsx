import { prisma } from '@/lib/prisma'
import MadresClient from './madres-client'

export default async function MadresPage() {
    // 1. Fetch Personal Config for 'Madre de la patria'
    const personalData = await prisma.personalConfig.findMany({
        where: { tipo: 'Madre de la patria' },
        orderBy: { id: 'asc' }
    })

    // 2. Fetch Dias Habiles
    const diasHabiles = await prisma.diasHabiles.findMany()

    // 3. Fetch Registros Mensuales (Historia de Asistencia)
    // Cyclical design, no Year filter
    const registros = await prisma.registroMensual.findMany({
        where: { tipoPersonal: 'Madre de la patria' }
    })

    return (
        <MadresClient
            personalData={personalData}
            diasHabiles={diasHabiles}
            registros={registros}
        />
    )
}
