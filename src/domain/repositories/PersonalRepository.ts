import { Personal } from '../entities/Personal';

export interface PersonalRepository {
    saveAll(personal: Personal[]): Promise<void>;
    getAll(): Promise<Personal[]>;
}
