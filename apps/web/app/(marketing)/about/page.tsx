import { CoreValuesSection } from '@/app/(marketing)/about/_components/core-values'
import { HeroSection } from '@/app/(marketing)/about/_components/hero'
import { MissionAndVisionSection } from '@/app/(marketing)/about/_components/mission-and-vision'
import { StorySection } from '@/app/(marketing)/about/_components/story'
import { TeamSection } from '@/app/(marketing)/about/_components/team'
import { createMetadata } from '@/lib/metadata'

export default function AboutPage() {
  return (
    <main className='flex-1'>
      <h1 className='sr-only'>About Us page</h1>

      <HeroSection />
      <MissionAndVisionSection />
      <CoreValuesSection />
      <StorySection />
      <TeamSection />
    </main>
  )
}

const title = 'About Us'
const description =
  'Learn more about our company, mission, and values. Discover how we strive to provide the best products and services to our customers.'
export const metadata = createMetadata({
  title,
  description,
  openGraph: {
    images: [
      `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(
        description,
      )}`,
    ],
    url: `/about`,
  },
})
