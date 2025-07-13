/* eslint-disable @next/next/no-html-link-for-pages */
import { Button } from '@yuki/ui/button'
import { Card, CardFooter } from '@yuki/ui/card'
import { FacebookIcon, GoogleIcon } from '@yuki/ui/icons'

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className='container grid min-h-dvh place-items-center'>
      <Card className='w-full max-w-md'>
        {children}

        <CardFooter className='grid gap-2'>
          <div className='relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
            <span className='relative z-10 bg-card px-2 text-muted-foreground'>
              Or continue with
            </span>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <Button variant='outline' size='sm' asChild>
              <a href='/api/auth/facebook'>
                <FacebookIcon /> Facebook
              </a>
            </Button>
            <Button variant='outline' size='sm' asChild>
              <a href='/api/auth/google'>
                <GoogleIcon /> Google
              </a>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </main>
  )
}
