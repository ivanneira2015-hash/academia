import { IOrderRepository } from '../../repositories/IOrderRepository';
import { ICartRepository } from '../../repositories/ICartRepository';
import { IProductRepository } from '../../repositories/IProductRepository';
import { NotFoundError, ValidationError } from '../../errors/DomainError';
import { OrderService } from '../../services/OrderService';

export interface CreateOrderFromCartInput {
  userId: string;
}

export interface CreateOrderFromCartOutput {
  id: string;
  userId: string;
  total: number;
  itemCount: number;
  status: string;
}

export class CreateOrderFromCartUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private cartRepository: ICartRepository,
    private productRepository: IProductRepository,
    private orderService: OrderService
  ) {}

  async execute(input: CreateOrderFromCartInput): Promise<CreateOrderFromCartOutput> {
    const cart = await this.cartRepository.findByUserId(input.userId);
    if (!cart || cart.isEmpty()) {
      throw new ValidationError('Cart is empty');
    }

    // Verificar stock para todos los productos
    for (const item of cart.items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) {
        throw new NotFoundError('Product', item.productId);
      }
      if (!product.hasEnoughStock(item.quantity)) {
        throw new ValidationError(`Insufficient stock for product ${product.id}`);
      }
    }

    // Reducir stock
    for (const item of cart.items) {
      const product = await this.productRepository.findById(item.productId);
      if (product) {
        product.reduceStock(item.quantity);
        await this.productRepository.update(product);
      }
    }

    // Crear orden
    const order = this.orderService.createOrderFromCartItems(
      this.generateId(),
      input.userId,
      cart.items
    );

    await this.orderRepository.create(order);

    // Limpiar carrito
    cart.clear();
    await this.cartRepository.update(cart);

    return {
      id: order.id,
      userId: order.userId,
      total: order.total,
      itemCount: order.items.length,
      status: order.status
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
