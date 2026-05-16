import { ItemGroup } from '@yukinu/ui/item'

import { AccountHeader } from '@/app/(main)/account/_components/header'
import { OrderItems } from '@/app/(main)/account/orders/[id]/_components/order-items'
import { OrderSummary } from '@/app/(main)/account/orders/[id]/_components/order-summary'
import { TotalAmount } from '@/app/(main)/account/orders/[id]/_components/total-amount'
import { createMetadata } from '@/lib/metadata'

export default async function OrderDetailsPage({
  params,
}: PageProps<'/account/orders/[id]'>) {
  const { id: rawId } = await params
  const id = Number.parseInt(rawId, 10)

  return (
    <>
      <AccountHeader
        title={`Order #${id}`}
        description={`Details for order #${id}. Review your order items, track shipment status, and manage returns or exchanges all in one place.`}
      />

      <section className='px-4'>
        <h2 className='sr-only'>Order Status section</h2>

        <OrderSummary id={id} />
      </section>

      <section className='flex-1 px-4'>
        <h2 className='sr-only'>Order Details section</h2>

        <ItemGroup>
          <OrderItems id={id} />
        </ItemGroup>
      </section>

      <section className='border-t px-4 pt-4'>
        <h2 className='sr-only'>Order Summary section</h2>

        <TotalAmount id={id} />
      </section>
    </>
  )
}

export const generateMetadata = async ({
  params,
}: PageProps<'/account/orders/[id]'>) => {
  const { id: rawId } = await params
  const id = Number.parseInt(rawId, 10)

  const title = `Order #${id}`
  const description = `Details for order #${id}. Review your order items, track shipment status, and manage returns or exchanges all in one place.`

  return createMetadata({
    title,
    description,
    openGraph: {
      images: [
        `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(
          description,
        )}`,
      ],
      url: `/account/orders/${id}`,
    },
  })
}
