import { ICartRepository } from '../../repositories/ICartRepository';
import { NotFoundError } from '../../errors/DomainError';

export interface RemoveItemFromCartInput {
  userId: string;
  productId: string;
}

export interface RemoveItemFromCartOutput {
  cartId: string;
  total: number;
  itemCount: number;
}

export class RemoveItemFromCartUseCase {
  constructor(private cartRepository: ICartRepository) {}

  async execute(input: RemoveItemFromCartInput): Promise<RemoveItemFromCartOutput> {
    const cart = await this.cartRepository.findByUserId(input.userId);
    if (!cart) {
      throw new NotFoundError('Cart', input.userId);
    }

    cart.removeItem(input.productId);
    await this.cartRepository.update(cart);

    return {
      cartId: cart.id,
      total: cart.total,
      itemCount: cart.getItemCount()
    };
  }
}
