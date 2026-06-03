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
  <a href="LICENSE">
    <img src="https://img.shields.io/github/license/tiesen243/yukinu" alt="License">
  </a>
  <a href="https://github.com/tiesen243/yukinu/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/tiesen243/yukinu" alt="Contributors">
  </a>
</p>

An open-source e-commerce platform that enables customers to discover, compare, and purchase products from multiple sellers in one place, with fast browsing, secure checkout, and a smooth user experience.

- [Web Preview](https://yukinu.vercel.app)
- [Dashboard Preview](https://yukinu-dashboard.vercel.app)
- [Documentation](https://tiesen243.github.io/yukinu)

Test accounts for the dashboard:

- Username: `tester`
- Password: `Test#12345678`

## Features

- **Multi-Vendor Support**: Allow multiple sellers to create their own storefronts and manage their products, orders, and inventory independently.
- **Product Catalog**: Provide a rich product catalog with support for categories, tags, and advanced search capabilities.
- **Shopping Cart and Checkout**: Enable customers to add products to their cart and complete their purchase with a secure and seamless checkout process.
- **Order Management**: Allow customers to view their order history and track the status of their orders, while vendors can manage incoming orders and update their status.
- **User Authentication**: Implement secure user authentication and authorization for both customers and vendors, with support for social login and password recovery.
- **Responsive Design**: Ensure a smooth and consistent user experience across all devices with a responsive design and intuitive user interface.
- **Scalability**: Build the platform with scalability in mind, using modern technologies and best practices to handle increasing traffic and data as the platform grows.

## Project Structure

```text
(root)
├── apps
│   ├── dashboard            # Admin dashboard for vendors and site administrators (React Router v7)
│   └── web                  # Customer-facing web application (Next.js 16)
├── docs                     # Documentation site built with Fumapress
├── packages
│   ├── api                  # tRPC API server and shared types
│   ├── auth                 # Authentication logic and utilities
│   ├── db                   # Database schema and Drizzle ORM setup
│   ├── email                # Email templates and Resend integration
│   ├── lib                  # Shared utilities and helper functions
│   ├── ui                   # Shared UI components and design system (Shadcn UI)
│   └── uploadthing          # File upload utilities and UploadThing integration
├── tools
│   ├── github               # GitHub Actions setup and related scripts for CI/CD
│   ├── oxc                  # Oxc configuration and related scripts for linting and code analysis
│   └── typescript           # TypeScript configuration and related scripts
├── docker-compose.yml       # Docker configuration for local development
├── package.json             # Root package.json for managing dependencies and scripts
└── turbo.json               # Turborepo configuration for managing the monorepo
```

## Getting Started

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
    cp apps/web/.env.example apps/web/.env
    cp apps/dashboard/.env.example apps/dashboard/.env
    ```

4.  **Set up the database:**

    ```bash
    docker compose up -d db
    bun --filter @yukinu/db run db:migrate
    ```

5.  **Start all applications:**

    ```bash
    bun run dev
    ```

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
