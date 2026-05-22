import { AccountHeader } from '@/app/(main)/account/_components/header'
import { PaymentDetails } from '@/app/(main)/account/orders/checkout/[id]/page.client'

export default async function AccountOrdersCheckoutPage({
  params,
}: PageProps<'/account/orders/checkout/[id]'>) {
  const { id } = await params

  return (
    <>
      <AccountHeader
        title='Order Checkout'
        description='Review your order details, confirm your purchase, and complete the checkout process securely and efficiently.'
      />

      <section className='grid gap-4 px-4 md:grid-cols-3'>
        <h2 className='sr-only'>Order Checkout Details section</h2>

        <PaymentDetails paymentId={id} />
      </section>
    </>
  )
}
