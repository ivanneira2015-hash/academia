import { Order, IOrderRepository } from '@ecommerce/domain';
import { Database } from '../database/Database';

export class InMemoryOrderRepository implements IOrderRepository {
  constructor(private db: Database) {}

  async create(order: Order): Promise<void> {
    this.db.getOrders().set(order.id, order);
  }

  async findById(id: string): Promise<Order | null> {
    return this.db.getOrders().get(id) || null;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const result: Order[] = [];
    for (const order of this.db.getOrders().values()) {
      if (order.userId === userId) {
        result.push(order);
      }
    }
    return result;
  }

  async update(order: Order): Promise<void> {
    this.db.getOrders().set(order.id, order);
  }

  async delete(id: string): Promise<void> {
    this.db.getOrders().delete(id);
  }

  async findAll(): Promise<Order[]> {
    return Array.from(this.db.getOrders().values());
  }
}
