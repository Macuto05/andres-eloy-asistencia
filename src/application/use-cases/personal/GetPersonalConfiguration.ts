import { PersonalRepository } from '../../../domain/repositories/PersonalRepository';
import { Personal } from '../../../domain/entities/Personal';

export class GetPersonalConfiguration {
    constructor(private repository: PersonalRepository) { }

    async execute(): Promise<Personal[]> {
        return await this.repository.getAll();
    }
}
