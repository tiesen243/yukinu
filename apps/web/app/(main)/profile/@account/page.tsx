import { Suspense } from 'react'
import Link from 'next/link'

import { Button } from '@yukinu/ui/button'
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@yukinu/ui/card'
import { SettingsIcon } from '@yukinu/ui/icons'

import {
  BasicInformation,
  BasicInformationSkeleton,
} from '@/app/(main)/profile/@account/page.client'
import { getQueryClient, HydrateClient, trpc } from '@/trpc/rsc'

export default function AccountPage() {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.user.profile.queryOptions())

  return (
    <HydrateClient>
      <Card asChild>
        <section>
          <h3 className='sr-only'>Account Section</h3>

          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Your account details and preferences
            </CardDescription>

            <CardAction>
              <Button variant='outline' asChild>
                <Link href='/profile/edit'>
                  <SettingsIcon />
                  <span className='sr-only sm:not-sr-only'>Edit Profile</span>
                </Link>
              </Button>
            </CardAction>
          </CardHeader>

          <Suspense fallback={<BasicInformationSkeleton />}>
            <BasicInformation />
          </Suspense>
        </section>
      </Card>
    </HydrateClient>
  )
}
