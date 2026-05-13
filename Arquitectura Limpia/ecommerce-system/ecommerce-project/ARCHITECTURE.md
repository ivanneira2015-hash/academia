# Arquitectura del Sistema E-Commerce

## Descripción General

Este proyecto implementa un sistema de e-commerce completo siguiendo los principios de **Clean Architecture**, **TDD** y **SOLID**.

## Estructura de Capas

### 1. Domain Layer (Capa de Dominio)
Contiene la lógica de negocio pura, independiente de cualquier framework o tecnología.

#### Entidades (`entities/`)
- **User**: Representa un usuario del sistema (admin o cliente)
- **Product**: Representa un producto disponible para venta
- **Cart**: Representa el carrito de compras de un usuario
- **Order**: Representa una orden realizada

#### Casos de Uso (`use-cases/`)
Implementan la lógica específica de cada operación del negocio:

**Usuario**:
- `RegisterUserUseCase`: Registro de nuevos usuarios
- `LoginUserUseCase`: Autenticación de usuarios

**Productos**:
- `CreateProductUseCase`: Crear nuevo producto (solo admin)
- `ListProductsUseCase`: Listar todos los productos
- `UpdateProductUseCase`: Actualizar producto (solo admin)

**Carrito**:
- `AddItemToCartUseCase`: Agregar producto al carrito
- `RemoveItemFromCartUseCase`: Remover producto del carrito
- `ViewCartUseCase`: Ver contenido del carrito

**Órdenes**:
- `CreateOrderFromCartUseCase`: Crear orden desde carrito
- `ListOrdersUseCase`: Listar órdenes

#### Servicios (`services/`)
- **AuthenticationService**: Manejo de contraseñas y tokens
- **OrderService**: Lógica de transformación carrito → orden

#### Repositorios (`repositories/`)
Interfaces que definen contratos para acceso a datos:
- `IUserRepository`
- `IProductRepository`
- `ICartRepository`
- `IOrderRepository`

### 2. Interface Adapters Layer (Capa de Adaptadores)
Implementa las interfaces de repositorios y adapta la entrada/salida.

#### Repositorios en Memoria (`repositories/`)
- `InMemoryUserRepository`
- `InMemoryProductRepository`
- `InMemoryCartRepository`
- `InMemoryOrderRepository`

#### Controladores (`controllers/`)
Adaptan las request HTTP a inputs de los use cases:
- `UserController`
- `ProductController`
- `CartController`
- `OrderController`

#### Middleware (`middleware/`)
- `authMiddleware`: Validación de tokens y autenticación
- `requireRole`: Control de acceso basado en roles
- `errorMiddleware`: Manejo centralizado de errores

### 3. Frameworks & Drivers Layer
- **Express**: Framework web
- **HTTP Routes**: Definición de endpoints

## Modelo de Datos

### Enumeraciones

```
UserRole: ADMIN | CLIENT
OrderStatus: PENDING | CONFIRMED | SHIPPED | DELIVERED | CANCELLED
```

### Relaciones

```
User (1) ──→ (1) Cart
User (1) ──→ (N) Orders
Product (1) ──→ (N) CartItems
Product (1) ──→ (N) OrderItems
```

## Flujos de Negocio Principales

### Flujo de Compra
1. Usuario se registra/login
2. Usuario ve productos disponibles
3. Usuario agrega productos al carrito
4. Usuario crea orden desde carrito
5. Sistema valida stock y reduce inventario
6. Carrito se vacía

### Flujo de Gestión de Productos (Admin)
1. Admin login
2. Admin crea/actualiza productos
3. Sistema valida datos y actualiza inventario

## Principios Aplicados

### Clean Architecture
- ✅ Independencia de frameworks
- ✅ Testeable
- ✅ UI independiente
- ✅ DB independiente
- ✅ Negocio independiente de externos

### TDD
Cada caso de uso tiene tests que validan:
- Validaciones de entrada
- Comportamiento esperado
- Manejo de errores

### SOLID
- **S**ingle Responsibility: Cada clase tiene una razón para cambiar
- **O**pen/Closed: Abierto para extensión, cerrado para modificación
- **L**iskov Substitution: Las implementaciones respetan los contratos
- **I**nterface Segregation: Interfaces específicas para cada necesidad
- **D**ependency Inversion: Depender de abstracciones, no de implementaciones

## Extensibilidad

### Para cambiar de BD (en memoria → MongoDB)
1. Crear nuevas implementaciones en `repositories/`
2. Inyectarlas en el contenedor
3. La lógica de dominio **no cambia**

### Para agregar nuevas funcionalidades
1. Crear nuevas entidades en `domain/entities/`
2. Crear nuevos use cases en `domain/use-cases/`
3. Crear controladores en `backend/controllers/`
4. Agregar rutas en `backend/routes/`

## Testing

Cada use case tiene tests unitarios que:
- No dependen de BD real
- Mockean los repositorios
- Validan la lógica de negocio
- Verifican manejo de errores

