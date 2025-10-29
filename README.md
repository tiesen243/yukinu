# Yukinu

<p align="center">
  <a href="https://github.com/tiesen243/yukinu/actions/workflows/release.yml">
    <img src="https://github.com/tiesen243/yukinu/actions/workflows/release.yml/badge.svg" alt="Release">
  </a>
  <a href="https://github.com/tiesen243/yukinu/releases">
    <img src="https://img.shields.io/github/package-json/v/tiesen243/yukinu/dev?filename=apps/web/package.json&label=version@web" alt="Version Web">
  </a>
  <a href="https://github.com/tiesen243/yukinu/releases">
    <img src="https://img.shields.io/github/package-json/v/tiesen243/yukinu/dev?filename=apps/dashboard/package.json&label=version@dashboard" alt="Version Web">
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/github/license/tiesen243/yukinu" alt="License">
  </a>
  <a href="https://github.com/tiesen243/yukinu/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/tiesen243/yukinu" alt="Contributors">
  </a>
</p>

This project is a **Multi-Vendor E-commerce Platform** built using a **Turborepo** monorepo architecture.
It includes multiple applications and shared packages for efficient development, scalability, and maintainability.

## Tech Stack

### Apps

- **Web App**
  - Next.js, React.js, TailwindCSS
  - tRPC client integration
  - Dockerized for deployment
- **Dashboard**
  - React, React Router, TailwindCSS
  - Admin vendor dashboard
  - Dockerized for deployment

### Backend & Shared Services

- **API**: tRPC (type-safe communication)
- **ORM**: Drizzle ORM + PostgreSQL
- **Validation**: Zod
- **Email Service**: Resend
- **Deployment**: Docker + Nginx Reverse Proxy

## Monorepo Structure

```
(root)
├── apps
│   ├── dashboard        # Vendor/Admin dashboard
│   └── web              # Customer-facing web app
├── packages
│   ├── api              # tRPC API package
│   ├── auth             # Authentication utilities
│   ├── db               # Drizzle + DB models + queries
│   ├── ui               # Shared UI components (shadcn)
│   └── validators       # Zod validators
├── tools
│   ├── eslint           # ESLint configs
│   ├── github           # Github workflows/scripts
│   ├── nginx            # Deployment config
│   ├── prettier         # Prettier configs
│   └── typescript       # TS base configs
├── docs                 # Developer & legal documentation
└── docker-compose.yml   # Local deployment (NGINX + Postgres + Apps)
```

## Package Management

This repo uses **Turborepo** for task running and **Bun** for package management.

Useful commands:

```sh
bun install
bun run dev
bun run build
bun run lint
```

## Deployment

This system is deployed using Docker Compose & Nginx reverse proxy.

Config files:

- docker-compose.yml
- tools/nginx/default.conf

## Security & Validation

- Zod is used across API and data models for **type-safe validation**
- Shared authentication logic stored in `packages/auth`

## Documentation

Located in `/docs` folder:

- Deployment guide
- Project structure
- Privacy Policy & Terms of Service

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
