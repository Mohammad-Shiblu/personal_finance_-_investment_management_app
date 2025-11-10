#!/bin/bash

# Docker deployment startup script

echo "🚀 Starting Financial Management App with Docker..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up -d --build

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "✅ Application is running!"
    echo ""
    echo "📊 Access the app at: http://localhost:3000"
    echo ""
    echo "👤 Default credentials:"
    echo "   Email: john@doe.com"
    echo "   Password: johndoe123"
    echo ""
    echo "📝 View logs: docker-compose logs -f"
    echo "🛑 Stop app: docker-compose down"
else
    echo ""
    echo "❌ Failed to start services. Check logs:"
    echo "   docker-compose logs"
fi
