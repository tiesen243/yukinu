# DB

This package contains the database schema and the Drizzle client for the application.

## Features

- **Drizzle ORM**: A TypeScript ORM for building SQL queries.
- **Neon**: A serverless PostgreSQL database.
- **Database Schema**: Defines the database tables and their relationships.

## Schema

The database schema is defined in the `src/schema.ts` file and includes the following tables:

- `users`
- `accounts`
- `sessions`
- `addresses`
- `categories`
- `products`
- `orderItems`
- `orders`
- `cartItems`

## Getting Started

To get started with this package, you need to have a Neon database set up and the `DATABASE_URL` environment variable configured.
