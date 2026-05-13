# E-Commerce System - Complete

Sistema de e-commerce con arquitectura limpia, domain layer, y frontend con React + Vite.

## Estructura

```
ecommerce-system/
├── domain/          # Lógica de negocio (domain layer)
├── apps/
│   ├── backend/     # API REST con Express
│   └── frontend/    # UI con React + Vite
└── README.md
```

## Instalación

```bash
yarn install
```

## Desarrollo

Ejecutar todo (backend + frontend):
```bash
yarn dev
```

O por separado:
```bash
yarn dev:backend
yarn dev:frontend
```

## Storybook

```bash
yarn storybook
```

## Endpoints

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Storybook: http://localhost:6006
