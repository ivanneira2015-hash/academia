import { Product } from '../../entities/Product';
import { IProductRepository } from '../../repositories/IProductRepository';

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface CreateProductOutput {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export class CreateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(input: CreateProductInput): Promise<CreateProductOutput> {
    const product = new Product(
      this.generateId(),
      input.name,
      input.description,
      input.price,
      input.stock
    );

    await this.productRepository.create(product);

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
