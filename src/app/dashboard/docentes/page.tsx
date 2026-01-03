import { prisma } from '@/lib/prisma'
import DocentesClient from './docentes-client'

export default async function DocentesPage() {
    // 1. Fetch Personal Config for 'Docente'
    const personalData = await prisma.personalConfig.findMany({
        where: { tipo: 'Docente' },
        orderBy: { id: 'asc' }
    })

    // 2. Fetch Dias Habiles
    const diasHabiles = await prisma.diasHabiles.findMany()

    // 3. Fetch Registros Mensuales (Historia de Asistencia)
    const registros = await prisma.registroMensual.findMany({
        where: { tipoPersonal: 'Docente' }
    })

    return (
        <DocentesClient
            personalData={personalData}
            diasHabiles={diasHabiles}
            registros={registros}
        />
    )
}
