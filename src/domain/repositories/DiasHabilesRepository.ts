import { DiasHabiles } from '../entities/DiasHabiles';

export interface DiasHabilesRepository {
    saveAll(diasList: DiasHabiles[]): Promise<void>;
    getAll(): Promise<DiasHabiles[]>;
}
