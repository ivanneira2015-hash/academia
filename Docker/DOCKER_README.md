# E-Commerce System - Docker Compose

## Archivo: `ecommerce-docker.zip` (17 KB)

Docker Compose completo para orquestar todo el sistema en un solo comando.

### ✨ LO QUE CONTIENE

#### Servicios (docker-compose.yml)
✅ **MongoDB 7.0** - Base de datos
  - Volumen persistente (mongodb_data)
  - Healthcheck automático
  - Usuario/contraseña configurables

✅ **Backend (Express + Node.js)** - API REST
  - Dockerfile optimizado
  - Hot reload en desarrollo
  - Variables de entorno
  - Conectado a MongoDB

✅ **Frontend (React + Vite)** - UI
  - Dockerfile multi-stage (builder + nginx)
  - Optimizado para producción
  - Hot reload en desarrollo
  - Conectado al Backend

✅ **Nginx (Reverse Proxy)** - Web Server
  - SSL/TLS termination
  - Load balancing
  - Rate limiting
  - Gzip compression
  - Headers de seguridad

#### Documentación Completa

1. **DOCKER_QUICK_START.md** (5 minutos)
   - Instalación rápida
   - Comandos básicos

2. **README.md** 
   - Descripción general
   - Comandos útiles
   - Solución de problemas

3. **DOCKER_GUIDE.md**
   - Referencia completa
   - Best practices
   - Performance tips

4. **PRODUCTION.md** ⭐ MÁS IMPORTANTE
   - Configuración de dominio
   - HTTPS con Let's Encrypt
   - Gestión de secretos
   - Explicación Reverse Proxy
   - Deployment checklist

5. **ARCHITECTURE.md**
   - Diagrama de arquitectura
   - Flujo de requests
   - Networking interno
   - Ciclo de vida

#### Configuración

✅ **.env** - Variables de entorno
✅ **.env.example** - Plantilla
✅ **Dockerfiles** - Backend y Frontend
✅ **Nginx config** - Reverse proxy y SSL
✅ **.dockerignore** - Optimizaciones
✅ **.gitignore** - Git

---

## 🚀 INICIO RÁPIDO

### Paso 1: Instalar Docker
```bash
# Windows/Mac: Docker Desktop
# https://www.docker.com/products/docker-desktop

# Linux (Ubuntu/Debian):
sudo apt install docker.io docker-compose
```

### Paso 2: Descargar proyecto
```bash
unzip ecommerce-docker.zip
cd ecommerce-docker
```

### Paso 3: Configurar variables
```bash
# El .env ya está preconfigurado
# Para producción, editar:
nano .env
```

### Paso 4: Ejecutar TODO
```bash
docker-compose up --build
```

### Paso 5: Acceder
```
Frontend:  http://localhost
Backend:   http://localhost/api
MongoDB:   localhost:27017
Health:    http://localhost/health
```

---

## 📡 ARQUITECTURA

```
                    Internet
                       ↓
                  [Nginx:80/443]
                  Reverse Proxy
                  /   |   \
            HTTP  SSL Health
             ↓     ↓    ↓
        [Frontend] [Backend] [Check]
         :5173     :3000
                    ↓
                [MongoDB]
                 :27017
```

### Flujo de Datos

1. **Request a Frontend**: Client → Nginx → Frontend (React)
2. **Request a API**: Client → Nginx → Backend → MongoDB
3. **Comunicación interna**: Servicios usan nombre interno (mongodb, backend)

---

## 🔐 DOMINIO Y HTTPS

### Configurar Dominio
1. Registrar dominio (Namecheap, GoDaddy)
2. Apuntar DNS A record a IP servidor
3. Esperar propagación (24h)

### Habilitar HTTPS
```bash
# 1. Instalar certificado Let's Encrypt
docker run -it --rm \
  -v /etc/letsencrypt:/etc/letsencrypt \
  -p 80:80 \
  certbot/certbot certonly --standalone \
  -d example.com

# 2. Copiar certificados
cp /etc/letsencrypt/live/example.com/fullchain.pem nginx/ssl/
cp /etc/letsencrypt/live/example.com/privkey.pem nginx/ssl/

# 3. Actualizar nginx.conf
# Uncomment SSL y cambiar server_name

# 4. Reiniciar Nginx
docker-compose up -d nginx
```

### Renovación automática
```bash
docker run -d --name certbot-renew \
  -v /etc/letsencrypt:/etc/letsencrypt \
  certbot/certbot renew --quiet
```

Ver **PRODUCTION.md** para detalles completos.

---

## 🔑 GESTIÓN DE SECRETOS

### En Desarrollo
```bash
.env contiene secretos plaintext
✅ ACEPTABLE solo en desarrollo local
```

### En Producción

**Opción 1: Docker Secrets**
```yaml
services:
  backend:
    secrets:
      - jwt_secret
secrets:
  jwt_secret:
    file: ./secrets/jwt_secret.txt
```

**Opción 2: HashiCorp Vault**
```bash
vault kv put secret/ecommerce jwt_secret="secret"
```

**Opción 3: AWS Secrets Manager**
```bash
aws secretsmanager create-secret --name ecommerce/jwt
```

**NUNCA:**
- Commitear .env a Git
- Hardcodear secrets en código
- Usar mismo secret en múltiples apps

Ver **PRODUCTION.md** para mas.

---

## 🔁 REVERSE PROXY (Nginx)

### ¿Qué es?

Un intermediario que:
- Recibe TODAS las requests de internet
- Las distribuye a Backend/Frontend internos
- Termina SSL/TLS (HTTPS)
- Protege aplicación de ataques
- Balancea carga
- Cachea respuestas

### Beneficios

✅ **Seguridad**: Backend no expuesto
✅ **SSL/TLS**: HTTPS en un lugar
✅ **Load Balancing**: Múltiples instancias
✅ **Rate Limiting**: Protección DDoS
✅ **Caching**: Mejor performance
✅ **Rewrite**: Modificar URLs
✅ **Compression**: Gzip

### Configuración

```nginx
# Backend
upstream backend {
    server backend:3000;
}

location /api/ {
    proxy_pass http://backend/;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Frontend
location / {
    proxy_pass http://frontend;
}
```

Headers importantes:
- `X-Real-IP`: IP real del cliente
- `X-Forwarded-For`: Cadena de IPs
- `X-Forwarded-Proto`: HTTP vs HTTPS

Ver **PRODUCTION.md** para load balancing avanzado.

---

## 📊 COMANDOS ÚTILES

### Desarrollo

```bash
# Iniciar con rebuild
docker-compose up --build

# Iniciar en background
docker-compose up -d

# Ver logs
docker-compose logs -f backend

# Conectar a MongoDB
docker-compose exec mongodb mongosh

# Ejecutar comando en backend
docker-compose exec backend yarn build

# Parar
docker-compose down
```

### Debugging

```bash
# Ver status
docker-compose ps

# Ver todas las variables de entorno
docker-compose exec backend env

# Inspeccionar servicio
docker inspect ecommerce-backend

# Ver uso de recursos
docker stats
```

### Limpiar

```bash
# Detener y eliminar containers
docker-compose down

# Detener, eliminar y limpiar volúmenes
docker-compose down -v

# Eliminar imágenes
docker rmi $(docker images -q)
```

---

## 🛠️ SOLUCIÓN DE PROBLEMAS

### Container no inicia

```bash
docker-compose logs backend
# Ver qué error hay
```

### Puerto en uso

```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "3001:3000"  # Cambiar 3000 → 3001
```

### Frontend no conecta a Backend

```bash
# Verificar CORS
curl -H "Origin: http://localhost" http://localhost/api/health

# Verificar .env
docker-compose exec frontend env | grep VITE_API_URL
```

### MongoDB sin datos

```bash
# Ver volumen
docker volume ls
docker volume inspect ecommerce_mongodb_data

# Backup
docker run --rm -v ecommerce_mongodb_data:/data \
  -v $(pwd)/backups:/backup \
  busybox tar czf /backup/mongo.tar.gz -C /data .
```

---

## 🚢 DEPLOYMENT

### Local Development
```bash
docker-compose up --build
```

### Servidor de Prueba
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Producción
Ver **PRODUCTION.md** checklist completo

Incluye:
- Dominio y DNS
- HTTPS/SSL
- Secretos seguros
- Monitoring
- Backups
- CI/CD
- Scaling

---

## 📁 ESTRUCTURA

```
ecommerce-docker/
├── docker-compose.yml      # Orquestación
├── .env                    # Secrets locales
├── .env.example            # Plantilla
├── nginx/
│   ├── nginx.conf         # Configuración
│   ├── conf.d/
│   │   └── default.conf   # Virtual hosts
│   └── ssl/               # Certificados
├── apps/
│   ├── backend/
│   │   └── Dockerfile
│   └── frontend/
│       └── Dockerfile
└── docs/
    ├── README.md
    ├── DOCKER_QUICK_START.md
    ├── DOCKER_GUIDE.md
    ├── PRODUCTION.md
    └── ARCHITECTURE.md
```

---

## 📚 DOCUMENTACIÓN

**IMPORTANTE**: Leer en este orden:

1. **DOCKER_QUICK_START.md** (5 min)
   - Start rápido

2. **README.md** (10 min)
   - Visión general

3. **DOCKER_GUIDE.md** (20 min)
   - Comandos y configuración

4. **ARCHITECTURE.md** (15 min)
   - Cómo funciona internamente

5. **PRODUCTION.md** (30 min) ⭐
   - **Más importante para hosting**
   - Dominio
   - HTTPS
   - Secrets
   - Reverse proxy explicado
   - Deployment checklist

---

## ✅ LO QUE FUNCIONA

✓ Todos los servicios en 1 comando
✓ Networking automático entre containers
✓ Persistencia de datos (MongoDB)
✓ Hot reload en desarrollo
✓ Reverse proxy funcional
✓ Health checks
✓ Logs centralizados
✓ Fácil escalamiento

---

## 🎯 PRÓXIMOS PASOS

1. Ejecutar localmente: `docker-compose up --build`
2. Probar endpoints
3. Leer PRODUCTION.md
4. Configurar dominio
5. Obtener certificado HTTPS
6. Hacer deploy

---

## 🆘 SOPORTE

Si algo no funciona:
1. Ver logs: `docker-compose logs -f`
2. Buscar en README.md problemas comunes
3. Ver DOCKER_GUIDE.md troubleshooting
4. Verificar puerto no está en uso

---

**Archivo**: ecommerce-docker.zip (17 KB)
**Última actualización**: May 12, 2026
