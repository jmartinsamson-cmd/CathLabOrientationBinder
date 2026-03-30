#!/bin/bash
# Docker helper script for development and deployment

set -e

case "${1:-help}" in
  build)
    echo "Building Docker image..."
    docker build -t cath-lab-binder:latest .
    ;;
  
  up)
    echo "Starting container..."
    docker-compose up -d
    echo "✓ Container started on http://localhost:8080"
    ;;
  
  down)
    echo "Stopping container..."
    docker-compose down
    echo "✓ Container stopped"
    ;;
  
  logs)
    echo "Showing container logs..."
    docker-compose logs -f --tail=50
    ;;
  
  rebuild)
    echo "Rebuilding and starting..."
    docker-compose down
    docker build -t cath-lab-binder:latest .
    docker-compose up -d
    echo "✓ Container rebuilt and started"
    ;;
  
  clean)
    echo "Cleaning up images and containers..."
    docker-compose down
    docker rmi cath-lab-binder:latest 2>/dev/null || true
    echo "✓ Cleaned up"
    ;;
  
  test)
    echo "Testing container..."
    curl -s http://localhost:8080/ > /dev/null && echo "✓ Application is accessible" || echo "✗ Application is not responding"
    ;;
  
  stats)
    echo "Container stats:"
    docker stats cath-lab-binder --no-stream
    ;;
  
  *)
    cat << 'EOF'
Docker Helper Script

Usage: ./docker.sh [command]

Commands:
  build        Build the Docker image
  up           Start the container
  down         Stop the container
  logs         Show container logs
  rebuild      Rebuild and start the container
  clean        Remove image and containers
  test         Test if the application is accessible
  stats        Show container resource usage
  help         Show this help message

Examples:
  ./docker.sh build
  ./docker.sh up
  ./docker.sh logs
EOF
    ;;
esac
