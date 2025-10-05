import { Button } from '@yukinu/ui/button'
import { Card, CardContent, CardFooter } from '@yukinu/ui/card'
import { FieldSeparator } from '@yukinu/ui/field'

export default function AuthLayout({ children }: LayoutProps<'/'>) {
  return (
    <main className='flex min-h-dvh flex-col items-center justify-center'>
      <Card className='w-full max-w-xl border-transparent bg-transparent sm:border-border sm:bg-card'>
        <CardContent>{children}</CardContent>

        <FieldSeparator className='mx-6 [&_[data-slot=field-separator-content]]:sm:bg-card'>
          or
        </FieldSeparator>

        <CardFooter className='grid grid-cols-1 gap-6 sm:grid-cols-2' asChild>
          <form>
            <Button
              type='submit'
              variant='outline'
              formAction='/api/auth/google'
            >
              Continue with Google
            </Button>
            <Button
              type='submit'
              variant='outline'
              formAction='/api/auth/facebook'
            >
              Continue with Facebook
            </Button>
          </form>
        </CardFooter>
      </Card>
    </main>
  )
}
