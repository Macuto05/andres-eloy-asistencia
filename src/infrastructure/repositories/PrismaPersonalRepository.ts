import { prisma } from '../../lib/prisma';
import { PersonalRepository } from '../../domain/repositories/PersonalRepository';
import { Personal } from '../../domain/entities/Personal';

export class PrismaPersonalRepository implements PersonalRepository {

    async saveAll(personalList: Personal[]): Promise<void> {



        // 1. Get current state
        const currentRecords = await prisma.personalConfig.findMany();

        // 2. Identify records to DELETE (Unique Key: Tipo + Nivel)
        const incomingKeys = new Set(personalList.map(p => `${p.tipo}-${p.nivel}`));
        const toDelete = currentRecords.filter(r => !incomingKeys.has(`${r.tipo}-${r.nivel}`));

        if (toDelete.length > 0) {
            await prisma.personalConfig.deleteMany({
                where: {
                    id: { in: toDelete.map(r => r.id) }
                }
            });
        }

        // 3. CREATE or UPDATE
        for (const p of personalList) {
            const existingRecord = currentRecords.find(r => r.tipo === p.tipo && r.nivel === p.nivel);

            if (existingRecord) {
                // UPDATE
                await prisma.personalConfig.update({
                    where: { id: existingRecord.id },
                    data: {
                        cantidadVarones: p.varones,
                        cantidadHembras: p.hembras
                    }
                });
            } else {
                // CREATE
                await prisma.personalConfig.create({
                    data: {
                        tipo: p.tipo,
                        nivel: p.nivel,
                        cantidadVarones: p.varones,
                        cantidadHembras: p.hembras
                    }
                });
            }
        }
    }

    async getAll(): Promise<Personal[]> {
        const records = await prisma.personalConfig.findMany({
            orderBy: { id: 'asc' }
        });

        return records.map(r => ({
            id: r.id,
            tipo: r.tipo,
            nivel: r.nivel,
            varones: r.cantidadVarones,
            hembras: r.cantidadHembras
        }));
    }
}
