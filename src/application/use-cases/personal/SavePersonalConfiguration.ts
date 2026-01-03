import { PersonalRepository } from '../../../domain/repositories/PersonalRepository';
import { Personal } from '../../../domain/entities/Personal';

export class SavePersonalConfiguration {
    constructor(private repository: PersonalRepository) { }

    async execute(personalList: Personal[]): Promise<void> {
        for (const p of personalList) {
            if (p.varones < 0 || p.hembras < 0) {
                throw new Error(`Los valores no pueden ser negativos para ${p.tipo}`);
            }
        }
        await this.repository.saveAll(personalList);
    }
}
