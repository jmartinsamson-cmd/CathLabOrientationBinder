# Docker Deployment Guide

## Quick Start

### Using Docker Compose (Easiest)

```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

### Using Docker CLI

```bash
# Build the image
docker build -t cath-lab-binder:latest .

# Run the container
docker run -d -p 8080:8080 --name cath-lab-binder cath-lab-binder:latest

# View logs
docker logs -f cath-lab-binder

# Stop the container
docker stop cath-lab-binder
```

### Using Helper Scripts

**On Windows (PowerShell):**

```powershell
.\docker-build.ps1 build    # Build image
.\docker-build.ps1 up       # Start container
.\docker-build.ps1 logs     # View logs
.\docker-build.ps1 down     # Stop container
```

**On macOS/Linux (Bash):**

```bash
./docker.sh build    # Build image
./docker.sh up       # Start container
./docker.sh logs     # View logs
./docker.sh down     # Stop container
```

## Docker Image Registry Deployment

### Docker Hub

1. **Create an account** at [hub.docker.com](https://hub.docker.com)

2. **Login locally:**

```bash
docker login
```

1. **Tag and push your image:**

```bash
docker tag cath-lab-binder:latest yourusername/cath-lab-binder:latest
docker push yourusername/cath-lab-binder:latest
```

1. **Pull and run from Docker Hub:**

```bash
docker run -d -p 8080:8080 yourusername/cath-lab-binder:latest
```

### GitHub Container Registry (ghcr.io)

1. **Generate a Personal Access Token:**
   - Go to Settings > Developer settings > Personal access tokens (fine-grained)
   - Create a token with `write:packages` permissions

2. **Login:**

```bash
echo $PAT | docker login ghcr.io -u USERNAME --password-stdin
```

1. **Tag and push:**

```bash
docker tag cath-lab-binder:latest ghcr.io/username/cath-lab-binder:latest
docker push ghcr.io/username/cath-lab-binder:latest
```

## Cloud Deployment

### AWS (Elastic Container Registry)

```bash
# Create repository
aws ecr create-repository --repository-name cath-lab-binder

# Login (get auth token)
aws ecr get-login-password | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com

# Tag image
docker tag cath-lab-binder:latest <account>.dkr.ecr.<region>.amazonaws.com/cath-lab-binder:latest

# Push
docker push <account>.dkr.ecr.<region>.amazonaws.com/cath-lab-binder:latest
```

See AWS documentation for container orchestration.

### Azure (Container Registry)

```bash
# Create registry
az acr create --resource-group mygroup --name myregistry --sku Basic

# Login
az acr login --name myregistry

# Tag image
docker tag cath-lab-binder:latest myregistry.azurecr.io/cath-lab-binder:latest

# Push
docker push myregistry.azurecr.io/cath-lab-binder:latest
```

See Azure documentation for container deployment.

### Heroku

```bash
# Login
heroku login

# Create app
heroku create your-app-name

# Set container stack
heroku stack:set container -a your-app-name

# Deploy (requires Dockerfile and heroku.yml)
git push heroku main
```

## Production Considerations

### Security

- Use non-root user in Dockerfile
- Keep base image updated
- Scan images for vulnerabilities: `docker scan cath-lab-binder:latest`
- Use secrets management (don't hardcode credentials)

### Performance

- Use multi-stage builds to reduce image size
- Optimize layer caching
- Monitor container resource usage: `docker stats`

### Monitoring & Logging

```bash
# View logs
docker logs cath-lab-binder

# View real-time stats
docker stats cath-lab-binder

# Inspect container details
docker inspect cath-lab-binder
```

### Orchestration

For production deployments with high availability:

**Kubernetes:**

```bash
kubectl apply -f kubernetes-manifests.yaml
```

**Docker Swarm:**

```bash
docker swarm init
docker stack deploy -c docker-compose.yml cath-lab-binder
```

## Environment Variables

Update `docker-compose.yml` to add environment variables as needed:

```yaml
environment:
  - TZ=UTC
  - NGINX_WORKER_PROCESSES=auto
```

## Health Checks

The container includes a health check configuration that verifies the application is responding every 30 seconds.

View health status:

```bash
docker inspect --format='{{.State.Health.Status}}' cath-lab-binder
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 8080
netstat -ano | findstr :8080  # Windows
lsof -i :8080                 # macOS/Linux

# Change port in docker-compose.yml
ports:
  - "8081:8080"  # Use 8081 instead
```

### Container Crashes

```bash
# Check logs
docker logs cath-lab-binder

# Rebuild without cache
docker build --no-cache -t cath-lab-binder:latest .
```

### Permission Issues

```bash
# Ensure proper file ownership in container
# Check nginx configuration
docker exec cath-lab-binder nginx -t
```

## Useful Commands

```bash
# View image layers
docker history cath-lab-binder:latest

# Execute command in running container
docker exec cath-lab-binder ls -la /usr/share/nginx/html

# Copy files between host and container
docker cp ./file.txt cath-lab-binder:/tmp/

# Clean up dangling images
docker image prune -f

# Full cleanup (warning: removes volumes too)
docker system prune -a
```

## Next Steps

1. Push image to a registry (Docker Hub, GitHub Container Registry, or cloud provider)
2. Set up automated builds using GitHub Actions
3. Implement monitoring and logging
4. Configure CI/CD pipeline
5. Set up health alerts and auto-scaling policies
