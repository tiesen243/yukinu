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

An open-source, multi-vendor e-commerce platform built with a modern, type-safe technology stack. It enables buyers to shop from multiple sellers in a unified marketplace.

## Links

- **[Live Web App](https://yukinu.vercel.app)**
- **[Live Dashboard](https://yukinu-dashboard.vercel.app)**
- **[Project Documentation](https://tiesen243.github.io/yukinu)**
- **[Mobile App Releases](https://github.com/tiesen243/yukinu/releases?q=mobile)**

## Key Features

- **For Customers**: Unified shopping cart, advanced search and filtering, wishlists, order tracking, and vendor discovery.
- **For Vendors**: A dedicated dashboard for product management (including variants), order processing, and staff management.
- **For Administrators**: A central dashboard to manage users, approve vendors, moderate content, and manage product categories.
- **Type-safe**: End-to-end type safety with tRPC and Zod, ensuring robust and error-resistant code.
- **Modern Stack**: Built with Next.js, React, and TailwindCSS, running on a Bun-powered monorepo.
- **Scalable**: The monorepo architecture, managed by Turborepo, allows for efficient code sharing and independent scaling of services.

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

Full setup instructions are available in the **[Development Setup Guide](https://tiesen243.github.io/yukinu/development-setup)**.

### Quick Start

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/tiesen243/yukinu.git
    cd yukinu
    ```

2.  **Install dependencies:**

    ```bash
    bun install
    ```

3.  **Set up environment variables:**

    ```bash
    cp .env.example .env
    # Edit the .env file with your credentials
    ```

4.  **Start the database:**

    ```bash
    bun run db:start
    ```

5.  **Apply the database schema:**

    ```bash
    bun run db:push
    ```

6.  **Start all applications:**
    ```bash
    bun run dev
    ```

## Deployment

### 1. Web and Dashboard

#### 1.1. Docker Deployment

- Clone the repository to your server or VPS.
- Build and start the web and dashboard apps with Docker Compose:
  ```bash
  docker compose up --build -d web dashboard
  ```

#### 1.2. Vercel Deployment

- Connect your GitHub repository to Vercel.
- Configure environment variables in the Vercel dashboard.

### 2. Mobile App

Follow the official Expo guide for building and deploying the mobile app: [Create a release build locally](https://docs.expo.dev/guides/local-app-production/)

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING](./.github/CONTRIBUTING.md) guide for details on how to get started.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
