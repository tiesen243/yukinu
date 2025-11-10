---
nav_order: 10
---

# Environment Variables Guide

Below are all the required environment variables for the Yukinu application. These variables configure different aspects of the application, including the web frontend, dashboard, database, authentication, and third-party integrations. Set these variables in your `.env` file or your deployment environment as needed.

## App configuration (for web)

These variables configure the public-facing web application.

- `NEXT_PUBLIC_APP_NAME`: The display name of the application.
- `NEXT_PUBLIC_TRPC_USE_STREAMING`: Enables or disables tRPC streaming. Set to `"false"` if deploying behind Nginx or a proxy that does not support streaming.

## App configuration (for dashboard)

These variables configure the admin dashboard.

- `VITE_APP_NAME`: The display name of the dashboard.
- `VITE_TRPC_USE_STREAMING`: Enables or disables tRPC streaming for the dashboard. Set to `"false"` if deploying behind Nginx or a proxy that does not support streaming.

## Database configuration

Configure your PostgreSQL database connection:

- `POSTGRES_HOST`: Database server address (default: `127.0.0.1`).
- `POSTGRES_PORT`: Database server port (default: `5432`).
- `POSTGRES_USER`: Database username.
- `POSTGRES_PASSWORD`: Database password.
- `POSTGRES_DATABASE`: Name of the database to use.
- `POSTGRES_SSL_MODE`: Set to `"false"` for local development. Use `"true"` or other values for production as needed.

## OAuth configuration

Set up OAuth credentials for third-party authentication providers:

- `AUTH_FACEBOOK_ID` / `AUTH_FACEBOOK_SECRET`: Facebook OAuth credentials.
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`: Google OAuth credentials.

## Third-party service API tokens

Provide API tokens for external services:

- `RESEND_TOKEN`: API token for Resend email service.
- `UPLOADTHING_TOKEN`: API token for UploadThing file uploads.
