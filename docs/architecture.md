---
title: 2. Architecture
description: An in-depth overview of the technical architecture, directory structure, and database design of the Yukinu Multi-Vendor E-commerce platform.
---

# Monorepo Architecture

This document provides a deep dive into the technical design, directory structure, and database relational models of the Yukinu Multi-Vendor platform.

The project is structured as a Monorepo managed by Turborepo and powered by Bun. Code splitting is organized into public-facing applications and internal domain-driven packages.

## Architectural Blueprint

The architecture isolates the client applications from raw infrastructure mutations. Apps handle routing and user interactions, while internal packages govern core business logic, type definitions, and database queries.

```mermaid
graph TD
    subgraph Frontend Applications
        A1[Web App (Next.js 16)]
        A2[Vendor Dashboard (React Router v7)]
    end

    subgraph Backend Services
        B1[tRPC API]
        B2[Authentication Service]
        B3[Database Service (Drizzle ORM)]
    end

    subgraph Shared Packages
        C1[UI Library (Shadcn UI)]
        C2[Libraries & Utilities]
        C3[Email Service (Resend)]
        C4[File Storage (Uploadthing)]
    end

    A1 --> B1
    A2 --> B1

    B1 --> B2
    B1 --> B3

    A1 --> C1
    A2 --> C1
    A3 --> C1
    B1 --> C2
    B1 --> C3
    B1 --> C4
```

### Technology Stack

| Layer                 | Technology Choices            |
| --------------------- | ----------------------------- |
| Web Application       | Next.js 16, Tailwind CSS      |
| Dashboard Application | React Router v7, Tailwind CSS |
| API Layer             | tRPC, Zod                     |
| Database              | PostgreSQL, Drizzle ORM       |
| Authentication        | From scratch                  |
| Payment Processing    | Sepay (Bank Transfer)         |
| Email Service         | Resend                        |
| File Storage          | UploadThing                   |
| UI Library            | Shadcn UI                     |
| Containerization      | Docker, Docker Compose        |

## Core Workspace Packages

### 1. `@yukinu/db` (Data Layer Schema)

The database layer uses **Drizzle ORM** communicating with a PostgreSQL instance. It is designed around relational integrity with explicit conditional indexing.

#### Global Infrastructure Columns

To enforce consistency across the ecosystem, tables share lifecycle tracking variables:

- `createdAt`: Automatically initialized via `.defaultNow()`.
- `updatedAt`: Programmatically updated on item changes using the custom `.$onUpdate(() => new Date())` execution hook.
- `deletedAt`: Supports application-level soft-deletes.

#### Identity & Access Control

- **`users` & `profiles**`: Built using standard 24-character IDs (`varchar(24)`) linked together via cascading foreign keys (`onDelete: 'cascade'`).
- **`user_role` Enum**: Governs platform permissions across 5 rigid tiers: `user`, `admin`, `moderator`, `vendor_owner`, and `vendor_staff`.
- **`vendor_staffs`**: A junction table map implementing a composite primary key over `[vendorId, userId]` to handle multi-employee store management scenarios.

## E-Commerce & Transaction Architecture

Your real-world schema features highly advanced constraints engineered to prevent typical transactional edge-cases.

### A. Integrity In The Shopping Cart

The `cart_items` architecture uses a smart conditional unique index workflow via a custom SQL check. This prevents a user from accidentally creating redundant rows for identical items:

- **Standard Items:** A unique constraint is checked on `[userId, productId]` _only_ when a variation is omitted (`where(isNull(t.productVariantId))`).
- **Variant Configurations:** An independent constraint checks `[userId, productVariantId]` when variations exist (`where(isNotNull(t.productVariantId))`).
- **Quantity Safety:** A hard table check constraint (`cart_items_quantity_check`) guarantees quantities remain greater than zero (`quantity > 0`).

### B. Single-Payment Multi-Vendor Orders

Rather than relying on complex parent-to-child order tables, Yukinu maps multi-vendor groupings directly through its relationship with payment tokens.

```text
               ┌─── [ Order 1001 ] ──> (Vendor A) ──> Total Amount
               │
[ Payments ] ──┼─── [ Order 1002 ] ──> (Vendor B) ──> Total Amount
               │
               └─── [ Order 1003 ] ──> (Vendor C) ──> Total Amount

```

1. When checking out a multi-vendor cart, a single global `payments` record is logged specifying the chosen `payment_method` (e.g., `bank_transfer`, `cash_on_delivery`).
2. The engine splits the transaction into distinct rows inside the `orders` table. **Every order row is strictly bound to exactly one vendor (`vendorId`) and one payment (`paymentId`)**.
3. Financial ledgers are kept clear because `unitPrice` and `quantity` are duplicated directly into immutable snapshots within `order_items` at the moment of checkout, shielding historical transaction receipts from future product modifications.

## Ledger Control & Financial Tracking

Yukinu implements two core modules inside `@yukinu/db` to maintain balance sheets for independent vendors safely.

### Vendor Balances

The `vendor_balances` table serves as a single source of truth for an operating storefront's outstanding funds. It uses high-precision types (`numeric({ precision: 10, scale: 2 })`) and maps changes using a restrictive foreign key constraint (`onDelete: 'restrict'`). This layout prevents deletion of a vendor profile if it contains active balances.

### Transaction Auditing

Every raw banking webhook event (such as inbound SePay callbacks) records an immutable log inside the `transactions` table.

- To prevent duplicate ledger deposits, the system enforces a strict **`uniqueIndex`** over the bank's processing ID field (`referenceNumber`).
- Once verified, adjustments are pushed out via `vendor_transfers` using `amountIn` or `amountOut` metrics to correctly audit the vendor balance updates.

## Request Pipeline & Security Middlewares

To protect sensitive administration vectors in a multi-vendor setup, the tRPC router implements progressive validation filters based directly on your database enums.

```text
[ Incoming Request ] ──> [ Public Procedure ]
                               │
                               ▼ (Validates Session & userStatusEnum == 'active')
                         [ Protected Procedure ]
                               │
                               ▼ (Validates userRoleEnum matches Vendor / Owner)
                         [ Vendor Staff Procedure ]

```
