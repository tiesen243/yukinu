import { LoginForm } from '@/app/(auth)/_components/login-form'
import { createMetadata } from '@/lib/metadata'

export const metadata = createMetadata({
  title: 'Login',
  description: 'Access your account on Yukinu.',
})

export default function LoginPage() {
  return <LoginForm />
}
