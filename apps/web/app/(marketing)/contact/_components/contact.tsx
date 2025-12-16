import { Card } from '@yukinu/ui/card'
import { Typography } from '@yukinu/ui/typography'

import { ContactForm } from '@/app/(marketing)/contact/_components/contact-form'
import { ContactInfo } from '@/app/(marketing)/contact/_components/contact-info'

export const ContactSection: React.FC = () => (
  <section className='container grid gap-12 md:grid-cols-2'>
    <h2 className='sr-only'>Contact section</h2>

    <Card render={<section className='px-4' />}>
      <Typography variant='h3'>Send us a Message</Typography>
      <ContactForm />
    </Card>

    <Card render={<section className='px-4' />}>
      <Typography variant='h3'>Contact Information</Typography>
      <ContactInfo />
    </Card>
  </section>
)
