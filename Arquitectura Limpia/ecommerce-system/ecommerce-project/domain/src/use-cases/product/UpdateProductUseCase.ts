import { IProductRepository } from '../../repositories/IProductRepository';
import { NotFoundError } from '../../errors/DomainError';

export interface UpdateProductInput {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
}

export interface UpdateProductOutput {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export class UpdateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(input: UpdateProductInput): Promise<UpdateProductOutput> {
    const product = await this.productRepository.findById(input.id);
    if (!product) {
      throw new NotFoundError('Product', input.id);
    }

    if (input.name) product.name = input.name;
    if (input.description) product.description = input.description;
    if (input.price !== undefined) product.price = input.price;
    if (input.stock !== undefined) product.stock = input.stock;

    await this.productRepository.update(product);

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock
    };
  }
}
