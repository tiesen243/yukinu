# Yukinu – Multi-Vendor E-commerce Platform

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

An e-commerce platform that enables customers to discover, compare, and purchase products from multiple sellers in one place, with fast browsing, secure checkout, and a smooth user experience

## Tech Stack

### Apps

- **Web App**
  - Next.js, React.js, TailwindCSS
  - tRPC client integration
- **Dashboard**
  - React, React Router, TailwindCSS
  - tRPC client integration

### Backend & Shared Services

- **API**: tRPC (type-safe communication)
- **ORM**: Drizzle ORM + PostgreSQL
- **Validation**: Zod
- **Email Service**: Resend

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
│   ├── email            # Email service (Resend)
│   ├── lib              # Shared utilities/helpers
│   ├── ui               # Shared UI components (shadcn/ui)
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

## Deployment

### Docker Deployment

This system is deployed using Docker Compose & Nginx reverse proxy.

Config files:

- docker-compose.yml
- tools/nginx/default.conf

### Vercel Deployment

The web app and dashboard can also be deployed to Vercel directly from the monorepo.

## Documentation

Located in `/docs` folder:

- Deployment guide
- Project structure
- Privacy Policy & Terms of Service

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
