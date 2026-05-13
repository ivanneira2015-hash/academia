import { IUserRepository } from '../../repositories/IUserRepository';
import { IAuthenticationService } from '../../services/AuthenticationService';
import { UnauthorizedError } from '../../errors/DomainError';
import { UserRole } from '../../types';

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface LoginUserOutput {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}

export class LoginUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authenticationService: IAuthenticationService
  ) {}

  async execute(input: LoginUserInput): Promise<LoginUserOutput> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isPasswordValid = await this.authenticationService.verifyPassword(
      input.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = this.authenticationService.generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  }
}
