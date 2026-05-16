import { ItemGroup } from '@yukinu/ui/item'
import { Typography } from '@yukinu/ui/typography'

import { AccountHeader } from '@/app/(main)/account/_components/header'
import { AddressSelector } from '@/app/(main)/account/cart/checkout/_components/address-selector'
import { Checkout } from '@/app/(main)/account/cart/checkout/_components/checkout'
import { DiscountCodeInput } from '@/app/(main)/account/cart/checkout/_components/discount-code-input'
import { OrderItems } from '@/app/(main)/account/cart/checkout/_components/order-items'
import { PaymentMethodSelector } from '@/app/(main)/account/cart/checkout/_components/payment-selector'
import { PageProvider } from '@/app/(main)/account/cart/checkout/page.provider'
import { createMetadata } from '@/lib/metadata'

export default function AccountCartCheckoutPage() {
  return (
    <PageProvider>
      <AccountHeader
        title='Checkout'
        description='Review your order and proceed to payment to complete your purchase.'
      />

      <section>
        <h2 className='sr-only'>Order Items section</h2>

        <ItemGroup className='border-b px-4 pb-6'>
          <OrderItems />
        </ItemGroup>
      </section>

      <section className='border-b px-4 pb-6 [&>h2]:mt-0'>
        <Typography variant='h2'>
          <span className='mr-2 inline-flex size-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary'>
            1
          </span>
          Shipping Address
        </Typography>

        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          <AddressSelector />
        </div>
      </section>

      <section className='border-b px-4 pb-6 [&>h2]:mt-0'>
        <Typography variant='h2'>
          <span className='mr-2 inline-flex size-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary'>
            2
          </span>
          Payment Method
        </Typography>
        <div className='space-y-3'>
          <PaymentMethodSelector />
        </div>
      </section>

      <section className='border-b px-4 pb-6 [&>h2]:mt-0'>
        <Typography variant='h2'>
          <span className='mr-2 inline-flex size-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary'>
            3
          </span>
          Discount Code
        </Typography>
        <DiscountCodeInput />
      </section>

      <section className='px-4 [&>h2]:mt-0'>
        <Typography variant='h2'>Order Summary</Typography>

        <Checkout />
      </section>
    </PageProvider>
  )
}

const title = 'Checkout'
const description =
  'Review your order and proceed to payment to complete your purchase.'
export const metadata = createMetadata({
  title,
  description,
  openGraph: {
    images: [
      `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(
        description,
      )}`,
    ],
    url: `/account/cart/checkout`,
  },
})
