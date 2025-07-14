# Auth

This package provides authentication services for the application.

## Features

- **Authentication**: Handles user sign-in, sign-out, and session management.
- **Providers**: Supports authentication with credentials, Facebook, and Google.
- **Session Management**: Includes a React context for managing sessions in the frontend.
- **Database**: Uses Drizzle ORM for database access.

## Getting Started

To get started with this package, you need to have a database set up and the required environment variables configured for the authentication providers you want to use.

### Environment Variables

- `AUTH_FACEBOOK_ID`
- `AUTH_FACEBOOK_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`

### Usage

To use the authentication services, you need to wrap your application with the `SessionProvider` component.

```tsx
import { SessionProvider } from '@yuki/auth/react'

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
```

Then, you can use the `useSession` hook to access the session information.

```tsx
import { useSession } from '@yuki/auth/react'

export default function MyComponent() {
  const { session, status } = useSession()

  if (status === 'loading') {
    return <p>Loading...</p>
  }

  if (status === 'unauthenticated') {
    return <p>You are not authenticated.</p>
  }

  return <p>Welcome, {session.user.name}!</p>
}
```
