# Email

A robust email handling package for the Yukinu project, providing utilities for sending, receiving, and managing email communications.

## Features

- 📧 Send emails with HTML and plain text support
- 📎 Attachment handling
- 🔒 Secure authentication (OAuth2, SMTP)
- 📝 Template-based email composition
- 🔄 Email queue management
- 📊 Delivery tracking and analytics
- 🛡️ Spam protection and validation
- 📱 Responsive email templates

## Quick Start

```typescript
import { sendEmail } from '@yuki/email'

// Send an email using a predefined template
await sendEmail({
  email: 'Welcome', // Must match a template in ./emails
  to: 'user@example.com',
  subject: 'Welcome to Yukinu!',
  text: 'Welcome to our platform!',
  data: {
    name: 'John Doe',
  },
})
```

## Configuration

Set up your environment variables:

```env
RESEND_TOKEN=your_resend_api_token
```

## API Reference

### `sendEmail(params: SendEmailParams)`

Sends an email using Resend API with React templates.

#### Parameters

```typescript
interface SendEmailParams {
  email: keyof typeof email // Template name from ./emails
  to: string // Recipient email address
  subject: string // Email subject line
  text: string // Plain text fallback
  data?: Record<string, unknown> // Template data
}
```

#### Example

```typescript
await sendEmail({
  email: 'passwordReset',
  to: 'user@example.com',
  subject: 'Reset Your Password',
  text: 'Click the link to reset your password.',
  data: {
    resetUrl: 'https://app.yukinu.com/reset?token=xyz',
    userName: 'John Doe',
  },
})
```

## Email Templates

Create React email templates in the `./emails` directory:

```tsx
// ./emails/welcome.tsx
import { SendEmailParams } from '../index'

interface WelcomeEmailProps extends SendEmailParams {
  data: {
    name: string
  }
}

export default function Welcome({ data }: WelcomeEmailProps) {
  return (
    <EmailLayout previewText='Welcome to our store - Start shopping today!'>
      <Text>Hi {data.name}, welcome to our store!</Text>
    </EmailLayout>
  )
}
```

```typescript
// ./emails/index.ts
export { Welcome } from './welcome'
// Export all your email templates here
```
