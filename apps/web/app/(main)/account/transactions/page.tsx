import { ItemGroup } from '@yukinu/ui/item'
import { ScrollArea } from '@yukinu/ui/scroll-area'

import { AccountHeader } from '@/app/(main)/account/_components/header'
import { TransactionsHistory } from '@/app/(main)/account/transactions/page.client'
import { createMetadata } from '@/lib/metadata'

export default function AccountTransactionsPage() {
  return (
    <>
      <AccountHeader title={title} description={description} />

      <section className='flex-1 overflow-hidden px-4'>
        <h2 className='sr-only'>Transactions History List section</h2>

        <ScrollArea className='h-[calc(100dvh-12.5rem)]'>
          <ItemGroup>
            <TransactionsHistory />
          </ItemGroup>
        </ScrollArea>
      </section>
    </>
  )
}

const title = 'My Transactions'
const description =
  'Review your past transactions, track current payments, and manage refunds or disputes all in one place.'
export const metadata = createMetadata({
  title,
  description,
  openGraph: {
    images: [
      `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(
        description,
      )}`,
    ],
    url: `/account/transactions`,
  },
})
