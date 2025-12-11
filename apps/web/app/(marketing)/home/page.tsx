import { BuyerValue } from '@/app/(marketing)/home/_components/buyer-value'
import { CTASection } from '@/app/(marketing)/home/_components/cta'
import { FeaturesSection } from '@/app/(marketing)/home/_components/features'
import { HeroSection } from '@/app/(marketing)/home/_components/hero'
import { SellerValue } from '@/app/(marketing)/home/_components/seller-value'
import { createMetadata } from '@/lib/metadata'

export default function HomePage() {
  return (
    <main className='flex-1'>
      <h1 className='sr-only'>Landing page</h1>

      <HeroSection />
      <FeaturesSection />
      <BuyerValue />
      <SellerValue />
      <CTASection />
    </main>
  )
}

const title = 'Home'
const description =
  'Welcome to our website. Explore our features and offerings designed to provide you with the best experience.'
export const metadata = createMetadata({
  title,
  description,
  openGraph: {
    images: [
      `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(
        description,
      )}`,
    ],
    url: `/home`,
  },
})
