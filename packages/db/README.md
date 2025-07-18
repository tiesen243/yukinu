# DB 🗄️

A type-safe database package for the Yukinu e-commerce platform. This package provides the complete database schema, connection management, and ORM utilities using Drizzle ORM with PostgreSQL for robust data persistence.

## 📋 Description

The DB package serves as the data layer foundation for the entire Yukinu e-commerce ecosystem. It defines the complete database schema for users, products, orders, and all related entities, while providing type-safe database operations through Drizzle ORM. The package is designed to work seamlessly with serverless PostgreSQL databases like Neon.

## ✨ Features

### Database Management

- **Complete E-commerce Schema**: All tables for a full e-commerce platform
- **Type-Safe Operations**: Full TypeScript integration with Drizzle ORM
- **Relationship Management**: Proper foreign keys and table relationships
- **Migration Support**: Database schema versioning and migrations
- **Connection Pooling**: Efficient database connection management

### E-commerce Schema

- **User Management**: Users, accounts, and authentication sessions
- **Product Catalog**: Products, categories, and inventory management
- **Shopping Experience**: Shopping carts and saved items
- **Order Processing**: Orders, order items, and fulfillment tracking
- **Address Management**: User shipping and billing addresses

### Technical Features

- **Drizzle ORM**: Modern TypeScript-first ORM
- **PostgreSQL**: Robust relational database with ACID compliance
- **Neon Integration**: Serverless PostgreSQL for scalability
- **Schema Validation**: Runtime schema validation and type checking
- **Query Builder**: Fluent API for complex database queries

## 🚀 Getting Started

### Prerequisites

- PostgreSQL database (Neon recommended for production)
- Environment variables configured

### Installation

The package is included in the workspace. Set up your database connection:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@host:port/database"

# For Neon (recommended)
DATABASE_URL="postgresql://user:pass@host.neon.tech/yukinu?sslmode=require"
```

### Database Setup

1. **Push schema to database:**

   ```bash
   cd packages/db
   bun db:push
   ```

2. **Open Drizzle Studio (optional):**
   ```bash
   bun db:studio
   ```

### Available Scripts

- `bun db:push` - Push schema changes to the database
- `bun db:studio` - Open Drizzle Studio for database management
- `bun dev` - Run TypeScript compiler in watch mode
- `bun build` - Build the package for production
- `bun typecheck` - Run TypeScript type checking
- `bun lint` - Run ESLint for code quality
- `bun format` - Check code formatting with Prettier

## 🏗️ Database Schema

### Export Structure

```
exports:
├── "." (index.ts)         # Database client and utilities
└── "./schema" (schema.ts) # Database schema definitions
```

### Core Tables

#### **Users & Authentication**

```sql
users          # User accounts and profiles
accounts       # OAuth provider accounts
sessions       # User authentication sessions
```

#### **E-commerce Core**

```sql
categories     # Product categories and hierarchy
products       # Product catalog with details
addresses      # User shipping/billing addresses
```

#### **Shopping & Orders**

```sql
cartItems      # Shopping cart items
orders         # Customer orders
orderItems     # Individual items within orders
```

### Schema Relationships

```
users (1) ──── (n) accounts
users (1) ──── (n) sessions
users (1) ──── (n) addresses
users (1) ──── (n) cartItems
users (1) ──── (n) orders

categories (1) ──── (n) products
products (1) ──── (n) cartItems
products (1) ──── (n) orderItems

orders (1) ──── (n) orderItems
```

## 🛠️ Usage Examples

### Basic Database Operations

#### Import the database client

```typescript
import { db } from '@yuki/db'
import { orders, products, users } from '@yuki/db/schema'
```

#### Query Examples

```typescript
// Get all users
const allUsers = await db.select().from(users)

// Get user by ID
const user = await db.select().from(users).where(eq(users.id, userId)).limit(1)

// Get products with categories
const productsWithCategories = await db
  .select()
  .from(products)
  .leftJoin(categories, eq(products.categoryId, categories.id))

// Create new order
const newOrder = await db
  .insert(orders)
  .values({
    userId,
    status: 'pending',
    total: 99.99,
    // ... other fields
  })
  .returning()
```

#### Complex Queries

```typescript
// Get user's order history with items
const userOrders = await db
  .select()
  .from(orders)
  .where(eq(orders.userId, userId))
  .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
  .leftJoin(products, eq(orderItems.productId, products.id))

// Get products by category with pagination
const categoryProducts = await db
  .select()
  .from(products)
  .where(eq(products.categoryId, categoryId))
  .limit(20)
  .offset(page * 20)
```

### Transactions

```typescript
import { db } from '@yuki/db'

// Process order with transaction
await db.transaction(async (tx) => {
  // Create order
  const order = await tx.insert(orders).values(orderData).returning()

  // Add order items
  await tx.insert(orderItems).values(
    items.map((item) => ({
      orderId: order[0].id,
      ...item,
    })),
  )

  // Clear user's cart
  await tx.delete(cartItems).where(eq(cartItems.userId, userId))
})
```

## 📊 Schema Details

### User Management Tables

#### `users`

- `id` - Unique user identifier
- `email` - User email (unique)
- `name` - User display name
- `image` - Profile image URL
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

#### `accounts`

- `id` - Account identifier
- `userId` - Reference to users table
- `type` - Account type (oauth, email)
- `provider` - OAuth provider (google, facebook)
- `providerAccountId` - Provider's user ID

#### `sessions`

- `id` - Session identifier
- `sessionToken` - Unique session token
- `userId` - Reference to users table
- `expires` - Session expiration date

### E-commerce Tables

#### `categories`

- `id` - Category identifier
- `name` - Category name
- `description` - Category description
- `parentId` - Parent category (for hierarchy)

#### `products`

- `id` - Product identifier
- `name` - Product name
- `description` - Product description
- `price` - Product price
- `stock` - Available inventory
- `categoryId` - Reference to categories
- `imageUrl` - Product image URL
- `isActive` - Product availability status

#### `addresses`

- `id` - Address identifier
- `userId` - Reference to users table
- `name` - Address label
- `phone` - Contact phone number
- `line1` - Address line 1
- `line2` - Address line 2 (optional)
- `city` - City name
- `state` - State/province
- `postalCode` - ZIP/postal code
- `country` - Country code

### Shopping & Order Tables

#### `cartItems`

- `id` - Cart item identifier
- `userId` - Reference to users table
- `productId` - Reference to products table
- `quantity` - Item quantity
- `addedAt` - When item was added

#### `orders`

- `id` - Order identifier
- `userId` - Reference to users table
- `status` - Order status (pending, processing, shipped, delivered)
- `total` - Order total amount
- `shippingAddressId` - Reference to addresses table
- `createdAt` - Order creation timestamp
- `updatedAt` - Last status update

#### `orderItems`

- `id` - Order item identifier
- `orderId` - Reference to orders table
- `productId` - Reference to products table
- `quantity` - Item quantity
- `price` - Price at time of order

## 🔧 Configuration

### Drizzle Configuration

The `drizzle.config.ts` file configures:

- Database connection
- Schema location
- Migration settings
- Introspection options

### Connection Management

- Connection pooling for performance
- Automatic reconnection handling
- Environment-specific configurations

## 📦 Dependencies

### Core Dependencies

- `drizzle-orm` - TypeScript ORM with SQL-like syntax
- `@neondatabase/serverless` - Neon PostgreSQL driver

### Development Dependencies

- `drizzle-kit` - Database migrations and introspection
- TypeScript for type definitions
- ESLint and Prettier for code quality

## 🌐 Environment Configuration

### Required Environment Variables

```bash
# Database Connection
DATABASE_URL="postgresql://..." # PostgreSQL connection string

# Optional: Connection Pool Settings
DB_POOL_SIZE="10"              # Maximum connections
DB_POOL_TIMEOUT="30000"        # Connection timeout (ms)
```

### Neon Database Setup

1. Create account at neon.tech
2. Create new database project
3. Copy connection string to `DATABASE_URL`
4. Run `bun db:push` to create schema

## 🔗 Integration

This package is used by:

- **API** (`@yuki/api`) - Database operations in tRPC procedures
- **Auth** (`@yuki/auth`) - User and session storage
- All frontend applications through the API layer

## 🚀 Performance Considerations

### Query Optimization

- Proper indexing on frequently queried columns
- Efficient join operations
- Connection pooling for concurrent requests

### Scalability

- Serverless database compatibility
- Horizontal scaling support
- Optimized for cloud deployments

## 🔐 Security Features

### Data Protection

- SQL injection prevention through parameterized queries
- Input validation at the ORM level
- Secure connection with SSL/TLS

### Access Control

- Database-level permissions
- Application-level authorization
- Audit trails for sensitive operations
