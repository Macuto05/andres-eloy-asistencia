'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { PrismaUserRepository } from '../infrastructure/repositories/PrismaUserRepository'
import { UpdateUserProfile } from '../application/use-cases/user/UpdateUserProfile'

export async function updateUserProfile(formData: FormData) {
    const nombre = formData.get('nombre') as string

    // Instanciamos las dependencias (Inyección de Dependencias manual)
    const userRepository = new PrismaUserRepository();
    const updateUserProfileUseCase = new UpdateUserProfile(userRepository);

    try {
        const cookieStore = await cookies()
        const targetUsername = cookieStore.get('auth_user')?.value

        if (!targetUsername) {
            return { success: false, message: 'Usuario no autenticado' }
        }

        // Ejecutamos el caso de uso
        await updateUserProfileUseCase.execute(targetUsername, { nombre });

        revalidatePath('/dashboard')

        return { success: true, message: 'Perfil actualizado correctamente' }
    } catch (error: any) {
        console.error('Error actualizando perfil:', error)
        return { success: false, message: error.message || 'Error al actualizar el perfil' }
    }
}
