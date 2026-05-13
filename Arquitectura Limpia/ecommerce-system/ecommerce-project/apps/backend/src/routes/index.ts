import { Router, Request, Response } from 'express';
import { UserController } from '../controllers/UserController';
import { ProductController } from '../controllers/ProductController';
import { CartController } from '../controllers/CartController';
import { OrderController } from '../controllers/OrderController';
import { authMiddleware, requireRole } from '../middleware/authMiddleware';
import { AuthenticationService, UserRole } from '@ecommerce/domain';

export function setupRoutes(
  router: Router,
  userController: UserController,
  productController: ProductController,
  cartController: CartController,
  orderController: OrderController,
  authService: AuthenticationService
) {
  // Public routes
  router.post('/auth/register', (req, res) => userController.register(req, res));
  router.post('/auth/login', (req, res) => userController.login(req, res));

  // Products - public read
  router.get('/products', (req, res) => productController.list(req, res));

  // Protected routes
  const auth = authMiddleware(authService);

  // Products - admin only
  router.post('/products', auth, requireRole(UserRole.ADMIN), (req, res) => productController.create(req, res));
  router.patch('/products/:id', auth, requireRole(UserRole.ADMIN), (req, res) => productController.update(req, res));

  // Cart
  router.post('/cart/items', auth, (req, res) => cartController.addItem(req, res));
  router.get('/cart', auth, (req, res) => cartController.view(req, res));
  router.delete('/cart/items/:productId', auth, (req, res) => cartController.removeItem(req, res));

  // Orders
  router.post('/orders', auth, (req, res) => orderController.create(req, res));
  router.get('/orders', auth, (req, res) => orderController.listMyOrders(req, res));
  router.get('/admin/orders', auth, requireRole(UserRole.ADMIN), (req, res) => orderController.listAllOrders(req, res));

  // Health check
  router.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });

  return router;
}
