import { Product, IProductRepository } from '@ecommerce/domain';
import { Database } from '../database/Database';

export class InMemoryProductRepository implements IProductRepository {
  constructor(private db: Database) {}

  async create(product: Product): Promise<void> {
    this.db.getProducts().set(product.id, product);
  }

  async findById(id: string): Promise<Product | null> {
    return this.db.getProducts().get(id) || null;
  }

  async update(product: Product): Promise<void> {
    this.db.getProducts().set(product.id, product);
  }

  async delete(id: string): Promise<void> {
    this.db.getProducts().delete(id);
  }

  async findAll(): Promise<Product[]> {
    return Array.from(this.db.getProducts().values());
  }

  async search(query: string): Promise<Product[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.db.getProducts().values()).filter(
      p => p.name.toLowerCase().includes(lowerQuery) || 
           p.description.toLowerCase().includes(lowerQuery)
    );
  }
}
