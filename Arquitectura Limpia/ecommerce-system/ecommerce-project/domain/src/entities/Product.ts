import { IProduct } from '../types';
import { ValidationError } from '../errors/DomainError';

export class Product implements IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    name: string,
    description: string,
    price: number,
    stock: number,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this.validateName(name);
    this.validatePrice(price);
    this.validateStock(stock);

    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  private validateName(name: string): void {
    if (name.trim().length < 3) {
      throw new ValidationError('Product name must be at least 3 characters long');
    }
  }

  private validatePrice(price: number): void {
    if (price <= 0) {
      throw new ValidationError('Product price must be greater than 0');
    }
  }

  private validateStock(stock: number): void {
    if (stock < 0) {
      throw new ValidationError('Product stock cannot be negative');
    }
  }

  hasEnoughStock(quantity: number): boolean {
    return this.stock >= quantity;
  }

  reduceStock(quantity: number): void {
    if (!this.hasEnoughStock(quantity)) {
      throw new ValidationError('Not enough stock');
    }
    this.stock -= quantity;
    this.updatedAt = new Date();
  }

  increaseStock(quantity: number): void {
    if (quantity <= 0) {
      throw new ValidationError('Quantity must be positive');
    }
    this.stock += quantity;
    this.updatedAt = new Date();
  }
}
