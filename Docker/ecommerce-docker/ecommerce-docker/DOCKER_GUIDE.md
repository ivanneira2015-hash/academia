# Docker Compose - Guía Completa

Sistema completo con Backend, Frontend, MongoDB y Nginx.

## Estructura

```
ecommerce-docker/
├── docker-compose.yml      # Orquestación principal
├── .env                    # Variables de entorno
├── .env.example            # Plantilla
├── nginx/
│   ├── nginx.conf
│   ├── conf.d/
│   │   └── default.conf
│   └── ssl/
├── apps/
│   ├── backend/
│   │   └── Dockerfile
│   └── frontend/
│       └── Dockerfile
├── README.md               # Este archivo
├── PRODUCTION.md           # Deployment guía
└── DOCKER_GUIDE.md         # Docker referencia
```

## Instalación Rápida

```bash
# 1. Descargar Docker
# https://www.docker.com/products/docker-desktop

# 2. Clonar proyecto
git clone <repo>
cd ecommerce-docker

# 3. Configurar .env
cp .env.example .env

# 4. Construir y ejecutar
docker-compose up --build

# 5. Acceder
# Frontend: http://localhost
# Backend: http://localhost/api
# MongoDB: localhost:27017
```

## Comandos Docker Compose

### Inicio y parada

```bash
# Construir y ejecutar
docker-compose up --build

# Ejecutar en background
docker-compose up -d

# Detener containers
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v

# Reiniciar
docker-compose restart
```

### Logs

```bash
# Ver todos los logs
docker-compose logs

# Seguir logs en tiempo real
docker-compose logs -f

# Logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f mongodb

# Últimas 100 líneas
docker-compose logs --tail=100
```

### Ejecución de comandos

```bash
# Ejecutar comando en container
docker-compose exec backend yarn build
docker-compose exec mongodb mongosh

# Conectar a shell
docker-compose exec backend sh
docker-compose exec mongodb bash

# Ejecutar con usuario específico
docker-compose exec -u root backend apt-get update
```

### Información

```bash
# Ver containers en ejecución
docker-compose ps

# Ver servicios
docker-compose config

# Ver volúmenes
docker volume ls

# Inspeccionar servicio
docker-compose logs backend --tail=50
```

## Variables de Entorno (.env)

### Base de Datos

```env
DB_USER=admin                    # Usuario MongoDB
DB_PASSWORD=password123          # Contraseña MongoDB
```

### Backend

```env
NODE_ENV=development             # development | production
JWT_SECRET=dev-secret-key        # Cambiar en producción
CORS_ORIGIN=http://localhost:5173 # CORS whitelist
```

### Frontend

```env
VITE_API_URL=http://localhost:3000/api  # API endpoint
```

### Nginx

```env
DOMAIN=localhost                 # Dominio
SSL_ENABLED=false               # HTTPS (true en producción)
```

## Archivo docker-compose.yml

### Servicios

1. **mongodb**: Base de datos
   - Puerto: 27017
   - Volumen: mongodb_data
   - Healthcheck: Incluido

2. **backend**: API Express
   - Puerto: 3000
   - Depende de: mongodb
   - Hot reload: Volumen src/

3. **frontend**: React + Vite
   - Puerto: 5173
   - Depende de: backend
   - Build: Multi-stage

4. **nginx**: Reverse proxy
   - Puerto: 80, 443
   - Depende de: backend, frontend

### Networking

```
docker-compose automaticamente crea red bridge: ecommerce-network
Servicios pueden comunicarse por nombre:
- backend → mongodb:27017
- frontend → backend:3000
- nginx → backend:3000, frontend:5173
```

### Volúmenes

```
mongodb_data/
  └─ Datos persistentes MongoDB

./apps/backend/src → /app/src
  └─ Hot reload backend

./apps/frontend/src → /app/src
  └─ Hot reload frontend
```

## Dockerfile Backend

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production
COPY . .
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start"]
```

### Optimizaciones

- Alpine: Imagen pequeña
- Production dependencies: No dev tools
- Multi-stage: Reducir tamaño final
- .dockerignore: Excluir archivos innecesarios

## Dockerfile Frontend

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]
```

### Multi-stage

1. Builder: Compila React
2. Runtime: Sirve archivos estáticos con Nginx

## Nginx Configuración

### Reverse Proxy

```nginx
# Backend
upstream backend {
    server backend:3000;
}

location /api/ {
    proxy_pass http://backend/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}

# Frontend
location / {
    proxy_pass http://frontend;
}
```

### Rate Limiting

```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

location /api/ {
    limit_req zone=api_limit burst=20 nodelay;
    proxy_pass http://backend/;
}
```

### Compression

```nginx
gzip on;
gzip_types text/plain text/css application/json;
gzip_min_length 1000;
```

## Solución de Problemas

### Container no inicia

```bash
# Ver logs de error
docker-compose logs backend

# Verificar imagen
docker images

# Rebuild sin caché
docker-compose build --no-cache backend
```

### Puerto en uso

```bash
# Ver qué usa puerto
lsof -i :3000
netstat -tlnp | grep 3000

# Cambiar puerto en docker-compose.yml
ports:
  - "3001:3000"  # Cambiar primer número
```

### MongoDB no conecta

```bash
# Verificar healthcheck
docker-compose ps

# Ver logs MongoDB
docker-compose logs mongodb

# Conectar a MongoDB
docker-compose exec mongodb mongosh
```

### Frontend no se comunica con backend

```bash
# Verificar CORS
curl -H "Origin: http://localhost:5173" http://localhost/api/health

# Verificar .env
docker-compose exec frontend env | grep VITE_API_URL

# Verificar Nginx proxying
curl -v http://localhost/api/health
```

## Desarrollo vs Producción

### docker-compose.yml (Desarrollo)

```yaml
- Hot reload (volúmenes)
- Puertos abiertos (debugging)
- NODE_ENV=development
- Sin HTTPS
```

### docker-compose.prod.yml (Producción)

```yaml
- Sin volúmenes (imagen inmutable)
- Límites de recursos (CPU, memoria)
- Health checks
- Secrets seguros
- HTTPS habilitado
- Restart policies
```

## Best Practices

### Imagen Docker

```dockerfile
# ✅ BUENO
FROM node:18-alpine
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# ❌ MALO
FROM ubuntu:latest
RUN apt-get install -y nodejs
```

### docker-compose.yml

```yaml
# ✅ BUENO
services:
  app:
    image: myapp:latest
    restart: unless-stopped
    healthcheck:
      test: curl localhost:3000/health
      interval: 10s

# ❌ MALO
services:
  app:
    build: .
    restart: always  # Reinicia continuamente si hay error
```

### Seguridad

```yaml
# ✅ BUENO
environment:
  DATABASE_URL_FILE: /run/secrets/db_url
secrets:
  - db_url

# ❌ MALO
environment:
  DATABASE_URL: mongodb://user:pass@mongodb:27017
```

## Performance

### Build

```bash
# Usar .dockerignore
echo "node_modules" >> .dockerignore
echo ".git" >> .dockerignore
echo "dist" >> .dockerignore

# Caché layers
# 1. Base image
# 2. Dependencias (cambia poco)
# 3. Código fuente (cambia frecuentemente)

COPY package.json ./
RUN npm install
COPY . .
```

### Runtime

```yaml
# Limitar recursos
deploy:
  resources:
    limits:
      cpus: '1'
      memory: 512M

# Health checks
healthcheck:
  test: curl localhost:3000/health
  interval: 10s
  timeout: 5s
  retries: 5
```

## Actualización

```bash
# Actualizar imágenes base
docker-compose pull

# Rebuild y restart
docker-compose up -d --build

# Verificar versiones
docker images
```
