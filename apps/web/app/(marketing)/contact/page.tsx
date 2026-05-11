import { ContactSection } from '@/app/(marketing)/contact/_components/contact'
import { HeroSection } from '@/app/(marketing)/contact/_components/hero'
import { MapSection } from '@/app/(marketing)/contact/_components/map'
import { createMetadata } from '@/lib/metadata'

export default function ContactPage() {
  return (
    <main className='flex-1'>
      <h1 className='sr-only'>Contact Us page</h1>

      <HeroSection />
      <ContactSection />
      <MapSection />
    </main>
  )
}

const title = 'Contact Us'
const description =
  'Get in touch with our team for any inquiries, support, or feedback. We are here to assist you and provide the information you need.'
export const metadata = createMetadata({
  title,
  description,
  openGraph: {
    images: [
      `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(
        description,
      )}`,
    ],
    url: `/contact`,
  },
})
