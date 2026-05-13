import express from 'express';
import cors from 'cors';
import {
  AuthenticationService,
  RegisterUserUseCase,
  LoginUserUseCase,
  CreateProductUseCase,
  ListProductsUseCase,
  UpdateProductUseCase,
  AddItemToCartUseCase,
  RemoveItemFromCartUseCase,
  ViewCartUseCase,
  CreateOrderFromCartUseCase,
  ListOrdersUseCase,
  OrderService
} from '@ecommerce/domain';
import { Database } from './database/Database';
import { InMemoryUserRepository } from './repositories/InMemoryUserRepository';
import { InMemoryProductRepository } from './repositories/InMemoryProductRepository';
import { InMemoryCartRepository } from './repositories/InMemoryCartRepository';
import { InMemoryOrderRepository } from './repositories/InMemoryOrderRepository';
import { UserController } from './controllers/UserController';
import { ProductController } from './controllers/ProductController';
import { CartController } from './controllers/CartController';
import { OrderController } from './controllers/OrderController';
import { setupRoutes } from './routes';
import { errorMiddleware } from './middleware/authMiddleware';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database
const database = new Database();

// Repositories
const userRepository = new InMemoryUserRepository(database);
const productRepository = new InMemoryProductRepository(database);
const cartRepository = new InMemoryCartRepository(database);
const orderRepository = new InMemoryOrderRepository(database);

// Services
const authService = new AuthenticationService();
const orderService = new OrderService();

// Use Cases
const registerUserUseCase = new RegisterUserUseCase(userRepository, authService);
const loginUserUseCase = new LoginUserUseCase(userRepository, authService);
const createProductUseCase = new CreateProductUseCase(productRepository);
const listProductsUseCase = new ListProductsUseCase(productRepository);
const updateProductUseCase = new UpdateProductUseCase(productRepository);
const addItemToCartUseCase = new AddItemToCartUseCase(cartRepository, productRepository);
const removeItemFromCartUseCase = new RemoveItemFromCartUseCase(cartRepository);
const viewCartUseCase = new ViewCartUseCase(cartRepository);
const createOrderFromCartUseCase = new CreateOrderFromCartUseCase(
  orderRepository,
  cartRepository,
  productRepository,
  orderService
);
const listOrdersUseCase = new ListOrdersUseCase(orderRepository);

// Controllers
const userController = new UserController(registerUserUseCase, loginUserUseCase);
const productController = new ProductController(
  createProductUseCase,
  listProductsUseCase,
  updateProductUseCase
);
const cartController = new CartController(
  addItemToCartUseCase,
  removeItemFromCartUseCase,
  viewCartUseCase
);
const orderController = new OrderController(createOrderFromCartUseCase, listOrdersUseCase);

// Routes
const router = express.Router();
setupRoutes(router, userController, productController, cartController, orderController, authService);
app.use('/api', router);

// Error handling
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Admin credentials: admin@ecommerce.com / admin123');
});
