import { Button } from '@yukinu/ui/button'
import { Card, CardFooter } from '@yukinu/ui/card'
import { FacebookIcon, GoogleIcon } from '@yukinu/ui/icons'

export default function AuthLayout({ children }: LayoutProps<'/'>) {
  return (
    <main className='flex min-h-dvh flex-col items-center justify-center'>
      <Card className='w-full max-w-xl space-y-4 border-transparent bg-transparent sm:border-border sm:bg-card'>
        {children}

        <div className='-mt-6 -mb-2 flex items-center gap-2 px-6'>
          <div className='h-0.25 flex-1 bg-border' />
          <span>or</span>
          <div className='h-0.25 flex-1 bg-border' />
        </div>

        <CardFooter className='grid grid-cols-1 gap-4 sm:grid-cols-2' asChild>
          <form>
            <Button variant='outline' formAction='/api/auth/facebook'>
              <FacebookIcon /> Continue with Facebook
            </Button>
            <Button variant='outline' formAction='/api/auth/google'>
              <GoogleIcon /> Continue with Google
            </Button>
          </form>
        </CardFooter>
      </Card>
    </main>
  )
}
