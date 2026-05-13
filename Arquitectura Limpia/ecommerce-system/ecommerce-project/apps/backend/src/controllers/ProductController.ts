import { Request, Response } from 'express';
import { CreateProductUseCase, ListProductsUseCase, UpdateProductUseCase, CreateProductInput, UpdateProductInput, UserRole } from '@ecommerce/domain';

export class ProductController {
  constructor(
    private createProductUseCase: CreateProductUseCase,
    private listProductsUseCase: ListProductsUseCase,
    private updateProductUseCase: UpdateProductUseCase
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      if (req.userRole !== UserRole.ADMIN) {
        res.status(403).json({ error: 'Only admins can create products' });
        return;
      }

      const input: CreateProductInput = req.body;
      const output = await this.createProductUseCase.execute(input);
      res.status(201).json(output);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const output = await this.listProductsUseCase.execute();
      res.status(200).json(output);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      if (req.userRole !== UserRole.ADMIN) {
        res.status(403).json({ error: 'Only admins can update products' });
        return;
      }

      const input: UpdateProductInput = {
        id: req.params.id,
        ...req.body
      };
      const output = await this.updateProductUseCase.execute(input);
      res.status(200).json(output);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
