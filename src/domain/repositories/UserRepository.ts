import { User } from '../entities/User';

export interface UserRepository {
    getByUsername(username: string): Promise<User | null>;
    update(username: string, data: Partial<User>): Promise<void>;
}
