# Deployment a Producción

Guía completa para hostear este sistema en un servidor.

## 1. DOMINIO Y DNS

### Comprar Dominio
1. Registrar dominio en: Namecheap, GoDaddy, Route53
2. Configurar nameservers en tu proveedor de hosting

### Configurar DNS
```
A Record: example.com → IP_SERVIDOR
CNAME:    www.example.com → example.com
CNAME:    api.example.com → example.com (opcional)
```

### Verificar DNS
```bash
nslookup example.com
dig example.com
```

## 2. CERTIFICADOS HTTPS (SSL/TLS)

### Opción A: Let's Encrypt (RECOMENDADO - GRATIS)

#### Usando Certbot con Docker

```bash
# 1. Instalar Certbot
docker run -it --rm --name certbot \
  -v /etc/letsencrypt:/etc/letsencrypt \
  -v /var/lib/letsencrypt:/var/lib/letsencrypt \
  -v /var/log/letsencrypt:/var/log/letsencrypt \
  -p 80:80 \
  certbot/certbot certonly --standalone \
  -d example.com -d www.example.com

# 2. Copiar certificados a proyecto
mkdir -p nginx/ssl
cp /etc/letsencrypt/live/example.com/fullchain.pem nginx/ssl/
cp /etc/letsencrypt/live/example.com/privkey.pem nginx/ssl/

# 3. Renovación automática
docker run -d --name certbot-renew \
  -v /etc/letsencrypt:/etc/letsencrypt \
  certbot/certbot renew --quiet --no-eff-email
```

#### Usando docker-compose-letsencrypt

```yaml
# Agregar a docker-compose.yml
certbot:
  image: certbot/certbot
  volumes:
    - ./nginx/ssl:/etc/letsencrypt
  command: certonly --webroot --webroot-path=/var/www/html -d example.com --non-interactive --agree-tos -m admin@example.com
```

### Opción B: Certificado de Pago

- Sectigo, Comodo, DigiCert
- Más caro pero con garantía
- Soporta comodines (*.example.com)

### Configurar HTTPS en Nginx

```nginx
# nginx/conf.d/default.conf
server {
    listen 443 ssl http2;
    server_name example.com www.example.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    # Configuración SSL segura
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Headers de seguridad
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Redireccionar HTTP a HTTPS
    location / {
        if ($scheme != "https") {
            return 301 https://$server_name$request_uri;
        }
        proxy_pass http://frontend;
        # ... resto de config
    }
}

# Redirigir HTTP a HTTPS
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$server_name$request_uri;
}
```

### Verificar Certificado
```bash
openssl s_client -connect example.com:443
openssl x509 -in nginx/ssl/fullchain.pem -text -noout
```

## 3. GESTIÓN DE SECRETOS

### Problema: Secretos en .env

❌ **MALO**: Commitear .env a Git
❌ **MALO**: Secrets en variables de entorno plaintext
✅ **BUENO**: Usar Docker Secrets / Vault

### Opción A: Docker Secrets (Swarm Mode)

```bash
# Crear secreto
echo "super-secret-key" | docker secret create jwt_secret -

# Usar en docker-compose
services:
  backend:
    secrets:
      - jwt_secret
    environment:
      JWT_SECRET_FILE: /run/secrets/jwt_secret
```

### Opción B: HashiCorp Vault

```bash
# Instalar Vault
docker run -d --cap-add=IPC_LOCK \
  -e 'VAULT_DEV_ROOT_TOKEN_ID=myroot' \
  -p 8200:8200 \
  vault

# Guardar secreto
vault kv put secret/ecommerce \
  jwt_secret="super-secret" \
  db_password="secure-pass"

# Leer secreto
vault kv get secret/ecommerce
```

### Opción C: AWS Secrets Manager

```bash
# Crear secreto
aws secretsmanager create-secret \
  --name ecommerce/jwt \
  --secret-string "super-secret-key"

# Usar en container
docker run \
  -e JWT_SECRET=$(aws secretsmanager get-secret-value \
    --secret-id ecommerce/jwt \
    --query SecretString --output text) \
  myapp
```

### Opción D: .env en Docker Builder

```dockerfile
# Dockerfile
ARG JWT_SECRET
ENV JWT_SECRET=${JWT_SECRET}

# Build
docker build --build-arg JWT_SECRET="secret" .
```

### Best Practices Secretos

1. **NUNCA** commitear secretos a Git
2. Usar `.env` en desarrollo SOLO
3. Usar `.env.example` sin valores reales
4. En producción: Vault, Secrets Manager, o Docker Secrets
5. Rotar secretos regularmente
6. Auditar acceso a secretos

```bash
# .gitignore
.env
.env.local
.env.*.local
secrets/
```

## 4. REVERSE PROXY (Nginx)

### ¿Qué es un Reverse Proxy?

```
Internet ──→ Nginx (Reverse Proxy) ──→ Backend
                                    ──→ Frontend
                                    ──→ Base de datos
```

El servidor público recibe TODAS las requests a Nginx, que las distribuye internamente.

### Beneficios

1. **Seguridad**: Backend no expuesto públicamente
2. **Load Balancing**: Distribuir carga
3. **SSL Termination**: HTTPS en un lugar
4. **Caching**: Mejora performance
5. **Rate Limiting**: Protección DDoS
6. **Rewrite**: Modificar URLs
7. **Virtual Hosts**: Múltiples dominios

### Configuración Reverse Proxy

```nginx
# Backend
upstream backend {
    server backend:3000;
    server backend2:3000;  # Load balancing
    server backend3:3000;
}

# Frontend
upstream frontend {
    server frontend:5173;
}

server {
    listen 443 ssl http2;
    
    # API al backend
    location /api/ {
        proxy_pass http://backend/;
        
        # Headers importantes
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
    
    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
    }
}
```

### Headers Importantes

```nginx
# IP real del cliente
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

# Protocolo original (HTTP/HTTPS)
proxy_set_header X-Forwarded-Proto $scheme;

# Host original
proxy_set_header Host $host;

# Headers de seguridad
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
```

### Load Balancing

```nginx
upstream backend {
    # Round Robin (por defecto)
    server backend1:3000;
    server backend2:3000;
    server backend3:3000;
    
    # Least connections
    # least_conn;
    # server backend1:3000;
    # server backend2:3000;
    
    # IP Hash (misma IP siempre mismo backend)
    # ip_hash;
    # server backend1:3000;
    # server backend2:3000;
}
```

### Caching

```nginx
location /api/products {
    # Cache 5 minutos
    proxy_cache_valid 200 5m;
    proxy_cache_key "$scheme$request_method$host$request_uri";
    
    proxy_pass http://backend;
}
```

## 5. INFRASTRUCTURE AS CODE (IaC)

### Docker Compose mejorado para producción

```yaml
# docker-compose.prod.yml
version: '3.9'

services:
  mongodb:
    image: mongo:7.0
    restart: always
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME_FILE: /run/secrets/db_user
      MONGO_INITDB_ROOT_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_user
      - db_password
  
  backend:
    restart: always
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M

secrets:
  db_user:
    file: ./secrets/db_user.txt
  db_password:
    file: ./secrets/db_password.txt
  jwt_secret:
    file: ./secrets/jwt_secret.txt
```

### Ejecutar producción
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 6. MONITOREO Y LOGGING

### Logs centralizados
```yaml
# Agregar a docker-compose.yml
services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### Monitoreo con Prometheus
```yaml
prometheus:
  image: prom/prometheus:latest
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml
    - prometheus_data:/prometheus
  ports:
    - "9090:9090"
```

## 7. BACKUP Y RECOVERY

### Backup MongoDB
```bash
# Crear backup
docker-compose exec mongodb mongodump --out /backup

# Restaurar
docker-compose exec mongodb mongorestore /backup
```

### Volúmenes backup
```bash
# Backup volume
docker run --rm \
  -v ecommerce_mongodb_data:/data \
  -v $(pwd)/backups:/backup \
  busybox tar czf /backup/mongo.tar.gz -C /data .

# Restaurar
docker run --rm \
  -v ecommerce_mongodb_data:/data \
  -v $(pwd)/backups:/backup \
  busybox tar xzf /backup/mongo.tar.gz -C /data
```

## 8. ACTUALIZACIÓN Y ROLLBACK

### Actualizar sin downtime
```bash
# Construir nueva imagen
docker build -t myapp:v2 .

# Actualizar servicio
docker-compose up -d backend

# Verificar salud
curl http://localhost:3000/health

# Si falla, rollback
docker-compose down
docker-compose up -d  # Usa versión anterior
```

## 9. CHECKLIST PRODUCCIÓN

- [ ] Cambiar todas las contraseñas/secrets
- [ ] Habilitar HTTPS con certificado válido
- [ ] Configurar dominio apuntando a IP servidor
- [ ] Revisar variables de entorno (.env)
- [ ] Configurar backups automáticos
- [ ] Setup monitoreo y alertas
- [ ] Testear disaster recovery
- [ ] Documentar procedimientos operacionales
- [ ] Setup CI/CD para deployments
- [ ] Revisar logs y auditoría
- [ ] Configurar WAF (Web Application Firewall)
- [ ] Test load testing

## 10. RESUMEN ARQUITECTURA PRODUCCIÓN

```
Internet
   ↓
[CloudFlare / CDN] (DDoS protection, caching)
   ↓
[Load Balancer] (AWS ELB, Nginx)
   ↓
[Nginx Reverse Proxy + SSL]
   ├─→ Backend Cluster (3+ instancias)
   ├─→ Frontend (Nginx static)
   └─→ MongoDB Replica Set
   ↓
[Monitoring] (Prometheus, DataDog)
[Logging] (ELK Stack, CloudWatch)
[Backup] (S3, GCS)
```
