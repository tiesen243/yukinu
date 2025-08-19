# Goldenglow

![Goldenglow](https://media1.tenor.com/m/s-8hAXPDChgAAAAd/arknights-goldenglow.gif)

A modern Vue.js frontend application for the Yukinu e-commerce platform. Goldenglow provides customers with a fast, responsive, and intuitive shopping experience built with cutting-edge web technologies.

## 📋 Description

Goldenglow is the customer-facing frontend of the Yukinu e-commerce ecosystem. It delivers a seamless shopping experience with Vue 3's Composition API, providing reactive interfaces for product browsing, cart management, and order processing. The application emphasizes performance, accessibility, and mobile-first design.

## ✨ Features

### Core Functionality

- **Product Catalog**: Browse and search through extensive product listings
- **Shopping Cart**: Add, remove, and manage items with real-time updates
- **User Authentication**: Secure login and registration system
- **Order Management**: Track orders and view purchase history
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Technical Features

- **Vue 3**: Modern reactive framework with Composition API and `<script setup>` syntax
- **TypeScript**: Full type safety across the application
- **tRPC**: End-to-end typesafe API communication with the backend
- **Vue Router**: Client-side routing for single-page application navigation
- **Vite**: Lightning-fast development server and build tool
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **VueUse**: Collection of Vue composition utilities
- **Lucide Icons**: Beautiful and consistent icon library

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

3. **Start the development server:**

   ```bash
   bun dev
   ```

   The application will be available at `http://localhost:5173`

### Available Scripts

- `bun dev` - Start the development server with hot reload
- `bun build` - Build the application for production
- `bun start` - Preview the production build
- `bun typecheck` - Run TypeScript type checking
- `bun lint` - Run ESLint for code quality
- `bun format` - Check code formatting with Prettier

## 🏗️ Project Structure

```
src/
├── api/                     # tRPC client configuration
├── components/              # Reusable Vue components
│   └── layout/              # Layout components (header, footer, etc.)
├── lib/                     # Utility functions and helpers
├── routes/                  # Application pages/routes
│   ├── _index.vue           # Home page
│   ├── product-detail.vue   # Product detail page
│   └── not-found.vue        # 404 error page
├── App.vue                  # Root application component
├── main.ts                  # Application entry point
├── routes.ts                # Router configuration
└── globals.css              # Global styles
```

## 🛠️ Development

### Adding New Routes

Create new `.vue` files in the `src/routes/` directory. The file-based routing system will automatically register them.

### Component Development

- Use Vue 3 Composition API with `<script setup>` syntax
- Import shared UI components from `@yuki/ui`
- Follow TypeScript best practices for type safety

### API Integration

- Use the configured tRPC client in `src/api/`
- Leverage Vue Query for data fetching and caching
- Maintain type safety with shared validators from `@yuki/validators`

## 🌐 Environment Variables

The application uses environment variables from the root `.env` file:

- API endpoints and configuration
- Authentication settings
- Feature flags

## 📦 Dependencies

### Core Dependencies

- `vue` - Vue.js framework
- `vue-router` - Official router for Vue.js
- `@tanstack/vue-query` - Data fetching and caching
- `@trpc/client` - tRPC client for type-safe API calls
- `@vueuse/core` - Vue composition utilities

### Workspace Dependencies

- `@yuki/api` - Backend API types and client
- `@yuki/ui` - Shared UI component library
- `@yuki/validators` - Shared validation schemas

## 🔗 Related Applications

- **Kaze** (`apps/kaze`) - Next.js customer frontend (alternative implementation)
- **Pepe** (`apps/pepe`) - React Router admin dashboard
