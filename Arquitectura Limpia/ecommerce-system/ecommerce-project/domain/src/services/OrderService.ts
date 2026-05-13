import { Order } from '../entities/Order';
import { ICartItem } from '../types';

export class OrderService {
  createOrderFromCartItems(orderId: string, userId: string, cartItems: ICartItem[]): Order {
    const orderItems = cartItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price
    }));

    return new Order(orderId, userId, orderItems);
  }
}
