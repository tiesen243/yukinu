import { Link } from 'react-router'

import { FieldDescription, FieldLegend, FieldSet } from '@yukinu/ui/field'

import { LoginForm } from '@/routes/login/client'

export default function LoginPage() {
  return (
    <main className='grid min-h-dvh place-items-center'>
      <form
        method='POST'
        className='w-full max-w-xl rounded-xl p-6 text-card-foreground sm:border sm:bg-card sm:shadow-sm'
      >
        <FieldSet>
          <FieldLegend>Login</FieldLegend>
          <FieldDescription>
            Welcome back! Please enter your credentials to log in.
          </FieldDescription>

          <LoginForm />

          <FieldDescription>
            Don&apos;t have an account?{' '}
            <Link to='/register'>Register here</Link>.
          </FieldDescription>
        </FieldSet>
      </form>
    </main>
  )
}
