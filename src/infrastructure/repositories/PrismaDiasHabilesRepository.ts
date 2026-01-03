import { PrismaClient } from '@prisma/client';
import { DiasHabilesRepository } from '../../domain/repositories/DiasHabilesRepository';
import { DiasHabiles } from '../../domain/entities/DiasHabiles';

const prisma = new PrismaClient();

export class PrismaDiasHabilesRepository implements DiasHabilesRepository {

    async saveAll(diasList: DiasHabiles[]): Promise<void> {
        // Usamos transaction para recorrer la lista y hacer upsert (crear o actualizar si existe el mes)
        const operations = diasList.map(d =>
            prisma.diasHabiles.upsert({
                where: { mes: d.mes },
                update: { cantidad: d.cantidad },
                create: { mes: d.mes, cantidad: d.cantidad }
            })
        );

        await prisma.$transaction(operations);
    }

    async getAll(): Promise<DiasHabiles[]> {
        const records = await prisma.diasHabiles.findMany({
            // El orden por defecto podría no ser el cronológico escolar (Sept -> Julio),
            // pero lo manejaremos en la UI o aquí si fuera necesario mapear a índices.
            // Por ahora lo devolvemos tal cual.
        });

        return records.map(r => ({
            id: r.id,
            mes: r.mes,
            cantidad: r.cantidad
        }));
    }
}
