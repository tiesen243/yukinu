import Link from 'next/link'

import { FieldDescription, FieldLegend, FieldSet } from '@yukinu/ui/field'

import { RegisterForm } from '@/app/(auth)/register/page.client'
import { createMetadata } from '@/lib/metadata'

export default function RegisterPage() {
  return (
    <main className='grid min-h-dvh place-items-center'>
      <form className='w-full max-w-xl rounded-xl p-6 text-card-foreground sm:border sm:bg-card sm:shadow-sm'>
        <FieldSet>
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
      </form>
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
