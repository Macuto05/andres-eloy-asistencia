'use server'

import { revalidatePath } from 'next/cache'
import { PrismaUserRepository } from '../infrastructure/repositories/PrismaUserRepository'
import { UpdateUserCredentials } from '../application/use-cases/user/UpdateUserCredentials'

export async function updateCredentialsAction(formData: FormData) {
    // Datos del formulario
    const currentUsername = formData.get('currentUsername') as string; // Hidden input para saber a quién actualizar
    const newUsername = formData.get('username') as string;
    const newPassword = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!currentUsername) {
        return { success: false, message: 'Usuario no identificado' };
    }

    const repository = new PrismaUserRepository();
    const useCase = new UpdateUserCredentials(repository);

    try {
        await useCase.execute({
            currentUsername,
            newUsername,
            newPassword,
            confirmPassword
        });

        revalidatePath('/dashboard'); // Para actualizar si cambia el nombre de usuario
        return { success: true, message: 'Credenciales actualizadas correctamente' };
    } catch (error: any) {
        if (error.code === 'P2002') { // Prisma error code for unique constraint
            return { success: false, message: 'El nombre de usuario ya existe' };
        }
        console.error('Error updating credentials:', error);
        return { success: false, message: error.message || 'Error al actualizar credenciales' };
    }
}
