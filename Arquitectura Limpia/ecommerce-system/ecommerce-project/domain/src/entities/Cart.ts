import { ICart, ICartItem } from '../types';
import { ValidationError } from '../errors/DomainError';

export class Cart implements ICart {
  id: string;
  userId: string;
  items: ICartItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    userId: string,
    items: ICartItem[] = [],
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this.id = id;
    this.userId = userId;
    this.items = items;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.total = this.calculateTotal();
  }

  private calculateTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  addItem(productId: string, quantity: number, price: number): void {
    this.validateQuantity(quantity);
    this.validatePrice(price);

    const existingItem = this.items.find(item => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ productId, quantity, price });
    }

    this.updatedAt = new Date();
    this.total = this.calculateTotal();
  }

  removeItem(productId: string): void {
    this.items = this.items.filter(item => item.productId !== productId);
    this.updatedAt = new Date();
    this.total = this.calculateTotal();
  }

  updateItemQuantity(productId: string, quantity: number): void {
    this.validateQuantity(quantity);

    const item = this.items.find(item => item.productId === productId);
    if (!item) {
      throw new ValidationError(`Product ${productId} not found in cart`);
    }

    if (quantity === 0) {
      this.removeItem(productId);
    } else {
      item.quantity = quantity;
    }

    this.updatedAt = new Date();
    this.total = this.calculateTotal();
  }

  clear(): void {
    this.items = [];
    this.updatedAt = new Date();
    this.total = 0;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  getItemCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  private validateQuantity(quantity: number): void {
    if (quantity <= 0) {
      throw new ValidationError('Quantity must be greater than 0');
    }
  }

  private validatePrice(price: number): void {
    if (price < 0) {
      throw new ValidationError('Price cannot be negative');
    }
  }
}
