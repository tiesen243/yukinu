# Architecture

This document describes the software architecture of Yukinu – a multi-vendor e-commerce platform.  
The system is under active development and currently focuses on core user management features.

## 1. Tech Stack

### Frontend

- Next.js (App Router)
- React Router V7
- TailwindCSS
- shadcn/ui

### Backend

- Next.js API Routes (Server Actions planned)
- tRPC

### Database

- PostgreSQL
- Prisma ORM

### Deployment (planned options)

- Vercel
- Docker

## 2. System Overview

Yukinu is built as a modular, scalable architecture.  
Future evolution to microservices is considered.

Architecture layers:

- Client (Next.js UI)
- Backend (API routes, business logic, authentication)
- Database (PostgreSQL + Drizzle)

## 3. Domain Modules

| Module            | Status    | Notes                                    |
| ----------------- | --------- | ---------------------------------------- |
| Authentication    | Completed | Local + OAuth login/register             |
| User Profile      | Completed | Update profile information               |
| Admin Panel       | Completed | Admin can manage users                   |
| Vendor System     | Planned   | Vendor registration and onboarding       |
| Product Catalog   | Planned   | CRUD products, images, variants          |
| Checkout & Orders | Planned   | Cart, checkout, payment, order lifecycle |
| Review System     | Planned   | Ratings and comments                     |

## 4. Security Model

- Password hashing using Scrypt
- Role-based authorization: User, Vendor, Admin
- Sessions via secure HttpOnly cookies
- (Planned) Schema validation using Zod

## 5. Database Schema Overview

Prisma schema includes:

- User
- Account (OAuth)
- Session
- Vendor (planned)
- Product (planned)
- Order (planned)
- Review (planned)

More details in: [database.md](./database.md)

## 6. Scaling Plan

Development phase:

- Monolithic Next.js application

MVP:

- Serverless compute deployment

Growth:

- Potential modularization into microservices (e.g. Vendor Service, Order Service)

## 7. CI/CD (Planned)

- GitHub Actions for testing, linting, database migrations
- Automatic deployment to Vercel or Docker-based hosting
