import { Product } from '../entities/Product';

export interface IProductRepository {
  create(product: Product): Promise<void>;
  findById(id: string): Promise<Product | null>;
  update(product: Product): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Product[]>;
  search(query: string): Promise<Product[]>;
}
