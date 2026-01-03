import { prisma } from '../../lib/prisma';
import { MatriculaRepository } from '../../domain/repositories/MatriculaRepository';
import { Matricula } from '../../domain/entities/Matricula';

export class PrismaMatriculaRepository implements MatriculaRepository {

    async saveAll(matriculas: Matricula[]): Promise<void> {

        // 1. Get current state from DB
        const currentRecords = await prisma.matriculaConfig.findMany();

        // 2. Identify records to DELETE 
        // (Present in DB but NOT in incoming list based on unique business key: Nivel + Grado)
        const incomingKeys = new Set(matriculas.map(m => `${m.nivel}-${m.grado}`));
        const toDelete = currentRecords.filter(r => !incomingKeys.has(`${r.nivel}-${r.grado}`));

        if (toDelete.length > 0) {
            await prisma.matriculaConfig.deleteMany({
                where: {
                    id: { in: toDelete.map(r => r.id) }
                }
            });
        }

        // 3. Loop through incoming to CREATE or UPDATE
        for (const m of matriculas) {
            const existingRecord = currentRecords.find(r => r.nivel === m.nivel && r.grado === m.grado);

            if (existingRecord) {
                // UPDATE
                await prisma.matriculaConfig.update({
                    where: { id: existingRecord.id },
                    data: {
                        cantidadSecciones: m.secciones,
                        cantidadVarones: m.varones,
                        cantidadHembras: m.hembras
                    }
                });
            } else {
                // CREATE
                await prisma.matriculaConfig.create({
                    data: {
                        nivel: m.nivel,
                        grado: m.grado,
                        cantidadSecciones: m.secciones,
                        cantidadVarones: m.varones,
                        cantidadHembras: m.hembras
                    }
                });
            }
        }
    }

    async getAll(): Promise<Matricula[]> {
        const records = await prisma.matriculaConfig.findMany({
            orderBy: { id: 'asc' }
        });

        return records.map(r => ({
            id: r.id,
            nivel: r.nivel,
            grado: r.grado,
            secciones: r.cantidadSecciones,
            varones: r.cantidadVarones,
            hembras: r.cantidadHembras
        }));
    }
}
