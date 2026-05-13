import { Cart, ICartRepository } from '@ecommerce/domain';
import { Database } from '../database/Database';

export class InMemoryCartRepository implements ICartRepository {
  constructor(private db: Database) {}

  async create(cart: Cart): Promise<void> {
    this.db.getCarts().set(cart.id, cart);
  }

  async findById(id: string): Promise<Cart | null> {
    return this.db.getCarts().get(id) || null;
  }

  async findByUserId(userId: string): Promise<Cart | null> {
    for (const cart of this.db.getCarts().values()) {
      if (cart.userId === userId) {
        return cart;
      }
    }
    return null;
  }

  async update(cart: Cart): Promise<void> {
    this.db.getCarts().set(cart.id, cart);
  }

  async delete(id: string): Promise<void> {
    this.db.getCarts().delete(id);
  }
}
