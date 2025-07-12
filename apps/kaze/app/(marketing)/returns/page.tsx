import { createMetadata } from '@/lib/metadata'

export const metadata = createMetadata({
  title: 'Returns',
  description: 'Information about our returns policy and process.',
})

export default function ReturnsPage() {
  return (
    <main className="container py-12 md:py-24">
      <h1 className="mb-8 text-4xl font-bold">Returns Policy</h1>
      <div className="prose prose-lg max-w-none">
        <p>
          We want you to be happy with your purchase. If you are not satisfied,
          you can return your item for a full refund within 30 days of purchase.
        </p>

        <h2 className="mt-8 text-2xl font-bold">How to Make a Return</h2>
        <p>
          To make a return, please email us at
          <a href="mailto:returns@yukinu.com">returns@yukinu.com</a> with your
          order number and the reason for your return. We will provide you with
          a return shipping label and instructions on how to return your item.
        </p>
      </div>
    </main>
  )
}
