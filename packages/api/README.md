# API 🚀

A type-safe tRPC API server powering the Yukinu e-commerce platform. This package provides a comprehensive backend API with end-to-end type safety, authentication, and business logic for all e-commerce operations.

## 📋 Description

The API package serves as the central backend for the Yukinu e-commerce ecosystem. Built with tRPC, it provides type-safe procedures for all business operations including user authentication, product management, shopping cart functionality, order processing, and address management. The API is designed to be consumed by multiple frontend applications while maintaining strict type safety.

## ✨ Features

### Core API Functionality

- **Type-Safe Procedures**: End-to-end type safety with tRPC
- **Authentication System**: User registration, login, and session management
- **E-commerce Operations**: Complete shopping cart and order processing
- **Product Management**: CRUD operations for product catalog
- **Address Management**: User address storage and validation
- **Database Integration**: Drizzle ORM with PostgreSQL
- **Input Validation**: Zod schemas for all API inputs

### Technical Features

- **tRPC Server**: Modern RPC framework with TypeScript
- **Fetch Adapter**: Compatible with modern runtime environments
- **CORS Support**: Cross-origin request handling
- **Error Handling**: Comprehensive error responses
- **Middleware Support**: Authentication and request processing
- **Type Generation**: Automatic TypeScript type generation for clients

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun runtime
- PostgreSQL database (Neon or local)
- Environment variables configured

### Installation

1. **Install dependencies:**

   ```bash
   bun install
   ```

2. **Set up environment variables:**

   ```bash
   # Configure database and authentication settings in root .env
   DATABASE_URL="postgresql://..."
   ```

3. **Build the package:**

   ```bash
   bun build
   ```

4. **Start development mode:**
   ```bash
   bun dev  # Runs TypeScript compiler in watch mode
   ```

### Available Scripts

- `bun dev` - Run TypeScript compiler in watch mode
- `bun build` - Build the package for production
- `bun typecheck` - Run TypeScript type checking
- `bun lint` - Run ESLint for code quality
- `bun format` - Check code formatting with Prettier

## 🏗️ API Structure

### Router Organization

```
src/
├── routers/         # tRPC router definitions
│   ├── _app.ts      # Main router combining all sub-routers
│   ├── address.ts   # Address management procedures
│   ├── auth.ts      # Authentication procedures
│   ├── cart.ts      # Shopping cart procedures
│   ├── order.ts     # Order management procedures
│   └── product.ts   # Product catalog procedures
├── trpc.ts          # tRPC configuration and context
└── index.ts         # Package entry point and request handler
```

### Available Routers

#### **Address Router** (`address`)

- `getAll` - Retrieve user addresses
- `add` - Add new address
- `update` - Update existing address
- `delete` - Remove address

#### **Authentication Router** (`auth`)

- `signUp` - User registration
- `signIn` - User login
- `signOut` - User logout
- `getSession` - Get current user session
- `updateProfile` - Update user profile

#### **Cart Router** (`cart`)

- `get` - Retrieve shopping cart
- `add` - Add item to cart
- `update` - Update cart item quantity
- `remove` - Remove item from cart
- `clear` - Clear entire cart

#### **Order Router** (`order`)

- `getAll` - Retrieve user orders
- `getById` - Get specific order details
- `create` - Create new order
- `updateStatus` - Update order status
- `cancel` - Cancel order

#### **Product Router** (`product`)

- `getAll` - Retrieve product catalog with filtering
- `getById` - Get specific product details
- `search` - Search products by query
- `getCategories` - Get product categories
- `getFeatured` - Get featured products

## 🛠️ Development

### Adding New Procedures

1. **Create procedure in appropriate router:**

   ```typescript
   export const productRouter = createTRPCRouter({
     newProcedure: publicProcedure
       .input(newProcedureSchema)
       .query(async ({ input, ctx }) => {
         // Implementation
       }),
   })
   ```

2. **Add input validation schema:**

   ```typescript
   import { newProcedureSchema } from '@yuki/validators/product'
   ```

3. **Update the main app router:**
   ```typescript
   // Add to _app.ts if creating new router
   export const appRouter = createTRPCRouter({
     product: productRouter,
     // ... other routers
   })
   ```

### Authentication & Security

The API implements two procedure types:

- **`publicProcedure`**: Accessible without authentication
- **`protectedProcedure`**: Requires valid user session

```typescript
// Protected procedure example
export const protectedExample = protectedProcedure
  .input(inputSchema)
  .query(async ({ ctx, input }) => {
    // ctx.user is available and typed
    const userId = ctx.user.id
    // ... implementation
  })
```

### Database Integration

- Uses Drizzle ORM for type-safe database operations
- Database schema defined in `@yuki/db` package
- Supports transactions and complex queries

### Error Handling

- Comprehensive error types for different scenarios
- Proper HTTP status codes
- Type-safe error responses

## 📦 Dependencies

### Core Dependencies

- `@trpc/server` - tRPC server implementation
- `superjson` - JSON serialization with type preservation

### Workspace Dependencies

- `@yuki/auth` - Authentication utilities and session management
- `@yuki/db` - Database schema and connection
- `@yuki/validators` - Zod schemas for input validation

## 🌐 Deployment

### Request Handler

The package exports a fetch-compatible request handler:

```typescript
// Usage in serverless functions or edge runtime
import { handler } from '@yuki/api'

export default handler
```

### CORS Configuration

- Supports cross-origin requests
- Configurable origins and methods
- Proper preflight handling

## 🔗 Client Integration

The API is consumed by frontend applications using tRPC clients:

- **Kaze** (Next.js) - React tRPC client
- **Goldenglow** (Vue.js) - Vue tRPC client
- **Pepe** (React Router) - React tRPC client

## 📈 Performance

- Efficient query execution with Drizzle ORM
- Connection pooling for database connections
- Optimized serialization with SuperJSON
- Minimal overhead with tRPC's lightweight protocol

## 🔐 Security Features

- Input validation on all endpoints
- Authentication middleware
- Rate limiting capabilities
- SQL injection prevention
- CSRF protection support

To get started with this package, you need to have a database set up and the required environment variables configured.
