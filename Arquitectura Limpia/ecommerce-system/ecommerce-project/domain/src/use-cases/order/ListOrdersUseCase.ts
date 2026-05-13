import { IOrderRepository } from '../../repositories/IOrderRepository';

export interface OrderOutput {
  id: string;
  userId: string;
  total: number;
  status: string;
  itemCount: number;
}

export class ListOrdersUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(userId?: string): Promise<OrderOutput[]> {
    const orders = userId
      ? await this.orderRepository.findByUserId(userId)
      : await this.orderRepository.findAll();

    return orders.map(o => ({
      id: o.id,
      userId: o.userId,
      total: o.total,
      status: o.status,
      itemCount: o.items.length
    }));
  }
}
