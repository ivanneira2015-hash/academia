import { Request, Response } from 'express';
import { AddItemToCartUseCase, RemoveItemFromCartUseCase, ViewCartUseCase, AddItemToCartInput, RemoveItemFromCartInput } from '@ecommerce/domain';

export class CartController {
  constructor(
    private addItemToCartUseCase: AddItemToCartUseCase,
    private removeItemFromCartUseCase: RemoveItemFromCartUseCase,
    private viewCartUseCase: ViewCartUseCase
  ) {}

  async addItem(req: Request, res: Response): Promise<void> {
    try {
      const input: AddItemToCartInput = {
        userId: req.userId!,
        ...req.body
      };
      const output = await this.addItemToCartUseCase.execute(input);
      res.status(200).json(output);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async removeItem(req: Request, res: Response): Promise<void> {
    try {
      const input: RemoveItemFromCartInput = {
        userId: req.userId!,
        productId: req.params.productId
      };
      const output = await this.removeItemFromCartUseCase.execute(input);
      res.status(200).json(output);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async view(req: Request, res: Response): Promise<void> {
    try {
      const output = await this.viewCartUseCase.execute(req.userId!);
      res.status(200).json(output);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
