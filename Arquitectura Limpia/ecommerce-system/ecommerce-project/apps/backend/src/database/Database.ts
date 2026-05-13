import { User, Product, Cart, Order, UserRole } from '@ecommerce/domain';

export class Database {
  private users: Map<string, User> = new Map();
  private products: Map<string, Product> = new Map();
  private carts: Map<string, Cart> = new Map();
  private orders: Map<string, Order> = new Map();

  constructor() {
    this.seed();
  }

  private seed(): void {
    // Admin user
    const admin = new User(
      'admin-001',
      'admin@ecommerce.com',
      Buffer.from('admin123').toString('base64'),
      'Admin User',
      UserRole.ADMIN
    );
    this.users.set(admin.id, admin);

    // Sample products
    const products = [
      new Product('prod-001', 'Laptop', 'High-performance laptop', 999.99, 10),
      new Product('prod-002', 'Mouse', 'Wireless mouse', 29.99, 50),
      new Product('prod-003', 'Keyboard', 'Mechanical keyboard', 79.99, 30),
      new Product('prod-004', 'Monitor', '27-inch monitor', 299.99, 15),
      new Product('prod-005', 'Headphones', 'Noise-cancelling headphones', 199.99, 20)
    ];

    products.forEach(p => this.products.set(p.id, p));
  }

  getUsers(): Map<string, User> {
    return this.users;
  }

  getProducts(): Map<string, Product> {
    return this.products;
  }

  getCarts(): Map<string, Cart> {
    return this.carts;
  }

  getOrders(): Map<string, Order> {
    return this.orders;
  }
}
