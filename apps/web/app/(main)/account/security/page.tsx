import { Suspense } from 'react'

import { AccountHeader } from '@/app/(main)/account/_components/header'
import {
  ChangePasswordForm,
  DeleteAccountButton,
  SessionsList,
  SessionsListSkeleton,
} from '@/app/(main)/account/security/page.client'
import { getQueryClient, HydrateClient, trpc } from '@/lib/trpc/rsc'

export const dynamic = 'force-dynamic'

export default function AccountSecurityPage() {
  void getQueryClient().prefetchQuery(trpc.auth.allSessions.queryOptions({}))

  return (
    <HydrateClient>
      <AccountHeader
        title='Security Settings'
        description='Manage your password, two-factor authentication, and other security settings to keep your account safe.'
      />

      <section className='flex flex-col gap-4 px-6 py-6'>
        <h2 className='text-lg font-medium'>Where you are logged in</h2>

        <Suspense fallback={<SessionsListSkeleton />}>
          <SessionsList />
        </Suspense>
      </section>

      <hr />

      <section className='mb-6 px-6 pt-6'>
        <h2 className='sr-only'>Change Password section</h2>

        <ChangePasswordForm />
      </section>

      <hr />

      <section className='px-6 pt-6'>
        <h2 className='mb-4 text-lg font-medium text-destructive'>
          Delete Account
        </h2>
        <DeleteAccountButton />
      </section>
    </HydrateClient>
  )
}
