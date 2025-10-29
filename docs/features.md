---
nav_order: 4
---

# Features Overview

Yukinu is a multi-vendor e-commerce application designed for learning and experimentation.  
Some features are fully implemented, while others are under development.

## Completed

### Authentication & Users

- Email/password registration and login
- OAuth login (Google, Facebook)
- Profile editing
- Secure session handling
- Basic account validation using Zod

### Admin Features

- Admin dashboard for managing users
- View and update user roles and statuses

### Core Architecture

- Monorepo with Turborepo
- Web client (Next.js + React + Tailwind + shadcn/ui)
- Dashboard client (React Router + Tailwind)
- Modular API using tRPC
- Drizzle ORM with PostgreSQL
- Shared UI library

## In Progress

### Marketplace Foundation

- Vendor management (roles: owner, manager, staff)
- Vendor listings in dashboard
- Basic product browsing page

### Infrastructure

- Email service integration (Resend)
- Database indexing and relational optimizations

## Planned Features

### Marketplace

- Vendor onboarding and approval process
- Product CRUD and inventory management
- Product categories and collections
- Product variants (size, color, etc.)
- Product reviews and ratings

### Shopping Experience

- Search & filtering
- Shopping cart & wishlist
- Order creation & tracking
- Payment gateway integration (ex: Stripe)
- Delivery status tracking

### Advanced Admin

- Manage vendors and marketplaces
- Dashboard analytics for sales and insights

## Future Exploration

- SEO improvements for product pages
- Media CDN for product images
- Mobile app (React Native)
- Real-time updates for admin/vendor dashboards
- AI-powered recommendation system

> Note: Yukinu is a **learning project**, not a commercial service.  
> Some features may be simplified or changed during development.
