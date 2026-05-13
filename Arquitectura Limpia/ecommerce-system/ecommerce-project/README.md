# E-Commerce System

Sistema de e-commerce implementado con arquitectura limpia, TDD y TypeScript.

## Descripción

Este es un sistema completo de e-commerce que incluye:

- **Gestión de usuarios** con roles (Admin, Cliente)
- **Gestión de productos** (crear, actualizar, eliminar, listar)
- **Carrito de compras** con operaciones CRUD
- **Procesamiento de pedidos** con estado
- **Sistema de autenticación** con JWT
- **Control de permisos** basado en roles

## Estructura del Proyecto

```
ecommerce-system/
├── domain/                 # Lógica de negocio (entidades, casos de uso, servicios)
│   ├── src/
│   │   ├── entities/      # Entidades del dominio
│   │   ├── use-cases/     # Casos de uso (interactores)
│   │   ├── services/      # Servicios de negocio
│   │   ├── repositories/  # Interfaces de repositorios
│   │   ├── errors/        # Errores personalizados
│   │   └── types/         # Tipos y interfaces
│   ├── tests/             # Tests unitarios
│   └── package.json
├── apps/
│   └── backend/           # API REST con Express
│       ├── src/
│       │   ├── controllers/
│       │   ├── repositories/
│       │   ├── middleware/
│       │   ├── routes/
│       │   └── index.ts
│       └── package.json
└── README.md
```

## Instalación

```bash
yarn install
```

## Scripts Disponibles

- `yarn build` - Compilar dominio y backend
- `yarn test` - Ejecutar tests del dominio
- `yarn dev` - Iniciar servidor en modo desarrollo
- `yarn start` - Iniciar servidor en producción

## Tecnologías

- **TypeScript** - Tipado estático
- **Express** - Framework web
- **JWT** - Autenticación
- **Jest** - Testing
- **Yarn** - Gestor de paquetes

## Arquitectura

El proyecto sigue los principios de **Clean Architecture**:

1. **Entities** - Objetos de negocio puro
2. **Use Cases** - Lógica de aplicación
3. **Interface Adapters** - Controladores y repositorios
4. **Frameworks & Drivers** - Express, bases de datos

## Desarrollo

Este proyecto implementa **TDD (Test Driven Development)**, escribiendo tests antes de la implementación.

