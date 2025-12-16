import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Script from 'next/script'

import { Loader2Icon } from '@yukinu/ui/icons'
import { env } from '@yukinu/validators/env.next'

import { ProductDetails } from '@/app/(main)/[slug]/page.client'
import { PageProvider } from '@/app/(main)/[slug]/page.provider'
import { createMetadata } from '@/lib/metadata'
import { getQueryClient, HydrateClient, trpc } from '@/lib/trpc/rsc'
import { getWebUrl } from '@/lib/utils'

export default async function ProductDetailsPage({
  params,
}: PageProps<'/[slug]'>) {
  const { slug } = await params
  const id = slug.split('-').pop()
  if (!id) return notFound()

  try {
    const product = await getQueryClient().ensureQueryData(
      trpc.product.one.queryOptions({ id }),
    )

    const avgRating = product.reviews.length
      ? product.reviews.reduce((acc, review) => acc + review.rating, 0) /
        product.reviews.length
      : 0

    return (
      <>
        <Script
          id='product-schema'
          type='application/ld+json'
          // eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org/',
              '@type': 'Product',
              productID: product.id,
              name: product.name,
              image: product.images.map((img) => img.url),
              description: product.description,
              sku: product.variants.at(0)?.sku ?? 'N/A',
              brand: {
                '@type': 'Thing',
                name:
                  product.attributes.find((attr) => attr.name === 'brand')
                    ?.value ?? 'Generic',
              },
              category: product.category?.name ?? 'General',
              aggregateRating: avgRating
                ? {
                    '@type': 'AggregateRating',
                    ratingValue: avgRating.toFixed(1),
                    reviewCount: product.reviews.length,
                  }
                : undefined,
              review: product.reviews.map((review) => ({
                '@type': 'Review',
                author: review.user.username,
                reviewRating: {
                  '@type': 'Rating',
                  ratingValue: review.rating.toString(),
                  bestRating: '5',
                },
                reviewBody: review.comment,
              })),
              offers: {
                '@type': 'Offer',
                url: `${getWebUrl()}/${slug}`,
                priceCurrency: 'USD',
                price: product.price,
                availability:
                  product.stock > 0
                    ? 'https://schema.org/InStock'
                    : 'https://schema.org/OutOfStock',
                itemCondition: 'https://schema.org/NewCondition',
                seller: {
                  '@type': 'Organization',
                  name: product.vendor?.name ?? env.NEXT_PUBLIC_APP_NAME,
                },
              },
            }).replace(/</g, '\\u003c'),
          }}
        />

        <HydrateClient>
          <main className='container flex flex-1 flex-col gap-6 py-4'>
            <h1 className='sr-only'>
              Product {product.name} Details Information page
            </h1>

            <Suspense
              fallback={
                <div className='flex flex-1 animate-pulse flex-col items-center justify-center gap-4'>
                  <Loader2Icon className='size-16 animate-spin' />
                  <span className='text-sm'>Loading product details...</span>
                </div>
              }
            >
              <PageProvider id={id}>
                <ProductDetails />
              </PageProvider>
            </Suspense>
          </main>
        </HydrateClient>
      </>
    )
  } catch {
    notFound()
  }
}

export const generateMetadata = async ({ params }: PageProps<'/[slug]'>) => {
  const { slug } = await params
  const id = slug.split('-').pop()
  if (!id) return notFound()

  try {
    const product = await getQueryClient().ensureQueryData(
      trpc.product.one.queryOptions({ id }),
    )

    return createMetadata({
      title: product.name,
      description: product.description,
      openGraph: {
        images: [
          ...product.images.map((img, idx) => ({
            url: img.url,
            alt: `${product.name} Image ${idx + 1}`,
          })),
          `/api/og?title=${encodeURIComponent(product.name)}&description=${encodeURIComponent(
            product.description ?? '',
          )}&image=${encodeURIComponent(product.images[0]?.url ?? '')}`,
        ],
        url: `/${slug}`,
      },
    })
  } catch {
    notFound()
  }
}
