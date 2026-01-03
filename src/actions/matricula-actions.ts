'use server'

import { revalidatePath } from 'next/cache'
import { PrismaMatriculaRepository } from '../infrastructure/repositories/PrismaMatriculaRepository'
import { SaveMatriculaConfiguration } from '../application/use-cases/matricula/SaveMatriculaConfiguration'
import { Matricula } from '../domain/entities/Matricula'

export async function saveMatriculaAction(data: Matricula[]) {
    const repository = new PrismaMatriculaRepository();
    const useCase = new SaveMatriculaConfiguration(repository);

    try {
        await useCase.execute(data);
        revalidatePath('/dashboard/configuracion');
        return { success: true, message: 'Configuración de matrícula guardada correctamente' };
    } catch (error: any) {
        console.error('Error saving matricula:', error);
        return { success: false, message: error.message || 'Error al guardar la matrícula' };
    }
}
