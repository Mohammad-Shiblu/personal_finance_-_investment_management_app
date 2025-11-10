# Docker Deployment Guide

## Quick Start (Recommended)

### Using Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

Access the app at: http://localhost:3000

---

## Manual Docker Commands

### 1. Build the Image

```bash
docker build -t financial-app .
```

### 2. Run PostgreSQL

```bash
docker run -d \
  --name financial_db \
  -e POSTGRES_USER=financial_user \
  -e POSTGRES_PASSWORD=mypassword123 \
  -e POSTGRES_DB=financial_app \
  -p 5432:5432 \
  postgres:15-alpine
```

### 3. Run the Application

```bash
docker run -d \
  --name financial_app \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://financial_user:mypassword123@financial_db:5432/financial_app" \
  -e NEXTAUTH_SECRET="RFP1Mg2UMxCzmxcnCsVHoG4gd7fGtH6C" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  --link financial_db \
  financial-app
```

---

## Environment Variables

### Required Variables

```env
DATABASE_URL=postgresql://user:password@host:5432/database
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

### Optional Variables

```env
NODE_ENV=production
PORT=3000
```

---

## Production Deployment

### 1. Update Environment Variables

Create `.env.production`:

```env
DATABASE_URL=postgresql://user:password@production-host:5432/database
NEXTAUTH_SECRET=generate-strong-secret-key
NEXTAUTH_URL=https://yourdomain.com
NODE_ENV=production
```

### 2. Update docker-compose.yml

```yaml
services:
  app:
    environment:
      DATABASE_URL: ${DATABASE_URL}
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
      NEXTAUTH_URL: ${NEXTAUTH_URL}
    env_file:
      - .env.production
```

### 3. Deploy

```bash
docker-compose -f docker-compose.yml up -d
```

---

## Database Management

### Run Migrations

```bash
# Using docker-compose
docker-compose exec app npx prisma db push

# Using docker
docker exec financial_app npx prisma db push
```

### Seed Database

```bash
# Using docker-compose
docker-compose exec app npx prisma db seed

# Using docker
docker exec financial_app npx prisma db seed
```

### Access Database

```bash
# Using docker-compose
docker-compose exec postgres psql -U financial_user -d financial_app

# Using docker
docker exec -it financial_db psql -U financial_user -d financial_app
```

### Backup Database

```bash
# Using docker-compose
docker-compose exec postgres pg_dump -U financial_user financial_app > backup.sql

# Using docker
docker exec financial_db pg_dump -U financial_user financial_app > backup.sql
```

### Restore Database

```bash
# Using docker-compose
docker-compose exec -T postgres psql -U financial_user financial_app < backup.sql

# Using docker
docker exec -i financial_db psql -U financial_user financial_app < backup.sql
```

---

## Troubleshooting

### Check Container Status

```bash
docker-compose ps
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f postgres
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart app
```

### Access Container Shell

```bash
# App container
docker-compose exec app sh

# Database container
docker-compose exec postgres sh
```

### Clean Up

```bash
# Stop and remove containers
docker-compose down

# Remove volumes (deletes database data)
docker-compose down -v

# Remove images
docker rmi financial-app
```

---

## Health Checks

### Check Application Health

```bash
curl http://localhost:3000
```

### Check Database Connection

```bash
docker-compose exec postgres pg_isready -U financial_user
```

---

## Performance Optimization

### 1. Multi-stage Build

The Dockerfile uses multi-stage builds to minimize image size:
- Base image: Node 18 Alpine (~50MB)
- Final image: ~200MB (vs ~1.5GB without optimization)

### 2. Layer Caching

Dependencies are installed in a separate layer for better caching.

### 3. Production Mode

Application runs in production mode with optimizations enabled.

---

## Security Best Practices

### 1. Use Secrets

For production, use Docker secrets instead of environment variables:

```yaml
services:
  app:
    secrets:
      - db_password
      - nextauth_secret

secrets:
  db_password:
    file: ./secrets/db_password.txt
  nextauth_secret:
    file: ./secrets/nextauth_secret.txt
```

### 2. Non-root User

The Dockerfile runs the application as a non-root user (nextjs).

### 3. Network Isolation

Use Docker networks to isolate services:

```yaml
networks:
  frontend:
  backend:

services:
  app:
    networks:
      - frontend
      - backend
  postgres:
    networks:
      - backend
```

---

## Scaling

### Horizontal Scaling

```bash
# Scale app to 3 instances
docker-compose up -d --scale app=3
```

### Load Balancer

Add nginx as a reverse proxy:

```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - app
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build and push Docker image
        run: |
          docker build -t financial-app .
          docker push your-registry/financial-app
      
      - name: Deploy to server
        run: |
          ssh user@server 'docker-compose pull && docker-compose up -d'
```

---

## Monitoring

### View Resource Usage

```bash
docker stats
```

### Container Logs

```bash
# Follow logs
docker-compose logs -f --tail=100

# Export logs
docker-compose logs > logs.txt
```

---

## Summary

✅ **Docker Setup Complete**
- Multi-stage optimized Dockerfile
- Docker Compose for easy deployment
- PostgreSQL database included
- Health checks configured
- Production-ready configuration

**Start with one command:**
```bash
docker-compose up -d
```

**Access at:** http://localhost:3000

**Default credentials:**
- Email: john@doe.com
- Password: johndoe123
