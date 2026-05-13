import { User } from '../entities/User';

export interface IAuthenticationService {
  hashPassword(password: string): Promise<string>;
  verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
  generateToken(user: User): string;
  verifyToken(token: string): any;
}

export class AuthenticationService implements IAuthenticationService {
  async hashPassword(password: string): Promise<string> {
    // En producción, usar bcrypt
    return Buffer.from(password).toString('base64');
  }

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    const hashed = Buffer.from(plainPassword).toString('base64');
    return hashed === hashedPassword;
  }

  generateToken(user: User): string {
    // En producción, usar JWT real
    return Buffer.from(JSON.stringify({
      userId: user.id,
      email: user.email,
      role: user.role,
      iat: Date.now()
    })).toString('base64');
  }

  verifyToken(token: string): any {
    try {
      return JSON.parse(Buffer.from(token, 'base64').toString());
    } catch {
      return null;
    }
  }
}
