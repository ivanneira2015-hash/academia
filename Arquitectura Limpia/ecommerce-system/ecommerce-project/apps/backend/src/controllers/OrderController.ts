import { Request, Response } from 'express';
import { CreateOrderFromCartUseCase, ListOrdersUseCase, CreateOrderFromCartInput } from '@ecommerce/domain';

export class OrderController {
  constructor(
    private createOrderFromCartUseCase: CreateOrderFromCartUseCase,
    private listOrdersUseCase: ListOrdersUseCase
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const input: CreateOrderFromCartInput = {
        userId: req.userId!
      };
      const output = await this.createOrderFromCartUseCase.execute(input);
      res.status(201).json(output);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async listMyOrders(req: Request, res: Response): Promise<void> {
    try {
      const output = await this.listOrdersUseCase.execute(req.userId!);
      res.status(200).json(output);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async listAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const output = await this.listOrdersUseCase.execute();
      res.status(200).json(output);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
