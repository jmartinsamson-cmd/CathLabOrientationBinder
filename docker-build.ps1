param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

function Show-Help {
    @'
Docker Helper Script for Windows

Usage: .\docker-build.ps1 [command]

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
  .\docker-build.ps1 build
  .\docker-build.ps1 up
  .\docker-build.ps1 logs
'@
}

switch ($Command.ToLower()) {
    "build" {
        Write-Host "Building Docker image..." -ForegroundColor Cyan
        docker build -t cath-lab-binder:latest .
        Write-Host "✓ Image built successfully" -ForegroundColor Green
    }
    
    "up" {
        Write-Host "Starting container..." -ForegroundColor Cyan
        docker-compose up -d
        Write-Host "✓ Container started on http://localhost:8080" -ForegroundColor Green
    }
    
    "down" {
        Write-Host "Stopping container..." -ForegroundColor Cyan
        docker-compose down
        Write-Host "✓ Container stopped" -ForegroundColor Green
    }
    
    "logs" {
        Write-Host "Showing container logs..." -ForegroundColor Cyan
        docker-compose logs -f --tail=50
    }
    
    "rebuild" {
        Write-Host "Rebuilding and starting..." -ForegroundColor Cyan
        docker-compose down
        docker build -t cath-lab-binder:latest .
        docker-compose up -d
        Write-Host "✓ Container rebuilt and started" -ForegroundColor Green
    }
    
    "clean" {
        Write-Host "Cleaning up images and containers..." -ForegroundColor Cyan
        docker-compose down
        docker rmi cath-lab-binder:latest 2>$null
        Write-Host "✓ Cleaned up" -ForegroundColor Green
    }
    
    "test" {
        Write-Host "Testing container..." -ForegroundColor Cyan
        try {
            $response = Invoke-WebRequest http://localhost:8080/ -UseBasicParsing
            if ($response.StatusCode -eq 200) {
                Write-Host "✓ Application is accessible" -ForegroundColor Green
            }
        } catch {
            Write-Host "✗ Application is not responding" -ForegroundColor Red
        }
    }
    
    "stats" {
        Write-Host "Container stats:" -ForegroundColor Cyan
        docker stats cath-lab-binder --no-stream
    }
    
    default {
        Show-Help
    }
}
