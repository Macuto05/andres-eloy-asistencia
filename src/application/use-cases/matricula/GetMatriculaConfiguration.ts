import { MatriculaRepository } from '../../../domain/repositories/MatriculaRepository';
import { Matricula } from '../../../domain/entities/Matricula';

export class GetMatriculaConfiguration {
    constructor(private repository: MatriculaRepository) { }

    async execute(): Promise<Matricula[]> {
        return await this.repository.getAll();
    }
}
