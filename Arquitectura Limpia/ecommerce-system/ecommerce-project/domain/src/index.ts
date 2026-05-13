// Entities
export { User } from './entities/User';
export { Product } from './entities/Product';
export { Cart } from './entities/Cart';
export { Order } from './entities/Order';

// Types
export { UserRole, OrderStatus, type IUser, type IProduct, type ICart, type IOrder, type TokenPayload } from './types';

// Errors
export { DomainError, ValidationError, NotFoundError, UnauthorizedError, ForbiddenError, ConflictError, InsufficientStockError } from './errors/DomainError';

// Repositories
export type { IUserRepository } from './repositories/IUserRepository';
export type { IProductRepository } from './repositories/IProductRepository';
export type { ICartRepository } from './repositories/ICartRepository';
export type { IOrderRepository } from './repositories/IOrderRepository';

// Services
export { AuthenticationService, type IAuthenticationService } from './services/AuthenticationService';
export { OrderService } from './services/OrderService';

// Use Cases - User
export { RegisterUserUseCase, type RegisterUserInput, type RegisterUserOutput } from './use-cases/user/RegisterUserUseCase';
export { LoginUserUseCase, type LoginUserInput, type LoginUserOutput } from './use-cases/user/LoginUserUseCase';

// Use Cases - Product
export { CreateProductUseCase, type CreateProductInput, type CreateProductOutput } from './use-cases/product/CreateProductUseCase';
export { ListProductsUseCase, type ListProductsOutput } from './use-cases/product/ListProductsUseCase';
export { UpdateProductUseCase, type UpdateProductInput, type UpdateProductOutput } from './use-cases/product/UpdateProductUseCase';

// Use Cases - Cart
export { AddItemToCartUseCase, type AddItemToCartInput, type AddItemToCartOutput } from './use-cases/cart/AddItemToCartUseCase';
export { ViewCartUseCase, type ViewCartOutput } from './use-cases/cart/ViewCartUseCase';
export { RemoveItemFromCartUseCase, type RemoveItemFromCartInput, type RemoveItemFromCartOutput } from './use-cases/cart/RemoveItemFromCartUseCase';

// Use Cases - Order
export { CreateOrderFromCartUseCase, type CreateOrderFromCartInput, type CreateOrderFromCartOutput } from './use-cases/order/CreateOrderFromCartUseCase';
export { ListOrdersUseCase, type OrderOutput } from './use-cases/order/ListOrdersUseCase';
