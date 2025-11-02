import { createMetadata } from '@/lib/metadata'

const TITLE = 'Careers'
const DESCRIPTION =
  'Explore exciting career opportunities and become part of our dynamic team. Help shape the future of online shopping on our multi-vendor e-commerce platform.'

export const metadata = createMetadata({
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(TITLE)}&description=${encodeURIComponent(DESCRIPTION)}`,
        alt: 'Careers',
      },
    ],
  },
})
export default function CareersPage() {
  return (
    <main className='container flex-1 py-4'>
      <h1 className='mb-4 text-3xl font-bold'>Careers</h1>
    </main>
  )
}
