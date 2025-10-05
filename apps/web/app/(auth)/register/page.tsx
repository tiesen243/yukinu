import { RegisterForm } from '@/app/(auth)/_components/register-form'
import { createMetadata } from '@/lib/metadata'

export const metadata = createMetadata({
  title: 'Register',
  description: 'Create a new account on Yukinu.',
})

export default function RegisterPage(_: PageProps<'/register'>) {
  return <RegisterForm />
}
