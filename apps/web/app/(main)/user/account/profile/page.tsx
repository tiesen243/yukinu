import { Suspense } from 'react'

import { ProfileInfo } from '@/app/(main)/user/account/profile/page.client'
import { getQueryClient, HydrateClient, trpc } from '@/trpc/rsc'

export default function ProfilePage() {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.user.getInfo.queryOptions())

  return (
    <HydrateClient>
      <section>
        <h3 className='px-4 text-lg font-medium'>My Profile</h3>
        <hr className='my-4' />

        <Suspense fallback={<p className='px-4'>Loading...</p>}>
          <ProfileInfo />
        </Suspense>
      </section>
    </HydrateClient>
  )
}
