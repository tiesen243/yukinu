import { Suspense } from 'react'
import { notFound } from 'next/navigation'

import { ProductDetail } from '@/app/(main)/[slug]/page.client'
import { createMetadata } from '@/lib/metadata'
import { getQueryClient, HydrateClient, trpc } from '@/trpc/rsc'

export default async function ProductDetailPage({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params
  const id = slug.split('-').pop() ?? ''

  try {
    const { product, reviews } = await getQueryClient().ensureQueryData(
      trpc.product.byId.queryOptions({ id }),
    )

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      image: product.image,
      description: product.description,
      sku: product.id,
      category: product.category,
      offers: {
        '@type': 'Offer',
        url: `https://yourstore.com/products/${product.id}`,
        priceCurrency: 'USD',
        price: (product.price * (1 - product.discount / 100)).toFixed(2),
        priceValidUntil: Date.now() + 30 * 24 * 60 * 60 * 1000,
        availability:
          product.stock > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: 'Yukinu',
        },
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: reviews.reduce((acc, review) => acc + review.rating, 0),
        reviewCount: reviews.length,
      },
    }

    return (
      <HydrateClient>
        <script
          type='application/ld+json'
          // eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <main className='container py-4'>
          <h1 className='sr-only'>{product.name}</h1>
          <Suspense
            fallback={
              <div className='flex h-[calc(100dvh-6rem)] w-full flex-col items-center justify-center gap-4'>
                <div className='size-9 animate-spin rounded-full border-4 border-primary border-t-transparent' />
                <p className='text-lg text-muted-foreground'>
                  Loading product...
                </p>
              </div>
            }
          >
            <ProductDetail id={id} />
          </Suspense>
        </main>
      </HydrateClient>
    )
  } catch {
    notFound()
  }
}

export const generateMetadata = async ({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>) => {
  const { slug } = await params
  const id = slug.split('-').pop() ?? ''

  try {
    const { product } = await getQueryClient().ensureQueryData(
      trpc.product.byId.queryOptions({ id }),
    )

    return createMetadata({
      title: product.name,
      description: product.description,
      openGraph: {
        images: [
          product.image,
          `/api/og?title=${product.name}&description=${product.description}&image=${product.image}`,
        ],
      },
    })
  } catch {
    notFound()
  }
}
