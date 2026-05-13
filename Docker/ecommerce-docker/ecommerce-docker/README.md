# E-Commerce System - Docker Compose

Sistema completo de e-commerce orquestado con Docker Compose.

## Contenedores

- **MongoDB**: Base de datos
- **Backend**: API Express (Node.js)
- **Frontend**: React + Vite
- **Nginx**: Reverse proxy + Web server

## Inicio Rápido

### 1. Clonar/Preparar proyecto
```bash
cd ecommerce-docker
```

### 2. Configurar variables de entorno
```bash
# Copiar ejemplo
cp .env.example .env

# Editar con valores deseados (especialmente en producción)
nano .env
```

### 3. Construir y ejecutar
```bash
docker-compose up --build
```

### 4. Acceder
- Frontend: http://localhost
- API: http://localhost/api
- MongoDB: localhost:27017

## Parar containers
```bash
docker-compose down
```

## Variables de Entorno (.env)

```
DB_USER=admin                          # Usuario MongoDB
DB_PASSWORD=secure_password            # Contraseña MongoDB
NODE_ENV=development                   # development/production
JWT_SECRET=super-secret-key            # JWT secret (cambiar en prod)
CORS_ORIGIN=http://localhost:5173      # CORS origin
VITE_API_URL=http://localhost:3000/api # API URL frontend
DOMAIN=localhost                       # Dominio
SSL_ENABLED=false                      # Enable HTTPS
```

## Comandos Útiles

```bash
# Ver logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb

# Ejecutar comando en container
docker-compose exec backend yarn build
docker-compose exec mongodb mongosh

# Eliminar volúmenes (CUIDADO)
docker-compose down -v

# Rebuild sin caché
docker-compose build --no-cache
```

## Para Producción

Ver `PRODUCTION.md`
