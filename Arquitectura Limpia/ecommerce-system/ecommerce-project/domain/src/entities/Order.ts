import { IOrder, IOrderItem, OrderStatus } from '../types';
import { ValidationError } from '../errors/DomainError';

export class Order implements IOrder {
  id: string;
  userId: string;
  items: IOrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    userId: string,
    items: IOrderItem[],
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    status: OrderStatus = OrderStatus.PENDING
  ) {
    this.validateItems(items);

    this.id = id;
    this.userId = userId;
    this.items = items;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.total = this.calculateTotal();
  }

  private validateItems(items: IOrderItem[]): void {
    if (items.length === 0) {
      throw new ValidationError('Order must contain at least one item');
    }
  }

  private calculateTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  confirm(): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new ValidationError('Only pending orders can be confirmed');
    }
    this.status = OrderStatus.CONFIRMED;
    this.updatedAt = new Date();
  }

  ship(): void {
    if (this.status !== OrderStatus.CONFIRMED) {
      throw new ValidationError('Only confirmed orders can be shipped');
    }
    this.status = OrderStatus.SHIPPED;
    this.updatedAt = new Date();
  }

  deliver(): void {
    if (this.status !== OrderStatus.SHIPPED) {
      throw new ValidationError('Only shipped orders can be delivered');
    }
    this.status = OrderStatus.DELIVERED;
    this.updatedAt = new Date();
  }

  cancel(): void {
    if (this.status === OrderStatus.DELIVERED || this.status === OrderStatus.CANCELLED) {
      throw new ValidationError('Cannot cancel a delivered or already cancelled order');
    }
    this.status = OrderStatus.CANCELLED;
    this.updatedAt = new Date();
  }

  isPending(): boolean {
    return this.status === OrderStatus.PENDING;
  }

  isConfirmed(): boolean {
    return this.status === OrderStatus.CONFIRMED;
  }

  isShipped(): boolean {
    return this.status === OrderStatus.SHIPPED;
  }

  isDelivered(): boolean {
    return this.status === OrderStatus.DELIVERED;
  }

  isCancelled(): boolean {
    return this.status === OrderStatus.CANCELLED;
  }
}
