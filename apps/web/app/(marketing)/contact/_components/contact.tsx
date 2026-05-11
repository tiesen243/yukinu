import { Card, CardHeader } from '@yukinu/ui/card'
import { Typography } from '@yukinu/ui/typography'

import { ContactForm } from '@/app/(marketing)/contact/_components/contact-form'
import { ContactInfo } from '@/app/(marketing)/contact/_components/contact-info'

export const ContactSection: React.FC = () => (
  <section className='container grid gap-12 md:grid-cols-2'>
    <h2 className='sr-only'>Contact section</h2>

    <Card render={<section />}>
      <CardHeader>
        <Typography variant='h3' className='my-0'>
          Send us a Message
        </Typography>
        <Typography className='text-muted-foreground'>
          Have questions or feedback? Fill out the form below and our team will
          get back to you as soon as possible.
        </Typography>
      </CardHeader>

      <ContactForm />
    </Card>

    <Card render={<section />}>
      <CardHeader>
        <Typography variant='h3'>Contact Information</Typography>
        <Typography className='text-muted-foreground'>
          Prefer to reach us directly? Here&apos;s how you can get in touch with
          our support team.
        </Typography>
      </CardHeader>

      <ContactInfo />
    </Card>
  </section>
)
