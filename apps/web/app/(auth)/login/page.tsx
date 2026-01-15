import { Button } from '@yukinu/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@yukinu/ui/card'
import { FacebookIcon, GoogleIcon } from '@yukinu/ui/icons'
import { Separator } from '@yukinu/ui/separator'
import Link from 'next/link'

import { LoginForm } from '@/app/(auth)/login/page.client'
import { createMetadata } from '@/lib/metadata'

export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  const { redirect_to } = await searchParams

  return (
    <main className='grid min-h-dvh place-items-center'>
      <Card className='w-full max-w-xl bg-background shadow-none ring-0 sm:bg-card sm:shadow-sm sm:ring-1'>
        <CardHeader>
          <CardTitle>Sign in to your account</CardTitle>
          <CardDescription>
            Access your account to manage your preferences, view order history,
            and enjoy personalized features.
          </CardDescription>
        </CardHeader>

        <LoginForm redirectTo={String(redirect_to ?? '/')} />

        <CardFooter className='flex-col gap-4' render={<form method='POST' />}>
          <CardDescription className='self-start [&>a]:hover:text-primary [&>a]:hover:underline'>
            Don&apos;t have an account?{' '}
            <Link href='/register'>Register here</Link>.
          </CardDescription>

          <div className='relative w-full'>
            <Separator className='w-full' />
            <span className='absolute -top-2.5 left-1/2 -translate-x-1/2 bg-background px-2 text-muted-foreground md:bg-card'>
              or
            </span>
          </div>

          <div className='grid w-full gap-4 md:grid-cols-2'>
            <Button
              type='submit'
              variant='outline'
              formAction='/api/auth/facebook'
            >
              <FacebookIcon /> Continue with Facebook
            </Button>
            <Button
              type='submit'
              variant='outline'
              formAction='/api/auth/google'
            >
              <GoogleIcon /> Continue with Google
            </Button>
          </div>
        </CardFooter>
      </Card>
    </main>
  )
}

const title = 'Login'
const description =
  'Access your account to manage your preferences, view order history, and enjoy personalized features.'
export const metadata = createMetadata({
  title,
  description,
  openGraph: {
    images: [
      `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(
        description,
      )}`,
    ],
    url: `/login`,
  },
})
