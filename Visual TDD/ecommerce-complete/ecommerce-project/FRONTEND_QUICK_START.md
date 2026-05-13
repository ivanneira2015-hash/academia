# Frontend Quick Start

## Instalación

```bash
yarn install
```

## Desarrollo

### Ejecutar Frontend y Backend juntos
```bash
yarn dev
```

### Ejecutar solo Frontend
```bash
yarn dev:frontend
```
Puerto: http://localhost:5173

### Ejecutar solo Backend
```bash
yarn dev:backend
```
Puerto: http://localhost:3000

## Storybook (Visual TDD)

```bash
yarn storybook
```
Puerto: http://localhost:6006

## Estructura del Frontend

```
apps/frontend/src/
├── components/       # Componentes reutilizables
│   ├── Button.tsx
│   ├── ProductCard.tsx
│   ├── Layout.tsx
│   └── *.stories.tsx # Storybook stories
├── pages/           # Páginas/pantallas
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── CartPage.tsx
│   └── OrdersPage.tsx
├── services/        # API client (Axios)
│   └── api.ts
├── stores/          # Estado global (Zustand)
│   ├── authStore.ts
│   └── cartStore.ts
├── styles/          # Estilos CSS/Tailwind
│   └── index.css
├── App.tsx          # Componente raíz
└── main.tsx         # Entry point
```

## Componentes Disponibles

### Button
- Props: children, onClick, type, variant (primary|secondary), disabled
- Storybook: ✓ Incluido

### ProductCard
- Props: id, name, description, price, stock, onAddToCart
- Storybook: ✓ Incluido

## Estado Global

### useAuthStore (Zustand)
- user: User | null
- token: string | null
- isAuthenticated: boolean
- login(email, password)
- register(email, password, name)
- logout()

### useCartStore (Zustand)
- items: CartItem[]
- total: number
- fetchCart()
- addItem(productId, quantity)
- removeItem(productId)

## API Endpoints Consumidos

- POST /auth/register
- POST /auth/login
- GET /products
- POST /cart/items
- GET /cart
- DELETE /cart/items/:productId
- POST /orders
- GET /orders

## Testing con Storybook

Storybook permite Visual TDD:
1. Crear story del componente
2. Probar en aislamiento
3. Interactuar con controles
4. Ver cambios en tiempo real

Ejemplos incluidos:
- Button: Primary, Secondary, Disabled
- ProductCard: InStock, OutOfStock

## Credenciales de Prueba

```
Email: admin@ecommerce.com
Password: admin123
```

## Tecnologías

- React 18
- Vite (fast build tool)
- TypeScript
- Zustand (state management)
- Axios (HTTP client)
- Tailwind CSS (styling)
- Storybook (component development)
- React Router (navigation)
