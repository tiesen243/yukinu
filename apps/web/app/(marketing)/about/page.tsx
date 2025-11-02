import { createMetadata } from '@/lib/metadata'

const TITLE = 'About Us'
const DESCRIPTION =
  'Learn more about our mission, values, and the team behind our multi-vendor e-commerce platform. Discover how we connect buyers and sellers for a seamless online shopping experience.'

export const metadata = createMetadata({
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    url: '/about',
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(TITLE)}&description=${encodeURIComponent(DESCRIPTION)}`,
        alt: 'About Us',
      },
    ],
  },
})

export default function AboutPage() {
  return (
    <main className='container flex-1 py-4'>
      <h1 className='mb-4 text-3xl font-bold'>About Us</h1>
    </main>
  )
}
