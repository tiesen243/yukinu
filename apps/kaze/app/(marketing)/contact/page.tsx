import { createMetadata } from '@/lib/metadata'

export const metadata = createMetadata({
  title: 'Contact Us',
  description: 'Get in touch with us for any inquiries or support.',
})

export default function ContactPage() {
  return (
    <main className="container py-12 md:py-24">
      <h1 className="mb-8 text-4xl font-bold">Contact Us</h1>
      <div className="prose prose-lg max-w-none">
        <p>
          Have a question or need some help? We&apos;d love to hear from you.
          Please feel free to reach out to us using the contact information
          below.
        </p>

        <h2 className="mt-8 text-2xl font-bold">Our Address</h2>
        <p>
          1234 Street Name
          <br />
          City, State, 12345
        </p>

        <h2 className="mt-8 text-2xl font-bold">Email Us</h2>
        <p>
          For general inquiries, please email us at:
          <a href="mailto:info@yukinu.com">info@yukinu.com</a>
        </p>
        <p>
          For support, please email us at:
          <a href="mailto:support@yukinu.com">support@yukinu.com</a>
        </p>
      </div>
    </main>
  )
}
