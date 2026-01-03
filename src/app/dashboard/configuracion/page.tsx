import { GetUser } from '@/application/use-cases/user/GetUser'
import { GetMatriculaConfiguration } from '@/application/use-cases/matricula/GetMatriculaConfiguration'
import { GetPersonalConfiguration } from '@/application/use-cases/personal/GetPersonalConfiguration'
import { GetDiasHabiles } from '@/application/use-cases/dias-habiles/GetDiasHabiles'
import { PrismaUserRepository } from '@/infrastructure/repositories/PrismaUserRepository'
import { PrismaMatriculaRepository } from '@/infrastructure/repositories/PrismaMatriculaRepository'
import { PrismaPersonalRepository } from '@/infrastructure/repositories/PrismaPersonalRepository'
import { PrismaDiasHabilesRepository } from '@/infrastructure/repositories/PrismaDiasHabilesRepository'
import ConfiguracionClient from './configuracion-client'

// Lista por defecto (Clean Architecture: Podría estar en una constante de dominio)
const defaultMonths = [
    { mes: 'Septiembre', cantidad: 20 }, { mes: 'Octubre', cantidad: 21 }, { mes: 'Noviembre', cantidad: 21 },
    { mes: 'Diciembre', cantidad: 15 }, { mes: 'Enero', cantidad: 16 }, { mes: 'Febrero', cantidad: 20 },
    { mes: 'Marzo', cantidad: 19 }, { mes: 'Abril', cantidad: 17 }, { mes: 'Mayo', cantidad: 21 },
    { mes: 'Junio', cantidad: 20 }, { mes: 'Julio', cantidad: 16 },
];

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// ... existing imports

// Server Component (Async)
export default async function ConfiguracionPage() {

    // 1. Obtener User profile
    const cookieStore = await cookies()
    const username = cookieStore.get('auth_user')?.value

    if (!username) {
        redirect('/login')
    }

    const userRepo = new PrismaUserRepository()
    const getUser = new GetUser(userRepo)
    const user = await getUser.execute(username)

    // 2. Obtener config Matrícula
    const matriculaRepo = new PrismaMatriculaRepository()
    const getMatricula = new GetMatriculaConfiguration(matriculaRepo)
    const matricula = await getMatricula.execute()

    // 3. Obtener config Personal
    const personalRepo = new PrismaPersonalRepository()
    const getPersonal = new GetPersonalConfiguration(personalRepo)
    const personal = await getPersonal.execute()

    // 4. Obtener config Días Hábiles
    const diasRepo = new PrismaDiasHabilesRepository()
    const getDias = new GetDiasHabiles(diasRepo)
    let diasHabiles = await getDias.execute()

    // Si no hay datos (primera vez), usar defaults
    if (diasHabiles.length === 0) {
        diasHabiles = defaultMonths;
    } else {
        // Ordenar según el orden escolar (Sept -> Julio)
        const order = defaultMonths.map(m => m.mes);
        diasHabiles.sort((a, b) => order.indexOf(a.mes) - order.indexOf(b.mes));
    }

    return (
        <ConfiguracionClient
            user={user}
            initialMatricula={matricula}
            initialPersonal={personal}
            initialDiasHabiles={diasHabiles} // Pasar props
        />
    )
}
