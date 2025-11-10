#!/bin/bash

# Pure Docker deployment script (no docker-compose required)

echo "🚀 Deploying Financial Management App with Docker..."

# Configuration
DB_NAME="financial_app"
DB_USER="financial_user"
DB_PASSWORD="mypassword123"
DB_PORT="5432"
APP_PORT="3000"
NETWORK_NAME="financial_network"

# Create Docker network
echo "📡 Creating Docker network..."
docker network create $NETWORK_NAME 2>/dev/null || echo "Network already exists"

# Stop and remove existing containers
echo "🛑 Stopping existing containers..."
docker stop financial_app_db 2>/dev/null || true
docker stop financial_app 2>/dev/null || true
docker rm financial_app_db 2>/dev/null || true
docker rm financial_app 2>/dev/null || true

# Start PostgreSQL
echo "🗄️  Starting PostgreSQL database..."
docker run -d \
  --name financial_app_db \
  --network $NETWORK_NAME \
  -e POSTGRES_USER=$DB_USER \
  -e POSTGRES_PASSWORD=$DB_PASSWORD \
  -e POSTGRES_DB=$DB_NAME \
  -p $DB_PORT:5432 \
  -v financial_db_data:/var/lib/postgresql/data \
  --restart unless-stopped \
  postgres:15-alpine

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Build application image
echo "🔨 Building application image..."
docker build -t financial-app .

# Run application
echo "🚀 Starting application..."
docker run -d \
  --name financial_app \
  --network $NETWORK_NAME \
  -p $APP_PORT:3000 \
  -e DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@financial_app_db:5432/$DB_NAME" \
  -e NEXTAUTH_SECRET="RFP1Mg2UMxCzmxcnCsVHoG4gd7fGtH6C" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  -e NODE_ENV=production \
  --restart unless-stopped \
  financial-app

# Wait for app to start
echo "⏳ Waiting for application to start..."
sleep 5

# Run database migrations
echo "📊 Running database migrations..."
docker exec financial_app npx prisma db push

# Seed database
echo "🌱 Seeding database..."
docker exec financial_app npx prisma db seed

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Access the app at: http://localhost:$APP_PORT"
echo ""
echo "👤 Default credentials:"
echo "   Email: john@doe.com"
echo "   Password: johndoe123"
echo ""
echo "📝 Useful commands:"
echo "   View logs: docker logs -f financial_app"
echo "   Stop app: docker stop financial_app financial_app_db"
echo "   Start app: docker start financial_app_db financial_app"
echo "   Remove all: ./docker-cleanup.sh"
