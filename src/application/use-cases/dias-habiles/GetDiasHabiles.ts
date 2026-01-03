import { DiasHabiles } from '../../../domain/entities/DiasHabiles';
import { DiasHabilesRepository } from '../../../domain/repositories/DiasHabilesRepository';

export class GetDiasHabiles {
    constructor(private diasRepository: DiasHabilesRepository) { }

    async execute(): Promise<DiasHabiles[]> {
        return await this.diasRepository.getAll();
    }
}
