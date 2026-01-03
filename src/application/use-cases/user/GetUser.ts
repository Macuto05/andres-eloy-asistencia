import { UserRepository } from '../../../domain/repositories/UserRepository';
import { User } from '../../../domain/entities/User';

export class GetUser {
    constructor(private userRepository: UserRepository) { }

    async execute(username: string): Promise<User | null> {
        return await this.userRepository.getByUsername(username);
    }
}
