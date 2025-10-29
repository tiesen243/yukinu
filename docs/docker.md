# Docker Setup Guide

This document explains how to build and run Yukinu services using Docker and Docker Compose.

## Requirements

- Docker installed
- Docker Compose installed
- `.env` file properly configured

## Build and Run

Run in project root directory:

```bash
docker compose up -d --build
```

Check running services:

```bash
docker ps
```

View logs:

```bash
docker compose logs -f
```

## Stop Services

```bash
docker compose down
```

## Rebuild After Code Changes

```bash
docker compose up -d --build --force-recreate
```

## Data Persistence

PostgreSQL data is stored in Docker volume to prevent data loss.
To remove all data:

```bash
docker compose down -v
```

## Troubleshooting

| Issue                         | Possible Cause                    | Solution                          |
| ----------------------------- | --------------------------------- | --------------------------------- |
| container restarts repeatedly | wrong `.env` or missing variables | check logs & `.env`               |
| cannot connect to db          | host or password incorrect        | update DB connection config       |
| "port already in use"         | service already running           | stop previous stack or edit ports |

This setup is recommended for production deployment on VPS.

## Docker Compose Configuration Explained

Below is the main `docker-compose.yml` configuration with explanation for each service.

### Services Breakdown

#### **web**

- Builds the Yukinu Web App (Next.js)
- Uses `.env` file for runtime configuration
- Waits for PostgreSQL to be healthy before starting

```yaml
web:
  build:
    context: .
    dockerfile: ./apps/web/Dockerfile
  restart: unless-stopped
  env_file: .env
  expose:
    - '3000'
  depends_on:
    db:
      condition: service_healthy
```

#### **dashboard**

- Builds Admin Dashboard (React Router app)
- Also waits for DB to be ready

```yaml
dashboard:
  build:
    context: .
    dockerfile: ./apps/dashboard/Dockerfile
  restart: unless-stopped
  env_file: .env
  expose:
    - '3000'
  depends_on:
    db:
      condition: service_healthy
```

#### **nginx**

- Acts as a reverse proxy for Web & Dashboard
- Supports SSL configuration (Certbot-ready)
- Maps HTTP/HTTPS ports

```yaml
nginx:
  image: nginx:latest
  restart: unless-stopped
  ports:
    - '80:80'
    - '443:443'
  volumes:
    - ./tools/nginx/default.conf:/etc/nginx/conf.d/default.conf
    - ./tools/nginx/certbot-www:/var/www/certbot
    - /etc/letsencrypt:/etc/letsencrypt
  depends_on:
    - web
    - dashboard
```

#### **db** (PostgreSQL)

- Stores main application data
- Uses `.env` for credentials
- Includes a `healthcheck` to ensure Web & Dashboard wait for startup

```yaml
db:
  image: postgres:18
  restart: unless-stopped
  environment:
    POSTGRES_USER: '${POSTGRES_USER}'
    POSTGRES_PASSWORD: '${POSTGRES_PASSWORD}'
    POSTGRES_DB: '${POSTGRES_DATABASE}'
  ports:
    - '${POSTGRES_PORT:-5432}:5432'
  volumes:
    - pg_data:/var/lib/postgresql
  healthcheck:
    test:
      ['CMD-SHELL', 'pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DATABASE}']
    interval: 5s
    timeout: 5s
    retries: 5
    start_period: 5s
```

### Volumes

Stores persistent PostgreSQL data

```yaml
volumes:
  pg_data:
```
