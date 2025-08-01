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

        <CardFooter className='flex-col gap-2'>
          <div className='flex w-full items-center gap-4'>
            <div className='h-[1px] grow bg-border' />
            <span className='text-sm'>Or continue with</span>
            <div className='h-[1px] grow bg-border' />
          </div>

          <form className='grid grid-cols-2 gap-2'>
            <Button variant='outline' formAction='/api/auth/facebook'>
              <FacebookIcon /> Facebook
            </Button>
            <Button variant='outline' formAction='/api/auth/google'>
              <GoogleIcon /> Google
            </Button>
          </form>
        </CardFooter>
      </Card>
    </main>
  )
}
