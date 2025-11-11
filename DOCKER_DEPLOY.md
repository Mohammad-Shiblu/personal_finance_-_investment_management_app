# Financial Management App - Docker Deployment

## Quick Start (No Code Required!)

### Prerequisites
- Docker installed on your system
- Docker Compose installed

### One-Command Deployment

1. Download the docker-compose.yml file:
```bash
curl -O https://raw.githubusercontent.com/yourusername/financial-app/main/docker-compose.yml
```

2. Start the application:
```bash
docker-compose up -d
```

3. Initialize the database:
```bash
docker-compose exec app npx prisma db push
docker-compose exec app npx prisma db seed
```

4. Access the app at: **http://localhost:3000**

### Default Credentials
- **Email**: john@doe.com
- **Password**: johndoe123

### Configuration

Edit `docker-compose.yml` to customize:
- Port (default: 3000)
- Database credentials
- NEXTAUTH_URL (change to your domain/IP)

### Commands

**Stop the app:**
```bash
docker-compose down
```

**View logs:**
```bash
docker-compose logs -f app
```

**Restart:**
```bash
docker-compose restart
```

**Update to latest version:**
```bash
docker-compose pull
docker-compose up -d
```

### Network Access

To access from other devices on your network:

1. Update NEXTAUTH_URL in docker-compose.yml:
```yaml
NEXTAUTH_URL: "http://YOUR_SERVER_IP:3000"
```

2. Restart:
```bash
docker-compose restart app
```

Access from any device: `http://YOUR_SERVER_IP:3000`

### Backup

**Backup database:**
```bash
docker exec financial_app_db pg_dump -U financial_user financial_app > backup.sql
```

**Restore database:**
```bash
cat backup.sql | docker exec -i financial_app_db psql -U financial_user financial_app
```

### Troubleshooting

**Reset everything:**
```bash
docker-compose down -v
docker-compose up -d
docker-compose exec app npx prisma db push
docker-compose exec app npx prisma db seed
```

**Check app logs:**
```bash
docker-compose logs app
```

**Check database logs:**
```bash
docker-compose logs db
```
