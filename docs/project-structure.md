---
nav_order: 3
---

# Project Structure

This document provides an overview of the directory structure for the Yukinu monorepo.  
The project is managed using Turborepo to optimize task execution, caching, and code sharing.

## 1. Top-Level Layout

```plain
(root)
├── apps/               # Frontend user-facing applications
├── packages/           # Shared internal packages (API, Auth, DB, UI, Validators)
├── tools/              # Development tools and configurations
├── docs/               # Project documentation
├── docker-compose.yml  # Deployment configuration using Docker
├── turbo.json          # Turborepo workspace configuration
├── package.json        # Root dependencies and task runners
└── README.md           # Project overview
```

## 2. Applications

### `apps/web`

- Marketplace frontend for customers
- Built with Next.js, React, TailwindCSS, Shadcn/UI components
- Includes routing under `app/`
- Communicates with backend via tRPC client

### `apps/dashboard`

- Vendor management dashboard (admin UI)
- Built with React and React Router
- Vendor roles: owner, manager, staff
- Inventory, collections, and order management support

## 3. Shared Packages

Shared code reused across both applications.

| Package               | Purpose                                               |
| --------------------- | ----------------------------------------------------- |
| `packages/api`        | tRPC api, business logic, route handlers              |
| `packages/auth`       | Authentication utilities, session helpers             |
| `packages/db`         | Drizzle ORM models, migrations, PostgreSQL connection |
| `packages/ui`         | Shared React UI components, styling                   |
| `packages/validators` | Zod validation schemas                                |

## 4. Tools

Contains build and development infrastructure.

| Directory          | Purpose                                             |
| ------------------ | --------------------------------------------------- |
| `tools/github`     | CI/CD workflow scripts (e.g., build, deploy)        |
| `tools/nginx`      | Reverse proxy configuration and certificates folder |
| `tools/typescript` | Shared tsconfig base presets                        |

## 5. Documentation

Located inside `docs/`:

| File/Folder            | Description                      |
| ---------------------- | -------------------------------- |
| `legal/`               | Legal documents                  |
| `architecture.md`      | System architecture overview     |
| `database.md`          | Database schema and details      |
| `deploy.md`            | Deployment steps                 |
| `docker.md`            | Container setup                  |
| `env.md`               | Environment variable reference   |
| `features.md`          | Feature descriptions             |
| `getting-started.md`   | Quickstart and setup guide       |
| `index.md`             | Home page of documentation       |
| `project-structure.md` | Current document                 |
| `roadmap.md`           | Feature roadmap and future plans |
| `todos.md`             | Pending tasks and todos          |

## 6. Build and Deployment

The system is containerized with Docker:

- Web + Dashboard + API packages deployed independently
- NGINX acts as a reverse proxy
- PostgreSQL database service included in docker-compose
- Resend used for transactional email

More details in: [docs/deploy.md](./deploy.md) and [docs/docker.md](./docker.md)

## 7. Turborepo

The monorepo uses Turborepo for:

- Task running and caching
- Workspace linking
- Isolation of build steps by packages/apps

Configuration file: `turbo.json`

## Summary

Yukinu is structured for:

- Modular development
- Code reusability between applications
- Clean separation of responsibility
- Scalable deployment and CI/CD automation

This structure ensures the system remains maintainable and extensible as new features are added.
