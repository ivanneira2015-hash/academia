import { Cart } from '../entities/Cart';

export interface ICartRepository {
  create(cart: Cart): Promise<void>;
  findById(id: string): Promise<Cart | null>;
  findByUserId(userId: string): Promise<Cart | null>;
  update(cart: Cart): Promise<void>;
  delete(id: string): Promise<void>;
}
