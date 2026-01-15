import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@yukinu/ui/card'
import Link from 'next/link'

import { RegisterForm } from '@/app/(auth)/register/page.client'
import { createMetadata } from '@/lib/metadata'

export default function RegisterPage() {
  return (
    <main className='grid min-h-dvh place-items-center'>
      <Card className='w-full max-w-xl bg-background shadow-none ring-0 sm:bg-card sm:shadow-sm sm:ring-1'>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Sign up to unlock personalized features, manage your preferences,
            and join our community.
          </CardDescription>
        </CardHeader>

        <RegisterForm />

        <CardFooter className='flex flex-col items-start gap-2'>
          <CardDescription className='[&>a]:hover:text-primary [&>a]:hover:underline'>
            Already have an account? <Link href='/login'>Log in here</Link>.
          </CardDescription>
          <CardDescription className='[&>a]:hover:text-primary [&>a]:hover:underline'>
            By registering, you agree to our{' '}
            <Link
              href='https://tiesen243.github.io/yukinu/legal/term-of-service.html'
              target='_blank'
              rel='noopener noreferrer'
              prefetch={false}
            >
              Terms of Service
            </Link>
            {' and '}
            <Link
              href='https://tiesen243.github.io/yukinu/legal/privacy-policy.html'
              target='_blank'
              rel='noopener noreferrer'
              prefetch={false}
            >
              Privacy Policy
            </Link>
            .
          </CardDescription>
        </CardFooter>
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
