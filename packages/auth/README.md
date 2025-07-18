# Auth 🔐

A comprehensive authentication package for the Yukinu e-commerce platform. This package provides secure user authentication, session management, and authorization utilities with support for multiple authentication providers and security features.

## 📋 Description

The Auth package handles all authentication and authorization concerns for the Yukinu ecosystem. Built with modern security practices, it provides a complete authentication solution including user sign-up/sign-in, session management, OAuth provider integration, and security middleware for protecting routes and API endpoints.

## ✨ Features

### Authentication Methods

- **Credentials Authentication**: Email/password-based authentication
- **OAuth Providers**: Google and Facebook social authentication
- **Session Management**: Secure session handling with JWT tokens
- **Multi-Provider Support**: Flexible authentication provider configuration

### Security Features

- **CSRF Protection**: Cross-site request forgery prevention
- **Rate Limiting**: API endpoint protection against abuse
- **Secure Sessions**: HTTP-only cookies with proper security headers
- **Password Security**: Secure password hashing and validation
- **Token Management**: JWT token generation and validation

### Developer Experience

- **React Integration**: React hooks and context providers
- **TypeScript Support**: Full type safety for authentication states
- **Server Components**: Support for React Server Components
- **Middleware**: Authentication middleware for route protection

## 🚀 Getting Started

### Prerequisites

- Database configured with user schema
- Environment variables for OAuth providers (optional)

### Installation

The package is already included in the workspace. Configure your environment:

```bash
# OAuth Provider Configuration (optional)
AUTH_FACEBOOK_ID="your-facebook-app-id"
AUTH_FACEBOOK_SECRET="your-facebook-app-secret"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
```

### Basic Setup

#### 1. Wrap your application with SessionProvider

```tsx
import { SessionProvider } from '@yuki/auth/react'

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en'>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
```

#### 2. Use authentication hooks in components

```tsx
import { useSession } from '@yuki/auth/react'

export default function MyComponent() {
  const { session, status } = useSession()

  if (status === 'loading') {
    return <p>Loading...</p>
  }

  if (status === 'unauthenticated') {
    return <p>Please sign in</p>
  }

  return <p>Welcome, {session.user.name}!</p>
}
```

#### 3. Protect API routes

```tsx
import { NextRequest } from 'next/server'

import { auth } from '@yuki/auth'

export async function GET(request: NextRequest) {
  const session = await auth(request)

  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Protected route logic
  return Response.json({ user: session.user })
}
```

### Available Scripts

- `bun dev` - Run TypeScript compiler in watch mode
- `bun build` - Build the package for production
- `bun typecheck` - Run TypeScript type checking
- `bun lint` - Run ESLint for code quality
- `bun format` - Check code formatting with Prettier

## 🏗️ Package Structure

### Export Structure

```
exports:
├── "." (index.ts)          # Main authentication utilities
├── "./react" (react.tsx)   # React hooks and providers
├── "./csrf" (csrf.ts)      # CSRF protection utilities
└── "./rate-limit"          # Rate limiting middleware
```

### Core Files

```
src/
├── index.ts              # Main authentication configuration
├── index.rsc.ts          # React Server Components support
├── react.tsx             # React hooks and context providers
├── csrf.ts               # CSRF protection implementation
├── rate-limit.ts         # Rate limiting utilities
├── config.ts             # Authentication configuration
└── providers/            # OAuth provider configurations
    ├── google.ts
    └── facebook.ts
```

## 🛠️ API Reference

### Core Authentication

#### `auth(request: Request)`

Get the current session from a request object.

```tsx
import { auth } from '@yuki/auth'

const session = await auth(request)
if (session) {
  console.log('User:', session.user)
}
```

### React Hooks

#### `useSession()`

React hook for accessing session state.

```tsx
import { useSession } from '@yuki/auth/react'

function Component() {
  const { session, status, update } = useSession()

  return (
    <div>
      <p>Status: {status}</p>
      {session && <p>User: {session.user.email}</p>}
    </div>
  )
}
```

#### `SessionProvider`

React context provider for authentication state.

```tsx
import { SessionProvider } from '@yuki/auth/react'

function App({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
```

### Security Utilities

#### CSRF Protection

```tsx
import { generateCSRFToken, validateCSRFToken } from '@yuki/auth/csrf'

// Generate token
const token = await generateCSRFToken()

// Validate token
const isValid = await validateCSRFToken(token, request)
```

#### Rate Limiting

```tsx
import { rateLimit } from '@yuki/auth/rate-limit'

// Apply rate limiting to API routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})

export async function POST(request: NextRequest) {
  const result = await limiter(request)
  if (!result.success) {
    return new Response('Too Many Requests', { status: 429 })
  }

  // Handle request
}
```

## 🔐 Authentication Providers

### Credentials Provider

Email and password authentication with secure password hashing.

```tsx
// Sign up
const result = await signUp({
  email: 'user@example.com',
  password: 'securepassword',
  name: 'John Doe',
})

// Sign in
const session = await signIn('credentials', {
  email: 'user@example.com',
  password: 'securepassword',
})
```

### OAuth Providers

#### Google Authentication

```tsx
import { signIn } from '@yuki/auth/react'

// Trigger Google OAuth flow
await signIn('google')
```

#### Facebook Authentication

```tsx
import { signIn } from '@yuki/auth/react'

// Trigger Facebook OAuth flow
await signIn('facebook')
```

## 📦 Dependencies

### Core Dependencies

- **Database ORM**: Integration with `@yuki/db` for user storage
- **Validation**: Uses `@yuki/validators` for input validation
- **Security**: Built-in CSRF and rate limiting protection

### Development Dependencies

- TypeScript for type safety
- ESLint and Prettier for code quality

## 🌐 Session Management

### Session Structure

```typescript
interface Session {
  user: {
    id: string
    email: string
    name?: string
    image?: string
  }
  expires: string
}
```

### Session Storage

- HTTP-only cookies for security
- Automatic token refresh
- Secure session invalidation

## 🔒 Security Best Practices

### Password Security

- Scrypt hashing for password storage
- Minimum password complexity requirements
- Protection against timing attacks

### Session Security

- HTTP-only and secure cookie flags
- SameSite cookie protection
- Automatic session expiration
- CSRF token validation

### API Protection

- Rate limiting on authentication endpoints
- Brute force protection
- Account lockout mechanisms

## 🔗 Integration

This package integrates seamlessly with:

- **API** (`@yuki/api`) - Provides authentication context for tRPC procedures
- **Database** (`@yuki/db`) - Stores user accounts and session data
- **Validators** (`@yuki/validators`) - Validates authentication inputs
