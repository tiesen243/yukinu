import { CardDescription, CardHeader, CardTitle } from '@yukinu/ui/card'

import { RegisterForm } from '@/app/(auth)/register/page.client'
import { createMetadata } from '@/lib/metadata'

export default function RegisterPage() {
  return (
    <>
      <CardHeader>
        <CardTitle render={<legend />}>Create your account</CardTitle>
        <CardDescription>
          Sign up to unlock personalized features, manage your preferences, and
          join our community.
        </CardDescription>
      </CardHeader>

      <RegisterForm />
    </>
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
