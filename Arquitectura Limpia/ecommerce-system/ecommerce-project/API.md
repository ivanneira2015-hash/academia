# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Para acceder a endpoints protegidos, incluir el header:
```
Authorization: Bearer <token>
```

## Endpoints Públicos

### Registro de Usuario
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response: 201 Created
{
  "id": "user-123",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "CLIENT"
}
```

### Login de Usuario
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "CLIENT"
  }
}
```

### Listar Productos
```
GET /products

Response: 200 OK
[
  {
    "id": "prod-001",
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99,
    "stock": 10
  },
  ...
]
```

## Endpoints Protegidos (Requieren Autenticación)

### Crear Producto (Solo Admin)
```
POST /products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "stock": 5
}

Response: 201 Created
{
  "id": "prod-new",
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "stock": 5
}
```

### Actualizar Producto (Solo Admin)
```
PATCH /products/:productId
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 89.99,
  "stock": 10
}

Response: 200 OK
{
  "id": "prod-001",
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 89.99,
  "stock": 10
}
```

### Agregar Item al Carrito
```
POST /cart/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "prod-001",
  "quantity": 2
}

Response: 200 OK
{
  "cartId": "cart-123",
  "total": 1999.98,
  "itemCount": 2
}
```

### Ver Carrito
```
GET /cart
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "cart-123",
  "userId": "user-123",
  "items": [
    {
      "productId": "prod-001",
      "quantity": 2,
      "price": 999.99,
      "subtotal": 1999.98
    }
  ],
  "total": 1999.98,
  "itemCount": 2
}
```

### Remover Item del Carrito
```
DELETE /cart/items/:productId
Authorization: Bearer <token>

Response: 200 OK
{
  "cartId": "cart-123",
  "total": 0,
  "itemCount": 0
}
```

### Crear Orden
```
POST /orders
Authorization: Bearer <token>

Response: 201 Created
{
  "id": "order-123",
  "userId": "user-123",
  "total": 1999.98,
  "itemCount": 2,
  "status": "PENDING"
}
```

### Listar Mis Órdenes
```
GET /orders
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "order-123",
    "userId": "user-123",
    "total": 1999.98,
    "status": "PENDING",
    "itemCount": 2
  }
]
```

### Listar Todas las Órdenes (Solo Admin)
```
GET /admin/orders
Authorization: Bearer <admin_token>

Response: 200 OK
[
  {
    "id": "order-123",
    "userId": "user-123",
    "total": 1999.98,
    "status": "PENDING",
    "itemCount": 2
  }
]
```

### Health Check
```
GET /health

Response: 200 OK
{
  "status": "ok"
}
```

## Datos de Prueba

### Admin
- Email: `admin@ecommerce.com`
- Password: `admin123`

### Productos Iniciales
1. Laptop - $999.99 (10 en stock)
2. Mouse - $29.99 (50 en stock)
3. Keyboard - $79.99 (30 en stock)
4. Monitor - $299.99 (15 en stock)
5. Headphones - $199.99 (20 en stock)

## Códigos de Error

- `400 Bad Request`: Validación fallida
- `401 Unauthorized`: Token inválido o faltante
- `403 Forbidden`: Permisos insuficientes
- `404 Not Found`: Recurso no encontrado
- `409 Conflict`: Conflicto (ej: usuario ya existe)
- `500 Internal Server Error`: Error del servidor

