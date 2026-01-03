import { UserRepository } from '../../../domain/repositories/UserRepository';
import { User } from '../../../domain/entities/User';

export class UpdateUserProfile {
    constructor(private userRepository: UserRepository) { }

    async execute(username: string, data: Partial<User>): Promise<void> {
        // Aquí podríamos agregar validaciones de negocio adicionales
        // Por ejemplo: validar formato de nombre, longitud, etc.

        if (!data.nombre) {
            throw new Error("El nombre no puede estar vacío (Validación de Dominio)");
        }

        await this.userRepository.update(username, data);
    }
}
