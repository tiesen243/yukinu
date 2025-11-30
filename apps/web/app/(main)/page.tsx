'use client'

import { useQuery } from '@tanstack/react-query'

import { useTRPC } from '@/lib/trpc/react'

export default function HomePage() {
  const trpc = useTRPC()
  const query = useQuery(trpc.user.getProfile.queryOptions({}))

  return (
    <main className='container flex-1 py-4'>
      <pre>
        {JSON.stringify(
          { queryIsLoading: query.isLoading, queryData: query.data },
          null,
          2,
        )}
      </pre>
      lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
      est laborum.
    </main>
  )
}
