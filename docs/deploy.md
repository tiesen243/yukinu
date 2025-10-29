---
nav_order: 8
---

# Deployment Guide

This guide explains the simplest deployment workflow for Yukinu.

## Requirements

- VPS with Docker and Docker Compose installed
- Domain (optional but recommended)
- Git installed

## Steps

### 1. Clone the Repository

```bash
git clone https://github.com/tiesen243/yukinu.git
cd yukinu
```

### 2. Configure Environment Variables

Copy example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```bash
vi .env
```

(Or use any editor you prefer)

### 3. Run Services with Docker Compose

```bash
docker compose up -d --build
```

### 4. Verify Deployment

Check running containers:

```bash
docker ps
```

Access the deployed services from your VPS public IP or domain.

## Troubleshooting

| Issue                     | Fix                                      |
| ------------------------- | ---------------------------------------- |
| Container fails to start  | Check logs `docker compose logs -f`      |
| Environment config errors | Ensure `.env` has all required variables |

Deployment complete!

## Optional: Deploy Web App on Vercel

Yukinu Web App supports deployment on Vercel.

### Requirements

- Vercel account
- PostgreSQL database on Neon
- Environment variables configured in Vercel Dashboard

### Steps

1. Push your repository to GitHub/GitLab/Bitbucket.
2. Go to Vercel → Import Project → Select your Yukinu repo.
3. Set required environment variables under **Project Settings → Environment Variables**.
4. Deploy.

### Database Option using Neon

You can use Neon for a serverless PostgreSQL instance:

- Create a database at neon.tech
- Copy the database config
- Set the `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DATABASE`, `POSTGRES_HOST`, and `POSTGRES_PORT` environment variables in Vercel.
