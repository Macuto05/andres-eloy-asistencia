import { Matricula } from '../entities/Matricula';

export interface MatriculaRepository {
    saveAll(matriculas: Matricula[]): Promise<void>;
    getAll(): Promise<Matricula[]>;
}
