import { createMetadata } from '@/lib/metadata'

export const metadata = createMetadata({
  title: 'FAQ',
  description: 'Frequently Asked Questions about our products and services.',
})

export default function FaqPage() {
  return (
    <main className="container py-12 md:py-24">
      <h1 className="mb-8 text-4xl font-bold">Frequently Asked Questions</h1>
      <div className="prose prose-lg max-w-none">
        <h2 className="mt-8 text-2xl font-bold">What is your return policy?</h2>
        <p>
          We accept returns within 30 days of purchase. Please see our returns
          page for more information.
        </p>

        <h2 className="mt-8 text-2xl font-bold">How do I track my order?</h2>
        <p>
          Once your order has shipped, you will receive an email with a
          tracking number.
        </p>

        <h2 className="mt-8 text-2xl font-bold">Do you ship internationally?</h2>
        <p>Yes, we ship to most countries. Please see our shipping page for more information.</p>
      </div>
    </main>
  )
}
