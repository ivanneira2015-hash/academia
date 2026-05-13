import { User } from '../../entities/User';
import { UserRole } from '../../types';
import { IUserRepository } from '../../repositories/IUserRepository';
import { IAuthenticationService } from '../../services/AuthenticationService';
import { ConflictError } from '../../errors/DomainError';

export interface RegisterUserInput {
  email: string;
  password: string;
  name: string;
}

export interface RegisterUserOutput {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export class RegisterUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authenticationService: IAuthenticationService
  ) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new ConflictError(`User with email ${input.email} already exists`);
    }

    const hashedPassword = await this.authenticationService.hashPassword(input.password);
    const user = new User(
      this.generateId(),
      input.email,
      hashedPassword,
      input.name,
      UserRole.CLIENT
    );

    await this.userRepository.create(user);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
