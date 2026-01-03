import { PrismaClient } from '@prisma/client';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';

const prisma = new PrismaClient();

export class PrismaUserRepository implements UserRepository {

    async getByUsername(username: string): Promise<User | null> {
        const user = await prisma.usuario.findUnique({
            where: { username }
        });

        if (!user) return null;

        return {
            id: user.id,
            username: user.username,
            password: user.password,
            nombre: user.nombre
        };
    }

    async update(username: string, data: Partial<User>): Promise<void> {
        const updateData: any = {};
        if (data.nombre !== undefined) updateData.nombre = data.nombre;
        if (data.username !== undefined) updateData.username = data.username;
        if (data.password !== undefined) updateData.password = data.password;

        await prisma.usuario.update({
            where: { username },
            data: updateData
        });
    }
}
