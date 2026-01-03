import { DiasHabiles } from '../../../domain/entities/DiasHabiles';
import { DiasHabilesRepository } from '../../../domain/repositories/DiasHabilesRepository';

export class SaveDiasHabiles {
    constructor(private diasRepository: DiasHabilesRepository) { }

    async execute(diasList: DiasHabiles[]): Promise<void> {
        await this.diasRepository.saveAll(diasList);
    }
}
