'use server'

import { revalidatePath } from 'next/cache'
import { PrismaDiasHabilesRepository } from '../infrastructure/repositories/PrismaDiasHabilesRepository'
import { SaveDiasHabiles } from '../application/use-cases/dias-habiles/SaveDiasHabiles'
import { DiasHabiles } from '../domain/entities/DiasHabiles'

export async function saveDiasHabilesAction(data: DiasHabiles[]) {
    const repository = new PrismaDiasHabilesRepository()
    const useCase = new SaveDiasHabiles(repository)

    try {
        await useCase.execute(data)
        revalidatePath('/dashboard/configuracion')
        return { success: true, message: 'Días hábiles guardados correctamente' }
    } catch (error) {
        console.error('Error saving dias habiles:', error)
        return { success: false, message: 'Error al guardar configuración' }
    }
}
