import { CardDescription, CardHeader, CardTitle } from '@yukinu/ui/card'

import { LoginForm } from '@/app/(auth)/login/page.client'
import { createMetadata } from '@/lib/metadata'

const title = 'Login'
const description =
  'Fill in your credentials to access your account and start shopping with Yukinu!'

export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  const { redirect_to = '/' } = await searchParams

  return (
    <>
      <CardHeader>
        <CardTitle render={<legend />}>Welcome Back to Yukinu</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <LoginForm redirectTo={redirect_to.toString()} />
    </>
  )
}

export const metadata = createMetadata({
  title,
  description,
  openGraph: {
    images: `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
    url: '/login',
  },
})
