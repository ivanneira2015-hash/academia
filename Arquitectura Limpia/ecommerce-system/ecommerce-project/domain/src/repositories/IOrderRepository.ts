import { Order } from '../entities/Order';

export interface IOrderRepository {
  create(order: Order): Promise<void>;
  findById(id: string): Promise<Order | null>;
  findByUserId(userId: string): Promise<Order[]>;
  update(order: Order): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Order[]>;
}
