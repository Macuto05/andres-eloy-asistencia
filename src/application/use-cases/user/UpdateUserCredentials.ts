import { UserRepository } from '../../../domain/repositories/UserRepository';

interface ExecuteParams {
    currentUsername: string;
    newUsername: string;
    newPassword?: string;
    confirmPassword?: string;
}

export class UpdateUserCredentials {
    constructor(private userRepository: UserRepository) { }

    async execute({ currentUsername, newUsername, newPassword, confirmPassword }: ExecuteParams): Promise<void> {
        // 1. Validar que si se envía contraseña, coincida con la confirmación
        if (newPassword && newPassword !== confirmPassword) {
            throw new Error("Las contraseñas no coinciden");
        }

        // 2. Preparar objeto de actualización
        const dataToUpdate: any = { username: newUsername };

        // Solo actualizar contraseña si el usuario escribió algo
        if (newPassword && newPassword.trim() !== '') {
            dataToUpdate.password = newPassword;
        }

        // 3. Ejecutar actualización
        // Nota: Si cambia el username, el 'currentUsername' ya no será válido para futuras queries hasta refrescar sesión
        await this.userRepository.update(currentUsername, dataToUpdate);
    }
}
