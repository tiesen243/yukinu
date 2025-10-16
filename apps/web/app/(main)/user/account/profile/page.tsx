import { getQueryClient, HydrateClient, trpc } from '@/trpc/rsc'

export default function ProfilePage() {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.user.getInfo.queryOptions())

  return (
    <HydrateClient>
      <section>
        <h3 className='text-lg font-medium'>My Profile</h3>
      </section>
    </HydrateClient>
  )
}
