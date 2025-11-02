import { createMetadata } from '@/lib/metadata'

const TITLE = 'Contact Us'
const DESCRIPTION =
  "Have questions or need support? Reach out to our team for assistance with your shopping or vendor experience on our multi-vendor e-commerce platform. We're here to help!"

export const metadata = createMetadata({
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    url: '/contact',
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(TITLE)}&description=${encodeURIComponent(DESCRIPTION)}`,
        alt: 'Contact Us',
      },
    ],
  },
})

export default function ContactPage() {
  return (
    <main className='container flex-1 py-4'>
      <h1 className='mb-4 text-3xl font-bold'>Contact Us</h1>
    </main>
  )
}
