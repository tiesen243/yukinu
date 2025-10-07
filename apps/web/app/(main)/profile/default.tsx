import { Suspense } from 'react'

import {
  ProfileHeader,
  ProfileHeaderSkeleton,
} from '@/app/(main)/profile/default.client'
import { getQueryClient, HydrateClient, trpc } from '@/trpc/rsc'

export default function ProfilePage(_: PageProps<'/profile'>) {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.user.profile.queryOptions())

  return (
    <HydrateClient>
      <Suspense fallback={<ProfileHeaderSkeleton />}>
        <ProfileHeader />
      </Suspense>
    </HydrateClient>
  )
}
