---
nav_order: 6
---

# Getting Started

Welcome to Yukinu — a learning project showcasing a multi-vendor e-commerce system using a modern web stack (Next.js, React, tRPC, PostgreSQL, Docker, etc.).

> **Note**  
> This project is for educational and testing purposes only. No real commercial activity is conducted.

## 1. System Requirements

To run Yukinu locally, install the following:

- **Git** (for cloning the repository)
- **Docker & Docker Compose**
- Recommended: **Node.js** or **Bun** if running locally without Docker

## 2. Clone the Repository

```bash
git clone https://github.com/tiesen243/yukinu.git
cd yukinu
```

## 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Then edit `.env` to match your setup:

- PostgreSQL connection
- OAuth credentials (optional for testing)
- App URLs

More details can be found in: [docs/env.md](./env.md)

## 4. Start With Docker

Simply run:

```bash
docker-compose up --build -d
```

This will start:

- Web App (Next.js)
- Dashboard (React Router)
- PostgreSQL database
- Nginx reverse proxy

## 5. Database Migration (If Needed)

If migrating manually:

```bash
bun --filter @yukinu/db db:migrate
```

## 6. Development Mode (Alternative)

If you want to run without Docker:

```bash
# Start PostgreSQL separately (e.g., using Docker)
docker compose up -d db

# Start the web app
bun dev
# or standalone app
bun --filter @yukinu/web dev
```

## 7. Testing Login Features

You can test authentication using:

- Email (development mode)
- OAuth providers (if configured)

| Issue                       | Possible Solution                            |
| --------------------------- | -------------------------------------------- |
| Cannot connect to DB        | Check `.env` database host & port            |
| Website loads but API fails | Verify tRPC URL & proxy config               |
| OAuth login fails           | Ensure redirect URLs are configured properly |

## 8. Available Scripts

Below are the main scripts available in the project. You can run these using `bun run <script>` or `npm run <script>` from the project root.

- **build**: Builds all packages using Turbo.
- **bump-deps**: Updates all dependencies recursively and reinstalls them.
- **clean**: Removes all untracked files, `node_modules`, and `out` directories.
- **clean:workspaces**: Cleans all workspaces using Turbo.
- **db:generate**: Runs Prisma schema generation for the database package.
- **db:migrate**: Applies database migrations for the database package.
- **db:push**: Pushes the Prisma schema to the database for the database package.
- **db:studio**: Opens Prisma Studio for the database package.
- **dev**: Starts development servers for all packages using Turbo.
- **format**: Checks code formatting using Prettier with caching.
- **format:fix**: Fixes code formatting issues using Prettier with caching.
- **postinstall**: Runs workspace linting after dependencies are installed.
- **lint**: Checks code for linting issues using ESLint with caching.
- **lint:fix**: Fixes linting issues using ESLint with caching.
- **lint:ws**: Runs workspace-level linting using Sherif.
- **prepare**: Sets up Git hooks using Husky.
- **start:dev**: Starts all services in development mode using Docker Compose.
- **start:prod**: Starts all services in production mode using Docker Compose.
- **stop:dev**: Stops development Docker Compose services.
- **stop:prod**: Stops production Docker Compose services.
- **typecheck**: Runs TypeScript type checking for all packages.

You can run scripts for specific packages by using the `--filter` option with Bun or npm. For example, to run the development server for the web package only:

```bash
bun --filter @yukinu/<package> <script>
```
