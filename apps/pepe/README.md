# Pepe

![Pepe](https://media.tenor.com/eOO8tADgYckAAAAi/arknights-pepe.gif)

A modern React Router admin dashboard for the Yukinu e-commerce platform. Pepe provides administrators and merchants with powerful tools to manage products, orders, customers, and business analytics through a comprehensive web interface.

## 📋 Description

Pepe is the administrative control center for the Yukinu e-commerce ecosystem. Built with React Router 7 and modern React patterns, it offers a full-featured admin dashboard for managing all aspects of the e-commerce platform. The application provides real-time insights, inventory management, order processing, and customer relationship tools.

## ✨ Features

### Core Admin Functionality

- **Product Management**: Add, edit, and organize product catalogs
- **Order Processing**: View, update, and fulfill customer orders
- **Customer Management**: Access customer profiles and purchase history
- **Inventory Tracking**: Monitor stock levels and manage suppliers
- **Analytics Dashboard**: Real-time business metrics and reporting
- **User Administration**: Manage admin users and permissions

### Business Intelligence

- **Sales Analytics**: Revenue tracking and performance metrics
- **Customer Insights**: Behavior analysis and segmentation
- **Inventory Reports**: Stock alerts and reorder recommendations
- **Performance Metrics**: Site performance and conversion tracking

### Technical Features

- **React Router 7**: Modern routing with file-system based routes
- **React 19**: Latest React with concurrent features and optimizations
- **TypeScript**: Full type safety across the application
- **tRPC**: End-to-end typesafe API communication
- **Server-Side Rendering**: Fast initial page loads and SEO benefits
- **Tailwind CSS**: Utility-first CSS framework for rapid development
- **shadcn/ui**: Professional UI components for admin interfaces

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun runtime
- The `@yuki/api` package must be running for backend connectivity

### Installation

1. **Install dependencies:**

   ```bash
   bun install
   ```

2. **Set up environment variables:**

   ```bash
   # Copy the example environment file from the root
   cp ../../.env.example ../../.env
   # Edit the .env file with your configuration
   ```

3. **Generate route types:**

   ```bash
   bun lint  # This runs react-router typegen
   ```

4. **Start the development server:**

   ```bash
   bun dev
   ```

   The application will be available at `http://localhost:5173`

5. **For production deployment:**
   ```bash
   bun build
   bun start  # Runs on port 3001
   ```

### Available Scripts

- `bun dev` - Start the development server with hot reload
- `bun build` - Build the application for production
- `bun start` - Start the production server on port 3001
- `bun typecheck` - Run TypeScript type checking with route generation
- `bun lint` - Generate route types and run ESLint
- `bun format` - Check code formatting with Prettier

## 🏗️ Project Structure

```
src/
├── lib/                 # Utility functions and helpers
├── routes/              # File-system based routes
│   ├── _index.tsx       # Dashboard home page
│   └── ...              # Other routes
├── trpc/                # tRPC client configuration
│   ├── query-client.ts  # React Query setup
│   ├── react.tsx        # tRPC React hooks
│   └── rsc.tsx          # tRPC React server caller
├── globals.css          # Global styles and Tailwind imports
├── root.tsx             # Root application component
└── routes.ts            # Route configuration

build/
├── client/              # Client-side build artifacts
└── server/              # Server-side build artifacts
```

## 🛠️ Development

### Route Management

React Router 7 uses file-system based routing. Create new routes by adding files to the `src/routes/` directory:

- `routes/_index.tsx` - Dashboard home (`/`)
- `routes/products.tsx` - Products list (`/products`)
- `routes/products.$id.tsx` - Product detail (`/products/:id`)

### Admin Features Development

- Implement CRUD operations for all entities
- Create data visualization components for analytics
- Build form components with validation
- Implement real-time updates for order status

### API Integration

- Use tRPC hooks for type-safe data fetching
- Implement optimistic updates for better UX
- Handle loading states and error boundaries
- Cache frequently accessed data

### Security Considerations

- Implement role-based access control
- Validate admin permissions on sensitive operations
- Secure API endpoints with proper authentication
- Audit trail for admin actions

## 🌐 Environment Variables

The application uses environment variables from the root `.env` file:

- API endpoint configurations
- Authentication settings
- Database connections
- Feature flags for admin features

## 📦 Dependencies

### Core Dependencies

- `@react-router/node` - React Router server-side utilities
- `@react-router/serve` - Production server
- `@react-router/fs-routes` - File-system based routing
- `@tanstack/react-query` - Data fetching and caching
- `@trpc/client` - tRPC client for type-safe APIs
- `isbot` - Bot detection for SSR optimization

### Workspace Dependencies

- `@yuki/api` - Backend API types and client
- `@yuki/auth` - Authentication utilities
- `@yuki/db` - Database schema and utilities
- `@yuki/ui` - Shared UI component library
- `@yuki/validators` - Shared validation schemas

## 🔧 Configuration

### React Router Configuration

The `react-router.config.ts` file configures:

- Route generation and type safety
- Server-side rendering settings
- Build optimization options

### Production Deployment

- Build artifacts are generated in the `build/` directory
- Server runs on port 3001 by default
- Supports Node.js deployment environments

## 🔗 Related Applications

- **Kaze** (`apps/kaze`) - Next.js customer frontend
- **Goldenglow** (`apps/goldenglow`) - Vue.js customer frontend

## 🎯 Admin Dashboard Features

### Real-time Operations

- Live order notifications and updates
- Inventory alerts and stock monitoring
- Customer activity tracking

### Business Management

- Comprehensive product catalog management
- Advanced order fulfillment workflows
- Customer relationship management tools
- Financial reporting and analytics

### Performance Monitoring

- Site performance metrics
- Conversion rate tracking
- User behavior analytics
- System health monitoring
