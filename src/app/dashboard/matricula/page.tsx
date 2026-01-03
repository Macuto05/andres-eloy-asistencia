import { prisma } from '@/lib/prisma'
import MatriculaClient from './matricula-client'

export default async function MatriculaPage() {
    // 1. Fetch Matricula Config (Estudiantes)
    const matriculaData = await prisma.matriculaConfig.findMany({
        orderBy: { id: 'asc' } // Usually defined 1er G, 2do G etc. Assuming insertion order is correct or we need a rank.
    })

    // 2. Fetch Dias Habiles
    const diasHabiles = await prisma.diasHabiles.findMany()

    // 3. Fetch Registros Mensuales (Historia de Asistencia)
    const registros = await prisma.registroMensual.findMany({
        where: { tipoPersonal: 'Estudiante' }
    })

    return (
        <MatriculaClient
            matriculaData={matriculaData}
            diasHabiles={diasHabiles}
            registros={registros}
        />
    )
}
