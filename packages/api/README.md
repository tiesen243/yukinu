# API

This package contains the tRPC API for the application.

## Features

- **tRPC API**: End-to-end typesafe APIs.
- **Authentication**: Handles user sign-up, password changes, and session management.
- **Database**: Uses Drizzle ORM for database access.
- **Validation**: Uses Zod for input validation.

## Routers

The API is organized into the following routers:

- **`address`**: Manages user addresses.
- **`auth`**: Handles user authentication.
- **`cart`**: Manages the user's shopping cart.
- **`order`**: Manages user orders.
- **`product`**: Manages products.

## Procedures

The API exposes two types of procedures:

- **`publicProcedure`**: Accessible to all users.
- **`protectedProcedure`**: Requires authentication.

## Getting Started

To get started with this package, you need to have a database set up and the required environment variables configured.