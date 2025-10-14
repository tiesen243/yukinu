import { FieldDescription, FieldLegend } from '@yukinu/ui/field'

import { RegisterForm } from '@/app/(auth)/register/page.client'
import { createMetadata } from '@/lib/metadata'

export const metadata = createMetadata({
  title: 'Register',
  description: 'Create an account to get started',
  openGraph: { url: '/register' },
})

export default function RegisterPage() {
  return (
    <>
      <FieldLegend>Create an account to get started</FieldLegend>
      <FieldDescription>
        Fill in the details below to create your account.
      </FieldDescription>

      <RegisterForm />
    </>
  )
}
