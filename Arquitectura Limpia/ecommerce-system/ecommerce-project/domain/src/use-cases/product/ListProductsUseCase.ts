import { IProductRepository } from '../../repositories/IProductRepository';

export interface ListProductsOutput {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export class ListProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(): Promise<ListProductsOutput[]> {
    const products = await this.productRepository.findAll();
    
    return products.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock
    }));
  }
}
