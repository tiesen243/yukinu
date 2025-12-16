import { Typography } from '@yukinu/ui/typography'

export const HeroSection: React.FC = () => (
  <section className='container py-20 text-center'>
    <Typography variant='h2'>About Yukinu</Typography>
    <Typography className='mx-auto max-w-3xl text-muted-foreground'>
      We're building the future of e-commerce by connecting sellers and buyers
      through a trusted, transparent, and innovative multi-vendor platform.
    </Typography>
  </section>
)
