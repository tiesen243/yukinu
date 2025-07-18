# Kaze

![Yukikaze](https://media1.tenor.com/m/us5fTpWBdMcAAAAC/yukikaze-azur-lane.gif)

A high-performance Next.js frontend application for the Yukinu e-commerce platform. Kaze delivers enterprise-grade shopping experiences with server-side rendering, advanced SEO optimization, and cutting-edge React features.

## 📋 Description

Kaze serves as the primary customer-facing web application for the Yukinu e-commerce ecosystem. Built with Next.js 15 and React 19, it provides a lightning-fast, SEO-optimized shopping experience with features like server-side rendering, static generation, and advanced caching strategies. The application supports the complete e-commerce journey from product discovery to checkout.

## ✨ Features

### E-commerce Functionality

- **Product Catalog**: Advanced product browsing with filtering and search
- **Shopping Cart**: Real-time cart management with persistent state
- **User Authentication**: Secure user registration and login system
- **Order Processing**: Complete checkout flow with order tracking
- **Personalized Experience**: AI-powered recommendations and user preferences
- **Mobile Commerce**: Responsive design optimized for all devices

### Marketing & SEO

- **Landing Pages**: Conversion-optimized marketing pages
- **SEO Optimization**: Meta tags, Open Graph, and structured data
- **Performance**: Core Web Vitals optimization and fast loading
- **Analytics**: Built-in tracking and conversion monitoring

### Technical Features

- **Next.js 15**: Latest React framework with App Router
- **React 19**: Modern React with concurrent features
- **TypeScript**: Full type safety across the application
- **tRPC**: End-to-end typesafe API communication
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality React components
- **Server Components**: Optimized server-side rendering
- **Streaming**: Progressive page loading for better UX

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

   The application will be available at `http://localhost:3000`

### Available Scripts

- `bun dev` - Start development server with Turbopack
- `bun build` - Build the application for production
- `bun start` - Start the production server
- `bun typecheck` - Run TypeScript type checking
- `bun lint` - Run ESLint for code quality
- `bun format` - Check code formatting with Prettier

## 🏗️ Project Structure

```
app/
├── (auth)/          # Authentication pages (login, register)
├── (main)/          # Main application pages (dashboard, profile)
├── (marketing)/     # Marketing and landing pages
│   ├── home/        # Homepage with features showcase
│   └── about/       # About page with company info
├── _components/     # Shared React components
├── api/             # API routes and handlers
│   ├── og/          # Open Graph image generation
│   └── trpc/        # tRPC API endpoints
├── globals.css      # Global styles and Tailwind imports
├── layout.tsx       # Root layout component
└── sitemap.ts       # Dynamic sitemap generation

lib/
├── metadata.ts      # SEO metadata utilities
└── utils.ts         # Shared utility functions

trpc/
├── query-client.ts  # React Query configuration
├── react.tsx        # tRPC React hooks
└── rsc.tsx          # tRPC React server caller
```

## 🛠️ Development

### Route Organization

- `(auth)` - Authentication-related pages
- `(main)` - Protected application pages
- `(marketing)` - Public marketing and landing pages

### Component Development

- Use React Server Components where possible for better performance
- Import shared UI components from `@yuki/ui`
- Follow Next.js App Router conventions

### API Integration

- Server actions for form handling
- tRPC for type-safe client-server communication
- React Query for data fetching and caching

### SEO & Performance

- Optimize Core Web Vitals
- Use Next.js Image component for optimized images
- Implement proper meta tags and Open Graph data

## 🌐 Environment Variables

The application uses environment variables from the root `.env` file:

- Database connection strings
- Authentication providers
- Feature flags and API keys
- Analytics and tracking configurations

## 📦 Dependencies

### Core Dependencies

- `next` - React framework for production
- `react` & `react-dom` - React library and DOM bindings
- `@tanstack/react-query` - Data fetching and caching
- `@trpc/client` - tRPC client for type-safe APIs
- `nuqs` - Type-safe URL state management

### Workspace Dependencies

- `@yuki/api` - Backend API types and client
- `@yuki/auth` - Authentication utilities
- `@yuki/db` - Database schema and utilities
- `@yuki/ui` - Shared UI component library
- `@yuki/validators` - Shared validation schemas

## 🔗 Related Applications

- **Goldenglow** (`apps/goldenglow`) - Vue.js customer frontend (alternative implementation)
- **Pepe** (`apps/pepe`) - React Router admin dashboard

## 🎯 Key Features

### Mobile-First Design

Responsive interfaces that work seamlessly across all devices with touch-optimized interactions.

### Lightning Fast Performance

Optimized loading times with server-side rendering, static generation, and efficient caching strategies.

### Secure & Trusted

Enterprise-grade security with secure authentication, data protection, and payment processing.

### Personalized Experience

AI-powered product recommendations and personalized shopping experiences tailored to user preferences.
