# yukinu

A modern full-stack application built with TypeScript and Turbo.

## Tech Stack

### Frontend

- **Next.js** - React framework for production
- **React Router** - Declarative routing for React

- **tRPC** - End-to-end typesafe APIs

### Database

- **Drizzle ORM** - TypeScript ORM with SQL-like syntax

### Authentication

- **Basic Auth** - Simple authentication implementation

### Build Tools

- **Turbo** - High-performance build system for JavaScript and TypeScript
- **TypeScript** - JavaScript with syntax for types
- **ESLint** - Linting utility for JavaScript and TypeScript
- **Prettier** - Opinionated code formatter
- **Bun** - Package manager

## Getting Started

1. Clone the repository

```bash
git clone git@github.com:your-username/yukinu.git
cd yukinu
```

2. Install dependencies:

```bash
bun install
```

3. Set up your environment variables:

```bash
cp .env.example .env
```

4. Set up the database:

```bash
bun run db:push
```

5. Start the development server:

```bash
bun run dev
```

## Project Structure

```text
yukinu/
├── apps/                    # Applications
│   ├── nextjs/              # Nextjs app
│   └── react-router/        # React-router app
├── packages/                # Shared packages
│   ├── api/                 # tRPC API package
│   ├── db/                  # Database package
│   ├── ui/                  # Shared shadcn/ui components
│   └── validators/          # Shared validation schemas
├── tools/                   # Build tools and configurations
│   ├── eslint/              # ESLint configuration
│   ├── github/              # GitHub Actions workflows for CI/CD
│   ├── prettier/            # Prettier configuration
│   └── typescript/          # TypeScript configuration
├── turbo.json               # Turbo configuration
└── package.json             # Root package.json
```

## Database

This project uses Drizzle ORM for database operations.

### Database Commands

```bash
# Push schema changes to database
cd packages/db
bun run db:push

# Open Drizzle Studio
cd packages/db
bun run db:studio
```

## Authentication

Basic authentication implementation for simple use cases.

## Additional Features

- **GitHub Actions** - CI/CD pipeline with type checking, linting, and formatting

## Scripts

```bash
# Development
bun run dev          # Start development server
bun run build        # Build for production

# Code Quality
bun run lint         # Run ESLint
bun run typecheck    # Run TypeScript checks

# Database
bun run db:push       # Push schema changes
bun run db:studio     # Open database studio
```
