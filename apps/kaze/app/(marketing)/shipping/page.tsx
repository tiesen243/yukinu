import { createMetadata } from '@/lib/metadata'

export const metadata = createMetadata({
  title: 'Shipping',
  description: 'Information about our shipping policies and options.',
})

export default function ShippingPage() {
  return (
    <main className="container py-12 md:py-24">
      <h1 className="mb-8 text-4xl font-bold">Shipping Policy</h1>
      <div className="prose prose-lg max-w-none">
        <p>
          We offer free shipping on all orders over $50. For orders under $50,
          we charge a flat rate of $5 for shipping.
        </p>

        <h2 className="mt-8 text-2xl font-bold">Shipping Times</h2>
        <p>
          Orders are typically processed within 1-2 business days. Once your
          order has shipped, you will receive an email with a tracking number.
          Shipping times vary depending on your location.
        </p>
      </div>
    </main>
  )
}
