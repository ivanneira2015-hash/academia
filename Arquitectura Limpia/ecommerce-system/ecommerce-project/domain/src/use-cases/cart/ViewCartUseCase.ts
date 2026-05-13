import { ICartRepository } from '../../repositories/ICartRepository';
import { NotFoundError } from '../../errors/DomainError';

export interface CartItemOutput {
  productId: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface ViewCartOutput {
  id: string;
  userId: string;
  items: CartItemOutput[];
  total: number;
  itemCount: number;
}

export class ViewCartUseCase {
  constructor(private cartRepository: ICartRepository) {}

  async execute(userId: string): Promise<ViewCartOutput> {
    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      throw new NotFoundError('Cart', userId);
    }

    return {
      id: cart.id,
      userId: cart.userId,
      items: cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity
      })),
      total: cart.total,
      itemCount: cart.getItemCount()
    };
  }
}
