import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@yukinu/auth'
import { Button } from '@yukinu/ui/button'
import { Field, FieldSeparator, FieldSet } from '@yukinu/ui/field'

export default async function AuthLayout({ children }: LayoutProps<'/'>) {
  const session = await auth({ headers: await headers() })
  if (session.user) redirect('/')

  return (
    <main className='grid min-h-dvh place-items-center px-4'>
      <form className='w-full max-w-xl rounded-xl border border-transparent bg-background p-6 text-card-foreground sm:border-border sm:bg-card sm:shadow-sm'>
        <FieldSet>
          {children}

          <FieldSeparator className='[&_[data-slot=field-separator-content]]:bg-card'>
            or
          </FieldSeparator>
          <Field className='grid gap-4 sm:grid-cols-2'>
            <Button variant='outline' formAction='/api/auth/facebook'>
              Continue with Facebook
            </Button>
            <Button variant='outline' formAction='/api/auth/google'>
              Continue with Google
            </Button>
          </Field>
        </FieldSet>
      </form>
    </main>
  )
}
