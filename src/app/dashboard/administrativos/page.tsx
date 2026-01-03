import { prisma } from '@/lib/prisma'
import AdministrativosClient from './administrativos-client'

export default async function AdministrativosPage() {
    // 1. Fetch Personal Config for 'Administrativo'
    const personalData = await prisma.personalConfig.findMany({
        where: { tipo: 'Administrativo' },
        orderBy: { id: 'asc' }
    })

    // 2. Fetch Dias Habiles
    const diasHabiles = await prisma.diasHabiles.findMany()

    // 3. Fetch Registros Mensuales (Historia de Asistencia)
    const registros = await prisma.registroMensual.findMany({
        where: { tipoPersonal: 'Administrativo' }
    })

    return (
        <AdministrativosClient
            personalData={personalData}
            diasHabiles={diasHabiles}
            registros={registros}
        />
    )
}
