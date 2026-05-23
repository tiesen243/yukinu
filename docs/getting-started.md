---
title: 1. Getting Started
description: A step-by-step guide to setting up your local development environment for the Yukinu Multi-Vendor E-commerce platform.
---

# Getting Started

This guide will walk you through setting up your local development environment for the **Yukinu** Multi-Vendor E-commerce platform.

## Prerequisites

Before diving into the setup, make sure you have the following installed on your machine:

- **Runtime:** [Bun](https://bun.sh) (v1.x or higher)
- **Containerization:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) & Docker Compose
- **Version Control:** Git

## 1. Project Initialization

First, clone the repository to your local machine and navigate into the project root directory:

```bash
# Clone the repository
git clone [https://github.com/tiesen243/yukinu.git](https://github.com/tiesen243/yukinu.git)

# Move into the project directory
cd yukinu

# Install dependencies using Bun workspaces
bun install
```

## 2. Environment Configuration

Yukinu utilizes a monorepo structure where apps and certain packages require specific configuration variables. Example environment files are provided in each package.

Copy the `.env.example` files to create your local `.env` files:

```bash
# Set up environment variables for the Customer Web application
cp apps/web/.env.example apps/web/.env

# Set up environment variables for the Vendor Dashboard application
cp apps/dashboard/.env.example apps/dashboard/.env
```

Essential Configuration Matrix

Ensure the following core variables are configured properly in your newly created `.env` files:

| Variable Name                    | Description                                              | Required For     |
| -------------------------------- | -------------------------------------------------------- | ---------------- |
| `DATABASE_URL`                   | Connection string for the PostgreSQL database.           | All applications |
| `AUTH_SECRET`                    | Secret key for authentication sessions.                  | All applications |
| `AUTH_GITHUB_ID`                 | GitHub OAuth client ID for authentication.               | All applications |
| `AUTH_GITHUB_SECRET`             | GitHub OAuth client secret for authentication.           | All applications |
| `AUTH_GOOGLE_ID`                 | Google OAuth client ID for authentication.               | All applications |
| `AUTH_GOOGLE_SECRET`             | Google OAuth client secret for authentication.           | All applications |
| `SEPAY_TOKEN`                    | API token for Sepay payment gateway integration.         | Web              |
| `NEXT_PUBLIC_SEPAY_DEMO`         | Flag to enable Sepay demo mode (true/false).             | Web              |
| `NEXT_PUBLIC_BANK_NAME`          | Name of the bank for Sepay transactions.                 | Web              |
| `NEXT_PUBLIC_BANK_ACCOUNT`       | Bank account number for Sepay transactions.              | Web              |
| `RESEND_TOKEN`                   | API token for Resend email service integration.          | All applications |
| `UPLOADTHING_TOKEN`              | API token for UploadThing file upload service.           | All applications |
| `TURNSTILE_SECRET_KEY`           | Secret key for Cloudflare Turnstile CAPTCHA integration. | All applications |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Site key for Cloudflare Turnstile CAPTCHA integration.   | Web              |
| `NEXT_PUBLIC_APP_NAME`           | Name of the application for display purposes.            | Web              |
| `VITE_APP_NAME`                  | Name of the application for display purposes.            | Dashboard        |
| `NEXT_PUBLIC_DASHBOARD_URL`      | Base URL for the Vendor Dashboard application.           | Web              |
| `VITE_DASHBOARD_URL`             | Base URL for the Vendor Dashboard application.           | Dashboard        |
| `NEXT_PUBLIC_WEB_URL`            | Base URL for the Customer Web application.               | Dashboard        |
| `VITE_WEB_URL`                   | Base URL for the Customer Web application.               | Dashboard        |

## 3. Docker Containerization

Yukinu provides a `docker-compose.yml` file in the root directory to spin up resources like the database locally without contaminating your operating system.

To spin up the PostgreSQL database container in decoupled (background) mode, run:

```bash
docker compose up -d db
```

To verify that your database container is up and running healthy, execute:

```bash
docker compose ps
```

## 4. Database Schema & Migrations

Once your Docker database container is active, you must apply the database schema. Yukinu handles schemas and migrations natively using Drizzle ORM scoped inside the @yukinu/db internal workspace package.

Instead of navigating into the package manually, use Turborepo filters from the project root:

### 4.1. Generate Migrations

If you make changes to your schema definitions (`packages/db/src/schema.ts`), generate a raw SQL migration file using:

```bash
bun --filter @yukinu/db run db:generate
```

### 4.2. Apply Migrations

Push the generated migrations directly into your live Docker PostgreSQL container:

```bash
bun --filter @yukinu/db run db:migrate
```

### 4.3. Explore via Drizzle Studio

To view your mock data, tables, and relationships visually through an interactive GUI dashboard, run:

```bash
bun --filter @yukinu/db run db:studio
```

## 5. Running Applications Locally

With the environment files, Docker containers, and database migrations securely set up, you can now launch your Turborepo pipelines.

To start all frontend apps, backend routers, and local document blocks concurrently in development mode, run:

```bash
bun run dev
```

Turborepo will automatically spin up the following default local links:

- Web App (`apps/web`): [http://localhost:3000](http://localhost:3000)
- Dashboard App (`apps/dashboard`): [http://localhost:3001](http://localhost:3001)
