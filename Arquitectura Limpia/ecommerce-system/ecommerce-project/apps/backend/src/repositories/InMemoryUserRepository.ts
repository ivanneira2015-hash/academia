import { User, IUserRepository } from '@ecommerce/domain';
import { Database } from '../database/Database';

export class InMemoryUserRepository implements IUserRepository {
  constructor(private db: Database) {}

  async create(user: User): Promise<void> {
    this.db.getUsers().set(user.id, user);
  }

  async findById(id: string): Promise<User | null> {
    return this.db.getUsers().get(id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.db.getUsers().values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async update(user: User): Promise<void> {
    this.db.getUsers().set(user.id, user);
  }

  async delete(id: string): Promise<void> {
    this.db.getUsers().delete(id);
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.db.getUsers().values());
  }
}
