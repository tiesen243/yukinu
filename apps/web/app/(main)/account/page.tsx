import { Suspense } from 'react'

import { AccountHeader } from '@/app/(main)/account/_components/header'
import {
  ProfileSummary,
  UpdateProfileForm,
} from '@/app/(main)/account/page.client'
import { getQueryClient, HydrateClient, trpc } from '@/lib/trpc/rsc'

export const dynamic = 'force-dynamic'

export default function AccountPage() {
  void getQueryClient().prefetchQuery(trpc.user.profile.queryOptions({}))

  return (
    <HydrateClient>
      <AccountHeader
        title='My Profile'
        description='View and update your personal details, email, and password to keep your account secure.'
      />

      <section className='flex flex-col gap-6 px-6 pt-6'>
        <h2 className='sr-only'>Profile Information section</h2>

        <Suspense>
          <ProfileSummary />
        </Suspense>

        <hr />

        <Suspense>
          <UpdateProfileForm />
        </Suspense>
      </section>
    </HydrateClient>
  )
}
