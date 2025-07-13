import { createMetadata } from '@/lib/metadata'

export const metadata = createMetadata({
  title: 'Terms of Service',
  description: 'The terms and conditions for using Yukinu.',
})

export default function TermsPage() {
  return (
    <main className='container py-12 md:py-24'>
      <h1 className='mb-8 text-4xl font-bold'>Terms of Service</h1>
      <div className='prose prose-lg max-w-none'>
        <p>
          Welcome to Yukinu! These terms and conditions outline the rules and
          regulations for the use of our website and the purchase of our
          products.
        </p>

        <h2 className='mt-8 text-2xl font-bold'>1. Introduction</h2>
        <p>
          By accessing this website, we assume you accept these terms and
          conditions. Do not continue to use Yukinu if you do not agree to take
          all of the terms and conditions stated on this page.
        </p>

        <h2 className='mt-8 text-2xl font-bold'>2. Intellectual Property</h2>
        <p>
          Unless otherwise stated, Yukinu and/or its licensors own the
          intellectual property rights for all material on Yukinu. All
          intellectual property rights are reserved. You may access this from
          Yukinu for your own personal use subjected to restrictions set in
          these terms and conditions.
        </p>

        <h2 className='mt-8 text-2xl font-bold'>3. Restrictions</h2>
        <p>You are specifically restricted from all of the following:</p>
        <ul className='list-disc pl-6'>
          <li>Publishing any website material in any other media.</li>
          <li>
            Selling, sublicensing and/or otherwise commercializing any website
            material.
          </li>
          <li>Publicly performing and/or showing any website material.</li>
          <li>
            Using this website in any way that is or may be damaging to this
            website.
          </li>
          <li>
            Using this website in any way that impacts user access to this
            website.
          </li>
        </ul>

        <h2 className='mt-8 text-2xl font-bold'>4. Your Content</h2>
        <p>
          In these Website Standard Terms and Conditions, “Your Content” shall
          mean any audio, video text, images or other material you choose to
          display on this Website. By displaying Your Content, you grant Yukinu
          a non-exclusive, worldwide irrevocable, sub licensable license to use,
          reproduce, adapt, publish, translate and distribute it in any and all
          media.
        </p>

        <h2 className='mt-8 text-2xl font-bold'>5. No warranties</h2>
        <p>
          This Website is provided “as is,” with all faults, and Yukinu express
          no representations or warranties, of any kind related to this Website
          or the materials contained on this Website. Also, nothing contained on
          this Website shall be interpreted as advising you.
        </p>

        <h2 className='mt-8 text-2xl font-bold'>6. Limitation of liability</h2>
        <p>
          In no event shall Yukinu, nor any of its officers, directors and
          employees, shall be held liable for anything arising out of or in any
          way connected with your use of this Website whether such liability is
          under contract. Yukinu, including its officers, directors and
          employees shall not be held liable for any indirect, consequential or
          special liability arising out of or in any way related to your use of
          this Website.
        </p>

        <h2 className='mt-8 text-2xl font-bold'>
          7. Governing Law & Jurisdiction
        </h2>
        <p>
          These Terms will be governed by and interpreted in accordance with the
          laws of the State of Your Country, and you submit to the non-exclusive
          jurisdiction of the state and federal courts located in Your Country
          for the resolution of any disputes.
        </p>
      </div>
    </main>
  )
}
