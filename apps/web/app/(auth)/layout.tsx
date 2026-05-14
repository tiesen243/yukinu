import { Button } from '@yukinu/ui/button'
import { Card, CardFooter } from '@yukinu/ui/card'

import { LoadTurnstile } from '@/app/(auth)/layout.client'

export default function AuthLayout({ children }: LayoutProps<'/'>) {
  return (
    <main className='flex min-h-dvh items-center justify-center px-4'>
      <Card className='w-full bg-transparent ring-0 md:max-w-xl md:bg-card md:ring-1'>
        {children}

        <CardFooter
          render={<form />}
          className='relative grid grid-cols-2 gap-4 bg-transparent md:bg-card'
        >
          <span className='absolute -top-3 left-1/2 -translate-x-1/2 bg-background px-2 text-muted-foreground md:bg-card'>
            or
          </span>

          {providers.map((provider) => (
            <Button
              key={provider}
              type='submit'
              variant='outline'
              formAction={`/api/auth/${provider}`}
            >
              Continue with{' '}
              {provider.charAt(0).toUpperCase() + provider.slice(1)}
            </Button>
          ))}
        </CardFooter>
      </Card>

      <LoadTurnstile />
    </main>
  )
}

const providers = ['google', 'github']
