import { AccountHeader } from '@/app/(main)/account/_components/header'
import { ProductReview } from '@/app/(main)/account/orders/[id]/review/page.client'

export default async function OrderReviewPage({
  params,
}: PageProps<'/account/orders/[id]/review'>) {
  const { id: rawId } = await params
  const id = Number.parseInt(rawId, 10)

  return (
    <>
      <AccountHeader
        title='Leave a Review'
        description='Share your feedback and help others make informed decisions by leaving a review for your recent purchase. Your insights are valuable to us and the community!'
      />

      <section className='flex flex-1 flex-col gap-6 px-4'>
        <h2 className='sr-only'>Leave a Review section</h2>

        <ProductReview id={id} />
      </section>
    </>
  )
}
