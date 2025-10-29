---
nav_order: 2
---

# Architecture

This document describes the software architecture of Yukinu – a multi-vendor e-commerce platform.  
The system is under active development and currently focuses on core user management features.

## 1. Tech Stack

### Frontend

#### Web

- Next.js (App Router)
- TailwindCSS
- Shadcn/UI

#### Dashboard

- React Router
- TailwindCSS
- Shadcn/UI

### Backend

- tRPC
- Server actions

### Database

- PostgreSQL
- Drizzle ORM

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

| Module            | Status      | Notes                                    |
| ----------------- | ----------- | ---------------------------------------- |
| Authentication    | Completed   | Local + OAuth login/register             |
| User Profile      | Completed   | Update profile information               |
| Admin Panel       | In Progress | Admin can manage users                   |
| Vendor System     | Planned     | Vendor registration and onboarding       |
| Product Catalog   | Planned     | CRUD products, images, variants          |
| Checkout & Orders | Planned     | Cart, checkout, payment, order lifecycle |
| Review System     | Planned     | Ratings and comments                     |

## 4. Security Model

- Password hashing using Scrypt
- Role-based authorization: User, Vendor, Admin
- Sessions via secure HttpOnly cookies
- Schema validation using Zod

## 5. Database Schema Overview

Drizzle schema includes:

- User
- Account (OAuth)
- Session
- Vendor
- Product
- Order
- Review

More details in: [database.md](./database.md)

## 6. CI/CD

- GitHub Actions for testing, linting, database migrations
- Automatic deployment to Vercel or Docker-based hosting
