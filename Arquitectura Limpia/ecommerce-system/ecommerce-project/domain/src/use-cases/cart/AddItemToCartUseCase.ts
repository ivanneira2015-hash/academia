import { ICartRepository } from '../../repositories/ICartRepository';
import { IProductRepository } from '../../repositories/IProductRepository';
import { Cart } from '../../entities/Cart';
import { NotFoundError, InsufficientStockError } from '../../errors/DomainError';

export interface AddItemToCartInput {
  userId: string;
  productId: string;
  quantity: number;
}

export interface AddItemToCartOutput {
  cartId: string;
  total: number;
  itemCount: number;
}

export class AddItemToCartUseCase {
  constructor(
    private cartRepository: ICartRepository,
    private productRepository: IProductRepository
  ) {}

  async execute(input: AddItemToCartInput): Promise<AddItemToCartOutput> {
    const product = await this.productRepository.findById(input.productId);
    if (!product) {
      throw new NotFoundError('Product', input.productId);
    }

    if (!product.hasEnoughStock(input.quantity)) {
      throw new InsufficientStockError(product.id, product.stock, input.quantity);
    }

    let cart = await this.cartRepository.findByUserId(input.userId);
    if (!cart) {
      cart = new Cart(this.generateId(), input.userId);
    }

    cart.addItem(input.productId, input.quantity, product.price);
    await this.cartRepository.update(cart);

    return {
      cartId: cart.id,
      total: cart.total,
      itemCount: cart.getItemCount()
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
