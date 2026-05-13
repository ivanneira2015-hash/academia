import { Request, Response } from 'express';
import { RegisterUserUseCase, LoginUserUseCase, RegisterUserInput, LoginUserInput } from '@ecommerce/domain';

export class UserController {
  constructor(
    private registerUserUseCase: RegisterUserUseCase,
    private loginUserUseCase: LoginUserUseCase
  ) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const input: RegisterUserInput = req.body;
      const output = await this.registerUserUseCase.execute(input);
      res.status(201).json(output);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const input: LoginUserInput = req.body;
      const output = await this.loginUserUseCase.execute(input);
      res.status(200).json(output);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }
}
