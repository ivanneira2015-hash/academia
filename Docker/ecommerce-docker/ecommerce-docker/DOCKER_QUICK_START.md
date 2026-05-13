# Docker Quick Start (5 minutos)

## 1. Instalar Docker
- Windows/Mac: Docker Desktop
- Linux: `sudo apt install docker.io docker-compose`

## 2. Clonar proyecto
```bash
git clone <repo>
cd ecommerce-docker
```

## 3. Crear .env
```bash
cp .env.example .env
```

## 4. Ejecutar
```bash
docker-compose up --build
```

## 5. Acceder
- Frontend: http://localhost
- API: http://localhost/api
- MongoDB: localhost:27017

## Credenciales DB
- User: admin
- Pass: password123

## Parar
```bash
docker-compose down
```
