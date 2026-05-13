# Quick Start Guide

## Requisitos
- Node.js 18+
- npm o yarn

## Instalación

### 1. Instalar dependencias
```bash
yarn install
```

O si usas npm:
```bash
npm install
```

### 2. Compilar el dominio
```bash
yarn build
```

### 3. Iniciar el servidor
```bash
yarn dev
```

El servidor estará disponible en: `http://localhost:3000`

## Probar la API

### Opción 1: Usando curl

#### 1. Registrar un usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cliente@test.com",
    "password": "password123",
    "name": "Juan Pérez"
  }'
```

#### 2. Login con credenciales admin
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ecommerce.com",
    "password": "admin123"
  }'
```

Guardar el `token` de la respuesta para usarlo en siguiente paso.

#### 3. Listar productos
```bash
curl http://localhost:3000/api/products
```

#### 4. Agregar producto al carrito (con token)
```bash
curl -X POST http://localhost:3000/api/cart/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "productId": "prod-001",
    "quantity": 2
  }'
```

#### 5. Ver carrito
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/cart
```

#### 6. Crear orden
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer <token>"
```

### Opción 2: Usando Postman/Insomnia

1. Importar colección de API (ver endpoints en `API.md`)
2. Registrar usuario
3. Login y copiar token
4. Usar token en headers: `Authorization: Bearer <token>`

## Estructura del Proyecto

```
ecommerce-system/
├── domain/                 # Lógica de negocio pura
│   ├── src/
│   │   ├── entities/      # User, Product, Cart, Order
│   │   ├── use-cases/     # Lógica de aplicación
│   │   ├── services/      # Servicios de dominio
│   │   ├── repositories/  # Interfaces de repositorios
│   │   └── types/         # Tipos e interfaces
│   ├── tests/             # Tests unitarios
│   └── package.json
├── apps/backend/          # API REST con Express
│   ├── src/
│   │   ├── controllers/   # Controladores HTTP
│   │   ├── repositories/  # Implementaciones en memoria
│   │   ├── middleware/    # Auth y error handling
│   │   ├── routes/        # Definición de rutas
│   │   ├── database/      # Base de datos en memoria
│   │   └── index.ts       # Punto de entrada
│   └── package.json
├── README.md              # Documentación principal
├── ARCHITECTURE.md        # Detalles de arquitectura
├── API.md                 # Documentación de endpoints
└── QUICK_START.md        # Este archivo
```

## Datos de Prueba

### Usuario Admin
- Email: `admin@ecommerce.com`
- Password: `admin123`

### Productos Disponibles
1. **Laptop** - $999.99
2. **Mouse** - $29.99
3. **Keyboard** - $79.99
4. **Monitor** - $299.99
5. **Headphones** - $199.99

## Scripts Disponibles

```bash
# Instalar todas las dependencias
yarn install

# Compilar código TypeScript
yarn build

# Iniciar servidor en desarrollo
yarn dev

# Ejecutar tests del dominio
yarn test

# Iniciar servidor en producción
yarn start
```

## Flujo de Ejemplo Completo

### 1. Cliente se registra
```
POST /auth/register
email: newuser@test.com
password: password123
name: New User
```

### 2. Cliente hace login
```
POST /auth/login
email: newuser@test.com
password: password123
↓
Recibe token de autenticación
```

### 3. Cliente ve productos
```
GET /products
(Sin autenticación necesaria)
```

### 4. Cliente agrega items al carrito
```
POST /cart/items
productId: prod-001
quantity: 1
(Con token)
```

### 5. Cliente revisa su carrito
```
GET /cart
(Con token)
```

### 6. Cliente crea una orden
```
POST /orders
(Con token)
↓
Sistema valida stock
Reduce inventario
Vacía el carrito
Crea la orden
```

### 7. Cliente ve sus órdenes
```
GET /orders
(Con token)
```

### 8. Admin ve todas las órdenes
```
GET /admin/orders
(Con token de admin)
```

## Solución de Problemas

### Puerto 3000 en uso
```bash
# Cambiar puerto
PORT=3001 yarn dev
```

### Dependencias no se instalan
```bash
# Limpiar cache
yarn cache clean
yarn install
```

### Errores de TypeScript
```bash
# Compilar explícitamente
yarn build
```

## Próximos Pasos

1. **Implementar persistencia real** (MongoDB, PostgreSQL)
2. **Agregar autenticación JWT real** (jsonwebtoken)
3. **Implementar tests completos** (Jest)
4. **Agregar validación de entrada** (Zod, Joi)
5. **Crear frontend** (React, Vue)
6. **Desplegar a producción** (Heroku, AWS)

## Documentación Adicional

- **ARCHITECTURE.md**: Explicación detallada de la arquitectura
- **API.md**: Documentación de todos los endpoints
- **README.md**: Descripción general del proyecto

