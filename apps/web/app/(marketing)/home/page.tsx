import { CTASection } from '@/app/(marketing)/home/_components/cta'
import { FeaturesSection } from '@/app/(marketing)/home/_components/features'
import { HeroSection } from '@/app/(marketing)/home/_components/hero'
import { StatisticsSection } from '@/app/(marketing)/home/_components/statistics'

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
