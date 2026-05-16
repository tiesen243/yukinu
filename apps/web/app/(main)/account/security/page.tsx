import { Button } from '@yukinu/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@yukinu/ui/collapsible'
import { ChevronRightIcon } from '@yukinu/ui/icons'

import { AccountHeader } from '@/app/(main)/account/_components/header'
import { ChangePasswordForm } from '@/app/(main)/account/security/_components/change-password-form'
import { SessionsList } from '@/app/(main)/account/security/_components/session-list'
import { createMetadata } from '@/lib/metadata'

export default function AccountSecurityPage() {
  return (
    <>
      <AccountHeader
        title='Security Settings'
        description='Manage your password, two-factor authentication, and other security settings to keep your account safe.'
      />

      <section className='flex flex-col gap-4 px-4'>
        <h2 className='text-lg font-medium'>Where you are logged in</h2>

        <SessionsList />
      </section>

      <hr />

      <section className='px-4'>
        <h2 className='sr-only'>Change Password section</h2>

        <ChangePasswordForm />
      </section>

      <hr />

      <Collapsible render={<section />} className='px-4'>
        <h2 className='sr-only'>Delete Account</h2>

        <CollapsibleTrigger className='group inline-flex w-full items-center gap-2 rounded-md px-2 py-1 text-lg font-medium text-destructive [&_svg]:size-4'>
          Danger Zone
          <div className='flex-1' />
          <ChevronRightIcon className='transition-[rotate] duration-200 ease-out group-data-panel-open:rotate-90' />
        </CollapsibleTrigger>

        <CollapsibleContent className='h-(--collapsible-panel-height) pt-4 transition-[height] ease-out data-ending-style:h-0 data-starting-style:h-0'>
          <Button variant='destructive'>Delete Account</Button>
        </CollapsibleContent>
      </Collapsible>
    </>
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
