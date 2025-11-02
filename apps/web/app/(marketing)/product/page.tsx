import { createMetadata } from '@/lib/metadata'

const TITLE = 'Explore Top Products from Multiple Vendors'
const DESCRIPTION =
  'Browse our curated selection of products from trusted vendors. Find the best deals, compare options, and enjoy a seamless shopping experience on our multi-vendor marketplace.'

export const metadata = createMetadata({
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    url: '/product',
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(TITLE)}&description=${encodeURIComponent(DESCRIPTION)}`,
        alt: 'Our Products',
      },
    ],
  },
})

export default function ProductPage() {
  return (
    <main className='container flex-1 py-4'>
      <h1 className='mb-4 text-3xl font-bold'>Our Products</h1>
    </main>
  )
}
