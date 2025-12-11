import { ContactForm } from '@/app/(marketing)/contact/_components/contact-form'
import { ContactInfo } from '@/app/(marketing)/contact/_components/contact-info'

export const ContactSection: React.FC = () => (
  <section className='container grid gap-12 py-16 md:grid-cols-2 md:py-24 lg:gap-16'>
    <h2 className='sr-only'>Contact section</h2>

    <section>
      <h3 className='mb-8 text-2xl font-bold text-foreground'>
        Send us a Message
      </h3>
      <ContactForm />
    </section>

    <section>
      <h3 className='mb-8 text-2xl font-bold text-foreground'>
        Contact Information
      </h3>
      <ContactInfo />
    </section>
  </section>
)
