import { Suspense } from 'react'
import { notFound } from 'next/navigation'

import { Loader2Icon } from '@yukinu/ui/icons'

import { ProductDetails } from '@/app/(main)/[slug]/page.client'
import { PageProvider } from '@/app/(main)/[slug]/page.provider'
import { createMetadata } from '@/lib/metadata'
import { getQueryClient, HydrateClient, trpc } from '@/lib/trpc/rsc'

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
      },
    })
  } catch {
    notFound()
  }
}

export default async function ProductDetailsPage({
  params,
}: PageProps<'/[slug]'>) {
  const { slug } = await params
  const id = slug.split('-').pop()
  if (!id) return notFound()

  const product = await getQueryClient().ensureQueryData(
    trpc.product.one.queryOptions({ id }),
  )

  return (
    <HydrateClient>
      <main className='container flex flex-1 flex-col gap-6 py-6'>
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
  )
}
