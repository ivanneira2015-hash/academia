import { IUser, UserRole } from '../types';
import { ValidationError } from '../errors/DomainError';

export class User implements IUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  createdAt: Date;

  constructor(
    id: string,
    email: string,
    password: string,
    name: string,
    role: UserRole,
    createdAt: Date = new Date()
  ) {
    this.validateEmail(email);
    this.validateName(name);
    this.validatePassword(password);

    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
    this.role = role;
    this.createdAt = createdAt;
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('Invalid email format');
    }
  }

  private validateName(name: string): void {
    if (name.trim().length < 2) {
      throw new ValidationError('Name must be at least 2 characters long');
    }
  }

  private validatePassword(password: string): void {
    if (password.length < 6) {
      throw new ValidationError('Password must be at least 6 characters long');
    }
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  isClient(): boolean {
    return this.role === UserRole.CLIENT;
  }
}
