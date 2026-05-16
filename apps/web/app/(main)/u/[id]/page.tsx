import { Suspense } from 'react'

import { UserDetails } from '@/app/(main)/u/[id]/page.client'
import { createMetadata } from '@/lib/metadata'
import { getQueryClient, HydrateClient, trpc } from '@/lib/trpc.rsc'

export default async function UserPage({ params }: PageProps<'/u/[id]'>) {
  const { id } = await params

  return (
    <HydrateClient>
      <main className='container flex-1 pb-4'>
        <h1 className='sr-only'>User page</h1>

        <Suspense fallback={<div>Loading user profile...</div>}>
          <UserDetails id={id} />
        </Suspense>
      </main>
    </HydrateClient>
  )
}

export const generateMetadata = async ({ params }: PageProps<'/u/[id]'>) => {
  const { id } = await params
  const data = await getQueryClient().ensureQueryData(
    trpc.identity.user.publicProfile.queryOptions({ id }),
  )

  return createMetadata({
    title: data.profile.fullName ?? data.user.username,
    description: data.profile.bio ?? `Profile page of ${data.user.username}`,
    openGraph: {
      images: [
        ...(data.user.image ? [data.user.image] : []),
        ...(data.profile.banner ? [data.profile.banner] : []),
        `/api/og?title=${encodeURIComponent(
          data.profile.fullName ?? data.user.username,
        )}&description=${encodeURIComponent(
          data.profile.bio ?? '',
        )}&image=${encodeURIComponent(data.user.image ?? '')}`,
      ],
      url: `/u/${data.user.id}`,
    },
  })
}
