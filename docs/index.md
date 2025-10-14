---
title: Yukinu - E-commerce Platform Monorepo
nav_order: 1
---

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

**Yukinu** is an e-commerce platform built as a **monorepo** with [Turborepo](https://turbo.build/repo). It includes both a **customer-facing storefront** and an **admin dashboard**, sharing code for UI, API, and database.

## Tech Stack

- **Runtime & Package Manager**: [Bun](https://bun.sh/)
- **Monorepo Management**: [Turborepo](https://turbo.build/repo)
- **Frontend**: [Next.js](https://nextjs.org/), [React Router](https://reactrouter.com/), [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: [tRPC](https://trpc.io/), [Drizzle ORM](https://orm.drizzle.team/), [PostgreSQL](https://www.postgresql.org/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/), [Shadcn UI](https://ui.shadcn.com/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or higher)
- [Bun](https://bun.sh/) (version 1.2.20 or higher)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/tiesen243/yukinu.git
   cd yukinu
   ```

2. Install dependencies using Bun:

   ```bash
   bun install
   ```

3. Set up environment variables:

   You need to create a `.env` file in the root of the project. You can copy the `.env.example` file and rename it to `.env`.

   ```bash
   cp .env.example .env
   ```

4. Start the database using Docker Compose:

   ```bash
   docker-compose up db -d
   ```

5. Run database migrations:

   ```bash
   bun run db:migrate
   ```

6. Start the development server:

   ```bash
   bun run dev

   # or
   bun run dev -F @yukinu/web...
   bun run dev -F @yukinu/dashboard...
   ```

7. Open your browser and navigate to:
   - Web: `http://localhost:3000`
   - Dashboard: `http://localhost:3001`

## Available Commands

- `bun run dev` – Run all apps in dev mode
- `bun run build` – Build all apps and packages
- `bun run lint` – Run linting across the repo
- `bun run format` – Format code using Prettier

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
