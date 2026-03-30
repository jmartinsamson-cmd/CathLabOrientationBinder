FROM nginx:1.29-alpine

# Optional custom nginx config for clean static serving behavior
COPY nginx.conf /etc/nginx/conf.d/default.conf

# App files
COPY . /usr/share/nginx/html

# Runtime
EXPOSE 8080
