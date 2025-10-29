---
nav_order: 10
---

# Environment Variables Guide

Below are all the required environment variables for Yukinu application.

## Database Configuration

```env
POSTGRES_HOST="127.0.0.1"
POSTGRES_PORT=5432
POSTGRES_USER=""
POSTGRES_PASSWORD=""
POSTGRES_DATABASE="yuki_db"
POSTGRES_SSL_MODE="true" # Disable SSL mode for local development
```

## OAuth Configuration

```env
AUTH_FACEBOOK_ID=""
AUTH_FACEBOOK_SECRET=""
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
```

## Third-Party Service API Tokens

```env
RESEND_TOKEN=""
UPLOADTHING_TOKEN=""
```

## App Configuration

```env
NEXT_PUBLIC_WEB_URL="localhost:3000"
NEXT_PUBLIC_DASHBOARD_URL="localhost:3001"
NEXT_PUBLIC_TRPC_USE_STREAMING="true" # Disable httpBatchStreamLink if deploying to Nginx
```
