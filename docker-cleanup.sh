#!/bin/bash

# Cleanup script for pure Docker deployment

echo "🧹 Cleaning up Docker containers and volumes..."

# Stop containers
echo "🛑 Stopping containers..."
docker stop financial_app 2>/dev/null || true
docker stop financial_app_db 2>/dev/null || true

# Remove containers
echo "🗑️  Removing containers..."
docker rm financial_app 2>/dev/null || true
docker rm financial_app_db 2>/dev/null || true

# Remove network
echo "📡 Removing network..."
docker network rm financial_network 2>/dev/null || true

# Optional: Remove volumes (uncomment to delete database data)
# echo "💾 Removing volumes..."
# docker volume rm financial_db_data 2>/dev/null || true

# Optional: Remove image (uncomment to delete built image)
# echo "🖼️  Removing image..."
# docker rmi financial-app 2>/dev/null || true

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "To remove database data, run:"
echo "   docker volume rm financial_db_data"
