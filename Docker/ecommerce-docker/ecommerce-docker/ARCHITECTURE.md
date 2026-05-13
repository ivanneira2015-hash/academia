# Arquitectura Docker Compose

## Diagrama

```
                    Internet
                       ↓
                   [Nginx:80]
                  /          \
              HTTP          HTTPS
              ↓                ↓
         [Reverse Proxy]  [SSL/TLS]
         /       |       \
       /         |         \
    [Backend]  [Frontend]  [Health Check]
    :3000       :5173
      |
    [MongoDB]
    :27017
```

## Servicios

### MongoDB (Base de Datos)
- **Imagen**: mongo:7.0
- **Puerto**: 27017
- **Volumen**: mongodb_data (persistencia)
- **Red**: ecommerce-network
- **Healthcheck**: Ping MongoDB
- **Restart**: unless-stopped

**Conexión desde Backend**:
```
mongodb://admin:password123@mongodb:27017/ecommerce
```

### Backend (API)
- **Build**: apps/backend/Dockerfile
- **Puerto**: 3000
- **Entorno**: NODE_ENV, JWT_SECRET, DATABASE_URL
- **Volumen**: ./apps/backend/src:/app/src (hot reload)
- **Dependencias**: mongodb (healthcheck)
- **Restart**: unless-stopped

**Endpoints**:
```
GET  /api/products
POST /api/auth/login
POST /api/cart/items
...
```

### Frontend (UI)
- **Build**: apps/frontend/Dockerfile
- **Puerto**: 5173
- **Build**: Multi-stage (node → nginx)
- **Volumen**: ./apps/frontend/src:/app/src (hot reload)
- **Entorno**: VITE_API_URL
- **Dependencias**: backend
- **Restart**: unless-stopped

**Compilación**:
1. Node 18 compila React
2. Nginx sirve dist/

### Nginx (Reverse Proxy)
- **Imagen**: nginx:alpine
- **Puertos**: 80 (HTTP), 443 (HTTPS)
- **Config**: nginx/nginx.conf + conf.d/
- **SSL**: nginx/ssl/ (Let's Encrypt)
- **Dependencias**: backend, frontend
- **Restart**: unless-stopped

**Funciones**:
- Proxy a backend en /api/
- Proxy a frontend en /
- SSL/TLS termination
- Rate limiting
- Gzip compression
- Load balancing (si hay múltiples)

## Networking

```
ecommerce-network (bridge)
├── mongodb:27017 (privada)
├── backend:3000
├── frontend:5173
└── nginx:80, 443
```

### Resolución DNS interna
```
mongodb → 172.18.0.2:27017
backend → 172.18.0.3:3000
frontend → 172.18.0.4:5173
nginx → 172.18.0.5:80
```

### Comunicación
- Backend → MongoDB: `mongodb://admin:pass@mongodb:27017`
- Frontend → Backend: `http://backend:3000/api` (interno)
- Frontend → Backend: `http://localhost:3000/api` (público)
- Nginx → Backend: `http://backend:3000`
- Nginx → Frontend: `http://frontend:5173`

## Volúmenes

### mongodb_data
```
Persistencia de base de datos
/data/db (dentro container)
~/Docker/Volumes/ecommerce_mongodb_data (host)
```

### src (hot reload)
```
./apps/backend/src ↔ /app/src
./apps/frontend/src ↔ /app/src
```

### Nginx config (read-only)
```
./nginx/nginx.conf → /etc/nginx/nginx.conf:ro
./nginx/conf.d/ → /etc/nginx/conf.d/:ro
./nginx/ssl/ → /etc/nginx/ssl/:ro
```

## Flujo de Request

### Request a Frontend
```
Client → Nginx:80
         ↓
      [Reverse Proxy]
         ↓
      frontend:5173
         ↓
      [Nginx sirve dist/]
         ↓
      index.html + JS/CSS
```

### Request a API
```
Client → Nginx:80/api/...
         ↓
      [Reverse Proxy]
         ↓
      backend:3000/...
         ↓
      [Express Handler]
         ↓
      mongodb:27017
         ↓
      [Respuesta JSON]
```

## Ciclo de Vida

### Inicio (`docker-compose up --build`)

1. Crear red `ecommerce-network`
2. Crear volúmenes
3. Build MongoDB (imagen descargada)
4. Build Backend (Dockerfile)
5. Build Frontend (Dockerfile multi-stage)
6. Build Nginx (imagen descargada)
7. Iniciar MongoDB
8. Esperar healthcheck MongoDB ✓
9. Iniciar Backend
10. Iniciar Frontend
11. Iniciar Nginx
12. **Sistema listo** ✓

### Shutdown (`docker-compose down`)

1. Detener Nginx
2. Detener Frontend
3. Detener Backend
4. Detener MongoDB
5. Eliminar containers
6. Eliminar red
7. Mantener volúmenes (base de datos persiste)

### Restart (`docker-compose restart`)

1. Señal SIGTERM a containers
2. Esperar 10s (graceful shutdown)
3. SIGKILL si sigue ejecutándose
4. Reiniciar containers
5. Reutilizar volúmenes

## Healthcheck

### MongoDB
```yaml
healthcheck:
  test: echo 'db.runCommand("ping").ok'
  interval: 10s
  timeout: 5s
  retries: 5
```

### Backend (implícito)
```
Si frontend no puede conectar, falla
```

### Frontend (implícito)
```
Si nginx no puede acceder, error 502
```

## Escalamiento

### Múltiples backends
```yaml
services:
  backend:
    extends:
      service: backend
    depends_on:
      - mongodb
  
  backend-2:
    extends:
      service: backend
    ports: ["3001:3000"]
  
  backend-3:
    extends:
      service: backend
    ports: ["3002:3000"]
```

### Load balancing en Nginx
```nginx
upstream backend {
    server backend:3000;
    server backend-2:3000;
    server backend-3:3000;
}

location /api/ {
    proxy_pass http://backend;
    # Distribuye entre 3 backends
}
```

## Seguridad

### Puertos expuestos
```yaml
# ❌ MALO: Expone MongoDB
mongodb:
  ports:
    - "27017:27017"

# ✅ BUENO: Solo expone por red interna
# Sin ports, solo accesible desde otros containers
```

### Secretos
```yaml
# ❌ MALO
environment:
  DB_PASSWORD: password123

# ✅ BUENO
secrets:
  db_password:
    file: ./secrets/db_password.txt
```

## Monitoreo

```bash
# Ver estado
docker-compose ps

# Ver logs
docker-compose logs -f

# Ver uso recursos
docker stats

# Ver volumenes
docker volume ls
```
