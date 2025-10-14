import { FieldDescription, FieldLegend } from '@yukinu/ui/field'

import { LoginForm } from '@/app/(auth)/login/page.client'
import { createMetadata } from '@/lib/metadata'

export const metadata = createMetadata({
  title: 'Login',
  description: 'Login to your account',
  openGraph: { url: '/login' },
})

export default function LoginPage() {
  return (
    <>
      <FieldLegend>Login to your account</FieldLegend>
      <FieldDescription>
        Fill in your credentials to access your account.
      </FieldDescription>
      <LoginForm />
    </>
  )
}
