import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@yukinu/ui/collapsible'
import { ChevronRightIcon } from '@yukinu/ui/icons'
import { Suspense } from 'react'

import { AccountHeader } from '@/app/(main)/account/_components/header'
import { ChangePasswordForm } from '@/app/(main)/account/security/_components/change-password-form'
import { DeleteAccountButton } from '@/app/(main)/account/security/_components/delete-account-button'
import {
  SessionsList,
  SessionsListSkeleton,
} from '@/app/(main)/account/security/_components/session-list'
import { createMetadata } from '@/lib/metadata'
import { getQueryClient, HydrateClient, trpc } from '@/lib/trpc/rsc'

export const dynamic = 'force-dynamic'

export default function AccountSecurityPage() {
  void getQueryClient().prefetchQuery(trpc.security.allSessions.queryOptions())

  return (
    <HydrateClient>
      <AccountHeader
        title='Security Settings'
        description='Manage your password, two-factor authentication, and other security settings to keep your account safe.'
      />

      <section className='flex flex-col gap-4 px-4'>
        <h2 className='text-lg font-medium'>Where you are logged in</h2>

        <Suspense fallback={<SessionsListSkeleton />}>
          <SessionsList />
        </Suspense>
      </section>

      <hr />

      <section className='px-4'>
        <h2 className='sr-only'>Change Password section</h2>

        <ChangePasswordForm />
      </section>

      <hr />

      <Collapsible render={<section />} className='px-4'>
        <h2 className='sr-only'>Delete Account</h2>

        <CollapsibleTrigger className='flex w-full items-center justify-between text-lg font-medium text-destructive aria-expanded:[&>svg]:rotate-90'>
          <p>Danger Zone</p>
          <ChevronRightIcon className='transition-transform' />
        </CollapsibleTrigger>

        <CollapsibleContent className='h-(--collapsible-panel-height) pt-4 transition-[height] ease-out data-ending-style:h-0 data-starting-style:h-0'>
          <DeleteAccountButton />
        </CollapsibleContent>
      </Collapsible>
    </HydrateClient>
  )
}

const title = 'Security Settings'
const description =
  'Manage your password, and other security settings to keep your account safe.'
export const metadata = createMetadata({
  title,
  description,
  openGraph: {
    images: [
      `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(
        description,
      )}`,
    ],
    url: `/account/security`,
  },
})
