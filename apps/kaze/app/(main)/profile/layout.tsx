import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@yuki/auth'

import { Navigation } from '@/app/(main)/profile/layout.client'

export default function ProfileLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className='container flex min-h-[calc(100vh-30rem)] flex-col gap-4 py-4 md:flex-row'>
      <h1 className='sr-only'>Profile page</h1>

      <Navigation />
      {children}
    </main>
  )
}

export async function generateMetadata() {
  const session = await auth({ headers: await headers() })
  if (!session.user) redirect('/login')

  return {
    title: `${session.user.name}'s Profile`,
    description: 'Manage your account settings and preferences.',
  }
}
