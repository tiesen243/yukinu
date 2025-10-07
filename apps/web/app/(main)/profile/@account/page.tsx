import { Suspense } from 'react'

import { Card, CardDescription, CardHeader, CardTitle } from '@yukinu/ui/card'

import {
  BasicInformation,
  BasicInformationSkeleton,
} from '@/app/(main)/profile/@account/page.client'
import { HydrateClient } from '@/trpc/rsc'

export default function AccountPage() {
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
          </CardHeader>

          <Suspense fallback={<BasicInformationSkeleton />}>
            <BasicInformation />
          </Suspense>
        </section>
      </Card>
    </HydrateClient>
  )
}
