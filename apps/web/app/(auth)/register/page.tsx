import { Card } from '@yukinu/ui/card'
import { FieldDescription, FieldLegend, FieldSet } from '@yukinu/ui/field'
import Link from 'next/link'

import { RegisterForm } from '@/app/(auth)/register/page.client'
import { createMetadata } from '@/lib/metadata'

export default function RegisterPage() {
  return (
    <main className='grid min-h-dvh place-items-center'>
      <Card
        className='w-full max-w-xl bg-background shadow-none ring-0 sm:bg-card sm:shadow-sm sm:ring-1'
        render={<form method='POST' />}
      >
        <FieldSet className='px-4'>
          <FieldLegend>Register</FieldLegend>
          <FieldDescription>Create your account</FieldDescription>
          <RegisterForm />
          <FieldDescription>
            Already have an account? <Link href='/login'>Log in here</Link>.
          </FieldDescription>
          <FieldDescription>
            By registering, you agree to our{' '}
            <Link
              href='https://tiesen243.github.io/yukinu/legal/term-of-service.html'
              target='_blank'
              rel='noopener noreferrer'
            >
              Terms of Service
            </Link>
            {' and '}
            <Link
              href='https://tiesen243.github.io/yukinu/legal/privacy-policy.html'
              target='_blank'
              rel='noopener noreferrer'
            >
              Privacy Policy
            </Link>
            .
          </FieldDescription>
        </FieldSet>
      </Card>
    </main>
  )
}

const title = 'Register'
const description =
  'Sign up to unlock personalized features, manage your preferences, and join our community.'
export const metadata = createMetadata({
  title,
  description,
  openGraph: {
    images: [
      `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(
        description,
      )}`,
    ],
    url: `/register`,
  },
})
