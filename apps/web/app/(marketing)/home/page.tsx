import { CTASection } from '@/app/(marketing)/home/_components/cta'
import { FeaturesSection } from '@/app/(marketing)/home/_components/features'
import { HeroSection } from '@/app/(marketing)/home/_components/hero'
import { StatisticsSection } from '@/app/(marketing)/home/_components/statistics'
import { createMetadata } from '@/lib/metadata'

const TITLE = 'Your One-Stop Multi-Vendor Marketplace'
const DESCRIPTION =
  'Discover and shop from a wide range of trusted vendors all in one place. Enjoy seamless browsing, exclusive deals, and a secure shopping experience on our multi-vendor e-commerce platform.'

export const metadata = createMetadata({
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(TITLE)}&description=${encodeURIComponent(DESCRIPTION)}`,
        alt: 'Yukinu Home Page',
      },
    ],
  },
})

export default function HomePage() {
  return (
    <main className='flex-1'>
      <h1 className='sr-only'>Yukinu Home Page</h1>
      <HeroSection />
      <StatisticsSection />
      <FeaturesSection />
      <CTASection />
    </main>
  )
}
