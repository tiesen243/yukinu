---
nav_order: 7
---

# Database Documentation

This document provides an overview of Yukinu's PostgreSQL database design and implementation using Drizzle ORM.

## Technology Stack

- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Migrations**: Drizzle Kit
- **Validation**: Zod

## Core Database Concepts

Yukinu follows a **multi-vendor e-commerce model**, where:

- One system can have multiple vendors
- Each vendor manages their own products, orders, and customers

Data is structured to maintain isolation and scalability.

## Main Entities

### 1. Users

Stores authentication + customer profile information.

- A user can also be a vendor owner.
- Supports social login (Google, Facebook).

### 2. Vendors

Each vendor has:

- Branding information
- Policies
- Multiple product collections

### 3. Products

Includes:

- Pricing
- Inventory management
- Product reviews
- Category / Collection relationship

### 4. Orders

Tracks:

- Customer purchases
- Order status lifecycle
- Payment state

### 5. Payments

Stores completed payment metadata.
Future extensions support external processors.

### 6. Wishlist

Allows users to save products they like.

### 7. Addresses

Shipping & billing address management.

## Entity Relationship Model (ERD)

To be added: ERD Diagram showing relationships between:
Users ↔ Vendors ↔ Products ↔ Orders ↔ Payments

(We can generate a full ERD image based on the Drizzle schema if needed.)

## Migrations

Run migration commands using Drizzle Kit:

```bash
bun db:generate
bun db:migrate
```

Migration history stored under:

```
packages/db/drizzle
```

## Deployment Notes

- PostgreSQL service is defined in Docker Compose
- Enable SSL only in production
- Neon support when deploying Web to Vercel
