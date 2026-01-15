import { Card, CardDescription, CardHeader, CardTitle } from '@yukinu/ui/card'

import { VerifyEmailForm } from '@/app/(auth)/verify-email/page.client'
import { createMetadata } from '@/lib/metadata'

export default async function VerifyEmailPage({
  searchParams,
}: PageProps<'/verify-email'>) {
  const { token } = await searchParams

  if (!token || typeof token !== 'string')
    return (
      <main className='grid min-h-dvh place-items-center'>
        <Card className='w-full max-w-xl bg-background shadow-none ring-0 sm:bg-card sm:shadow-sm sm:ring-1'>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>
              No token provided. Please check the link in your email.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    )

  return (
    <main className='grid min-h-dvh place-items-center'>
      <Card className='w-full max-w-xl bg-background shadow-none ring-0 sm:bg-card sm:shadow-sm sm:ring-1'>
        <CardHeader>
          <CardTitle>Verify Your Email Address</CardTitle>
          <CardDescription>
            Complete your email verification to access all features of your
            account.
          </CardDescription>
        </CardHeader>

        <VerifyEmailForm token={token} />
      </Card>
    </main>
  )
}

const title = 'Verify Your Email Address'
const description =
  'Complete your email verification to access all features of your account.'
export const metadata = createMetadata({
  title,
  description,
  openGraph: {
    images: [
      `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(
        description,
      )}`,
    ],
    url: `/verify-email`,
  },
})
