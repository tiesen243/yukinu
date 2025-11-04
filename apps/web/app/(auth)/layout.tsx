import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@yukinu/auth'

export default async function AuthLayout({ children }: LayoutProps<'/'>) {
  const session = await auth({ headers: await headers() })
  if (session.user) redirect('/')

  return (
    <main className='grid min-h-dvh place-items-center px-4'>
      <div className='w-full max-w-xl rounded-xl border border-transparent bg-background p-6 text-card-foreground sm:border-border sm:bg-card sm:shadow-sm'>
        {children}
      </div>
    </main>
  )
}
