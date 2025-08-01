import { Button } from '@yuki/ui/button'
import { env } from '@yuki/validators/env'

export default function DenyPage() {
  return (
    <main className='flex min-h-dvh flex-col items-center justify-center gap-6 p-4'>
      <div className='flex flex-col items-center gap-4 text-center'>
        <img
          src='https://tiesen.id.vn/assets/images/yuki.webp'
          alt='Access Denied'
          className='size-64'
          loading='lazy'
        />

        <div className='space-y-2'>
          <h1 className='text-2xl font-bold text-foreground'>Access Denied</h1>
          <p className='max-w-md text-muted-foreground'>
            You don't have permission to access this resource. Please contact
            your administrator if you believe this is an error.
          </p>
        </div>

        <Button asChild>
          <a href={env.NEXT_PUBLIC_APP_URL}>Take me home</a>
        </Button>
      </div>
    </main>
  )
}
