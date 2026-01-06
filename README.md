# Yukinu – Multi-Vendor E-commerce Platform

<p align="center">
  <a href="https://github.com/tiesen243/yukinu/actions/workflows/release.yml">
    <img src="https://github.com/tiesen243/yukinu/actions/workflows/release.yml/badge.svg" alt="Release">
  </a>
  <a href="https://github.com/tiesen243/yukinu/actions/workflows/ci.yml">
    <img src="https://github.com/tiesen243/yukinu/actions/workflows/ci.yml/badge.svg" alt="CI">
  </a>
  <a href="https://github.com/tiesen243/yukinu/releases?q=web">
    <img src="https://img.shields.io/github/package-json/v/tiesen243/yukinu/dev?filename=apps/web/package.json&label=version@web" alt="Version Web">
  </a>
  <a href="https://github.com/tiesen243/yukinu/releases?q=dashboard">
    <img src="https://img.shields.io/github/package-json/v/tiesen243/yukinu/dev?filename=apps/dashboard/package.json&label=version@dashboard" alt="Version Dashboard">
  </a>
  <a href="https://github.com/tiesen243/yukinu/releases?q=mobile">
    <img src="https://img.shields.io/github/package-json/v/tiesen243/yukinu/dev?filename=apps/mobile/package.json&label=version@mobile" alt="Version Mobile">
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
- **Mobile App**
  - React Native, Expo, TailwindCSS (via Uniwind)
  - tRPC client integration

### Backend & Shared Services

- **API**: tRPC (type-safe communication)
- **ORM**: Drizzle ORM + PostgreSQL
- **Validation**: Zod
- **Email Service**: Resend
- **File Storage**: UploadThing

## Monorepo Structure

```
(root)
├── apps
│   ├── dashboard        # Vendor/Admin dashboard
│   ├── mobile           # Customer-facing mobile app
│   └── web              # Customer-facing web app
├── packages
│   ├── api              # tRPC API package
│   ├── auth             # Authentication utilities
│   ├── db               # Drizzle + DB models + queries
│   ├── email            # Email service (Resend)
│   ├── lib              # Shared utilities/helpers
│   ├── ui               # Shared UI components (shadcn/ui)
│   ├── uploadthing      # File upload service
│   └── validators       # Zod validators
├── tools
│   ├── github           # Github workflows/scripts
│   ├── nginx            # Deployment config
│   └── typescript       # TS base configs
├── docs                 # Developer & legal documentation
└── docker-compose.yml   # Local deployment (NGINX + Postgres + Apps)
```

## Getting Started

### Prerequisites

- Node.js (v24 or later)
- Bun (package manager)
- Docker & Docker Compose (for local development)

### Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:tiesen243/yukinu.git
   cd yukinu
   ```

2. Install dependencies using Bun:

   ```bash
   bun install --frozen-lockfile
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   # Edit .env to add your configuration
   ```

4. Start the database using Docker Compose:

   ```bash
   docker-compose up -d db
   # or
   bun start:db
   ```

5. Run database migrations:

   ```bash
   bun run db:migrate
   ```

6. Start the development server:

- For Web and Dashboard:

  ```bash
  bun dev
  ```

  - Web App: http://localhost:3000
  - Dashboard: http://localhost:5173

- For Mobile App:

  ```bash
  cd apps/mobile
  bun start
  ```

  Use Expo Go to run the mobile app on your device or simulator.

## Deployment

1. Web and Dashboard

   **1.1. Docker Deployment**
   - Clone the repository to your server or VPS.
   - Build and start the web and dashboard apps with Docker Compose:
     ```bash
     docker compose up --build -d web dashboard
     ```

   **1.2. Vercel Deployment**
   - Connect your GitHub repository to Vercel.
   - Configure environment variables in the Vercel dashboard.

2. Mobile App

   Follow the official Expo guide for building and deploying the mobile app: [Create a release build locally](https://docs.expo.dev/guides/local-app-production/)

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING](./.github/CONTRIBUTING.md) guide for details on how to get started.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
