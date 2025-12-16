import { Typography } from '@yukinu/ui/typography'

export const HeroSection: React.FC = () => (
  <section className='container py-12 text-center'>
    <Typography variant='h2'>Get in Touch</Typography>
    <Typography className='mx-auto max-w-2xl text-muted-foreground'>
      Have a question or feedback? We'd love to hear from you. Our team is ready
      to assist.
    </Typography>
  </section>
)
