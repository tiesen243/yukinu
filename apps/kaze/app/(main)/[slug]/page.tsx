import { Suspense } from 'react'
import { notFound } from 'next/navigation'

import { ProductCardSkeleton } from '@/app/_components/product-card'
import {
  ProductDetail,
  RelativeProducts,
} from '@/app/(main)/[slug]/page.client'
import { createMetadata } from '@/lib/metadata'
import { getBaseUrl } from '@/lib/utils'
import { getQueryClient, HydrateClient, trpc } from '@/trpc/rsc'

export default async function ProductDetailPage({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params
  const id = slug.split('-').pop() ?? ''

  const queryClient = getQueryClient()

  try {
    const { product, reviews } = await queryClient.ensureQueryData(
      trpc.product.byId.queryOptions({ id }),
    )
    void queryClient.prefetchQuery(
      trpc.product.relativeProducts.queryOptions({
        categoryId: product.category.id,
        id,
      }),
    )

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      image: product.image,
      description: product.description,
      sku: product.id,
      category: product.category.name,
      offers: {
        '@type': 'Offer',
        url: `${getBaseUrl()}/${slug}`,
        priceCurrency: 'USD',
        price: (
          parseFloat(product.price) *
          (1 - product.discount / 100)
        ).toFixed(2),
        priceValidUntil: Date.now() + 30 * 24 * 60 * 60 * 1000,
        availability:
          product.stock > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: product.seller.name,
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

          <section className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            <h2 className='sr-only'>Related Products</h2>

            <Suspense
              fallback={Array.from({ length: 12 }, (_, idx) => (
                <ProductCardSkeleton key={idx} />
              ))}
            >
              <RelativeProducts
                categoryId={product.category.id}
                productId={product.id}
              />
            </Suspense>
          </section>
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
          `/api/og?title=${encodeURIComponent(product.name)}&description=${encodeURIComponent(product.description)}&image=${product.image}`,
          product.image,
        ],
      },
    })
  } catch {
    notFound()
  }
}
