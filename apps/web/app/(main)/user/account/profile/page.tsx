import { Suspense } from 'react'

import {
  ProfileAccount,
  ProfileAccountSkeleton,
  ProfileInfo,
  ProfileInfoSkeleton,
} from '@/app/(main)/user/account/profile/page.client'
import { getQueryClient, HydrateClient, trpc } from '@/trpc/rsc'

export default function ProfilePage() {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.profile.get.queryOptions())

  return (
    <HydrateClient>
      <section>
        <h3 className='px-4 text-lg font-medium'>My Profile</h3>
        <hr className='my-4' />

        <Suspense fallback={<ProfileAccountSkeleton />}>
          <ProfileAccount />
        </Suspense>

        <hr className='my-4' />

        <Suspense fallback={<ProfileInfoSkeleton />}>
          <ProfileInfo />
        </Suspense>
      </section>
    </HydrateClient>
  )
}
