# Yukinu 🛒

A modern, full-stack e-commerce platform built with cutting-edge technologies and a monorepo architecture. Yukinu provides multiple frontend implementations, a robust backend API, and a comprehensive admin dashboard for managing online stores.

## 🌟 Overview

Yukinu is a complete e-commerce ecosystem featuring:

- **Multiple Frontend Options**: Choose from Next.js, Vue.js, or React Router implementations
- **Type-Safe Backend**: tRPC API with end-to-end type safety
- **Admin Dashboard**: Comprehensive management interface for products, orders, and customers
- **Modern Design System**: shadcn/ui components with Tailwind CSS
- **Authentication & Security**: Multi-provider auth with CSRF protection and rate limiting
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations

## 🏗️ Architecture

This monorepo contains multiple applications and shared packages:

### 🚀 Applications

#### [Kaze](./apps/kaze) - Next.js Customer Frontend

- **Framework**: Next.js 15 with App Router and React 19
- **Features**: Server-side rendering, SEO optimization, marketing pages
- **Port**: `3000`
- **Best for**: Production e-commerce sites requiring excellent SEO

#### [Pepe](./apps/pepe) - React Router Admin Dashboard

- **Framework**: React Router 7 with React 19
- **Features**: Admin panel, product management, order processing, analytics
- **Port**: `3001`
- **Best for**: Store management and administrative tasks

#### [Goldenglow](./apps/goldenglow) - Vue.js Customer Frontend

- **Framework**: Vue 3 with Composition API and Vite
- **Features**: Reactive interfaces, fast development, modern Vue patterns
- **Port**: `3002`
- **Best for**: Teams preferring Vue.js ecosystem and rapid prototyping

### 📦 Shared Packages

#### [API](./packages/api) - tRPC Backend

- Type-safe API with authentication, products, orders, cart, and address management
- Built with tRPC, Drizzle ORM, and PostgreSQL

#### [Auth](./packages/auth) - Authentication System

- Multi-provider authentication (Google, Facebook, Credentials)
- Session management, CSRF protection, and rate limiting

#### [Database](./packages/db) - Data Layer

- PostgreSQL with Drizzle ORM
- Complete e-commerce schema with relationships

#### [UI](./packages/ui) - Design System

- shadcn/ui components with Tailwind CSS
- Consistent design across all applications

#### [Validators](./packages/validators) - Validation Schemas

- Zod schemas for type-safe validation
- Shared across API, frontend, and database operations

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ or **Bun** runtime
- **PostgreSQL** database (local or Neon)
- **Git** for version control

### Installation

1. **Clone the repository:**

   ```bash
   git clone git@github.com:tiesen243/yukinu.git
   cd yukinu
   ```

2. **Install dependencies:**

   ```bash
   bun install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   # Edit .env with your database URL and other settings
   ```

4. **Set up the database:**

   ```bash
   cd packages/db
   bun run db:push
   ```

5. **Start development servers:**

   ```bash
   # Start all applications
   bun run dev

   # Or start individual applications
   bun run dev -F @yuki/kaze...       # Next.js frontend
   bun run dev -F @yuki/goldenglow... # Vue.js frontend
   bun run dev -F @yuki/pepe...       # Admin dashboard
   ```

### Access Your Applications

- **Kaze (Next.js)**: http://localhost:3000
- **Pepe (Admin)**: http://localhost:3001
- **Goldenglow (Vue.js)**: http://localhost:3002

## 🛠️ Tech Stack

### Frontend Technologies

- **Next.js 15** - React framework with App Router and server components
- **Vue 3** - Progressive JavaScript framework with Composition API
- **React Router 7** - Declarative routing with server-side rendering
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework

### Backend & API

- **tRPC** - End-to-end typesafe APIs
- **Drizzle ORM** - TypeScript ORM with SQL-like syntax
- **PostgreSQL** - Robust relational database
- **Neon** - Serverless PostgreSQL platform

### Authentication & Security

- **Multi-Provider Auth** - Google, Facebook, and credentials
- **Session Management** - Secure JWT-based sessions
- **CSRF Protection** - Cross-site request forgery prevention
- **Rate Limiting** - API abuse protection

### Design & UI

- **shadcn/ui** - High-quality React components
- **Radix UI** - Unstyled, accessible component primitives
- **Lucide Icons** - Beautiful SVG icon library
- **Responsive Design** - Mobile-first approach

### Build Tools & DevOps

- **Turborepo** - High-performance build system
- **Bun** - Fast JavaScript runtime and package manager
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **GitHub Actions** - CI/CD pipeline

## 📁 Project Structure

```
yukinu/
├── apps/                         # Frontend applications
│   ├── kaze/                     # 🌪️ Next.js customer frontend
│   │   ├── app/                  # Next.js App Router pages
│   │   ├── lib/                  # Utilities and configurations
│   │   └── trpc/                 # tRPC client setup
│   ├── goldenglow/               # 🌟 Vue.js customer frontend
│   │   ├── src/
│   │   │   ├── components/       # Vue components
│   │   │   ├── routes/           # Application routes
│   │   │   └── api/              # tRPC client
│   │   └── vite.config.ts
│   └── pepe/                     # 🐸 React Router admin dashboard
│       ├── src/
│       │   ├── routes/           # Admin pages and functionality
│       │   ├── lib/              # Utilities
│       │   └── trpc/             # tRPC client
│       └── react-router.config.ts
│
├── packages/                     # Shared packages
│   ├── api/                      # 🚀 tRPC API server
│   │   ├── src/routers/          # API route definitions
│   │   └── src/trpc.ts           # tRPC configuration
│   ├── auth/                     # 🔐 Authentication system
│   │   ├── src/providers/        # OAuth provider configs
│   │   └── src/react.tsx         # React auth hooks
│   ├── db/                       # 🗄️ Database layer
│   │   ├── src/schema.ts         # Database schema
│   │   └── drizzle.config.ts     # Drizzle configuration
│   ├── ui/                       # 🎨 Design system
│   │   ├── src/components/       # shadcn/ui components
│   │   └── src/lib/utils.ts      # Utility functions
│   └── validators/               # ✅ Validation schemas
│       └── src/                  # Zod validation schemas
│
├── tools/                        # Development tools
│   ├── eslint/                   # ESLint configurations
│   ├── prettier/                 # Prettier configuration
│   ├── typescript/               # TypeScript configurations
│   └── github/                   # GitHub Actions workflows
│
├── turbo.json                    # Turborepo configuration
├── package.json                  # Root dependencies and scripts
└── .env.example                  # Environment variables template
```

## 🎯 Features

### E-commerce Functionality

- **Product Catalog** - Browse, search, and filter products
- **Shopping Cart** - Add, remove, and manage cart items
- **Order Management** - Complete checkout and order tracking
- **User Accounts** - Registration, authentication, and profiles
- **Address Management** - Shipping and billing addresses
- **Admin Dashboard** - Comprehensive store management

### Technical Features

- **Type Safety** - End-to-end TypeScript with runtime validation
- **Real-time Updates** - Live inventory and order status updates
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **SEO Optimized** - Server-side rendering and meta tag management
- **Performance** - Code splitting, lazy loading, and caching
- **Accessibility** - WCAG compliant components and navigation

### Developer Experience

- **Hot Reload** - Instant feedback during development
- **Type Generation** - Automatic API type generation
- **Code Quality** - ESLint, Prettier, and TypeScript checks
- **Testing Ready** - Structured for unit and integration tests
- **CI/CD Pipeline** - Automated testing and deployment

## 🔧 Development Scripts

### Global Commands (from root)

```bash
# Development
bun run dev              # Start all applications in development mode
bun run build            # Build all applications for production
bun run start            # Start all applications in production mode

# Code Quality
bun run lint             # Run ESLint across all packages
bun run typecheck        # Run TypeScript checks
bun run format           # Format code with Prettier

# Workspace Management
bun run clean            # Clean all build artifacts
```

### Application-Specific Commands

```bash
# Run commands for specific applications
bun run dev -F @yuki/kaze...           # Start only Next.js app
bun run dev -F @yuki/pepe...           # Start only admin dashboard
bun run dev -F @yuki/goldenglow...     # Start only Vue.js app

# Build specific applications
bun run build -F @yuki/kaze...         # Build Next.js app
bun run build -F @yuki/api...          # Build API package
```

### Database Commands

```bash
cd packages/db

# Database operations
bun run db:push          # Push schema changes to database
bun run db:studio        # Open Drizzle Studio (database GUI)
```

## 🌐 Environment Configuration

Create a `.env` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/yukinu"

# OAuth Providers
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
AUTH_FACEBOOK_ID="your-facebook-app-id"
AUTH_FACEBOOK_SECRET="your-facebook-app-secret"
```

## 🚢 Deployment

### Database Setup

1. Create a PostgreSQL database ([neon](https://neon.tech) )
2. Update `DATABASE_URL` in your environment
3. Run migrations: `bun run db:push`

### Application Deployment

Each application can be deployed independently:

- **Kaze (Next.js)**: Deploy to Vercel, Netlify, or any Node.js hosting
- **Goldenglow (Vue.js)**: Deploy to Vercel, Netlify, or static hosting
- **Pepe (Admin)**: Deploy to any Node.js hosting platform

### Recommended Deployment Stack

- **Frontend**: Vercel or Netlify
- **Database**: Neon
- **Environment**: Production environment variables
- **Domain**: Custom domain with SSL

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests
4. **Run quality checks**: `bun run lint && bun run typecheck`
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new functionality
- Update documentation for API changes
- Ensure all applications work with your changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com) for the beautiful component library
- [tRPC](https://trpc.io) for type-safe API development
- [Drizzle ORM](https://orm.drizzle.team) for the excellent TypeScript ORM
- [Turborepo](https://turbo.build/repo) for the monorepo build system

---

**Built by [Tiesen](https://tiesen.id.vn)**
