'use server'

import { revalidatePath } from 'next/cache'
import { PrismaPersonalRepository } from '../infrastructure/repositories/PrismaPersonalRepository'
import { SavePersonalConfiguration } from '../application/use-cases/personal/SavePersonalConfiguration'
import { Personal } from '../domain/entities/Personal'

export async function savePersonalAction(data: Personal[]) {
    const repository = new PrismaPersonalRepository();
    const useCase = new SavePersonalConfiguration(repository);

    try {
        await useCase.execute(data);
        revalidatePath('/dashboard/configuracion');
        return { success: true, message: 'Configuración de personal guardada correctamente' };
    } catch (error: any) {
        console.error('Error saving personal:', error);
        return { success: false, message: error.message || 'Error al guardar el personal' };
    }
}
