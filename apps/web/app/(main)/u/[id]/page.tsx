import { Suspense } from 'react'

import { UserProfileDetails } from '@/app/(main)/u/[id]/page.client'
import { createMetadata } from '@/lib/metadata'
import { getQueryClient, HydrateClient, trpc } from '@/lib/trpc/rsc'

export default async function ProfilePage({ params }: PageProps<'/u/[id]'>) {
  const { id } = await params
  void getQueryClient().prefetchQuery(
    trpc.user.publicProfile.queryOptions({ id }),
  )

  return (
    <HydrateClient>
      <main className='container flex-1 pb-4'>
        <h1 className='sr-only'>User Profile Page</h1>

        <Suspense fallback={<div>Loading user profile...</div>}>
          <UserProfileDetails id={id} />
        </Suspense>
      </main>
    </HydrateClient>
  )
}

export const generateMetadata = async ({ params }: PageProps<'/u/[id]'>) => {
  const { id } = await params
  const data = await getQueryClient().ensureQueryData(
    trpc.user.publicProfile.queryOptions({ id }),
  )

  return createMetadata({
    title: data.profile.fullName ?? data.username,
    description: data.profile.bio ?? `Profile page of ${data.username}`,
    openGraph: {
      images: [
        ...(data.image ? [data.image] : []),
        ...(data.profile.banner ? [data.profile.banner] : []),
        `/api/og?title=${encodeURIComponent(
          data.profile.fullName ?? data.username,
        )}&description=${encodeURIComponent(
          data.profile.bio ?? '',
        )}&image=${encodeURIComponent(data.image ?? '')}`,
      ],
      url: `/u/${data.id}`,
    },
  })
}
