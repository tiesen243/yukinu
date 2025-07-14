import { createMetadata } from '@/lib/metadata'

export const metadata = createMetadata({
  title: 'Privacy Policy',
  description: 'Our privacy policy for Yukinu.',
})

export default function PolicyPage() {
  return (
    <main className='container py-12 md:py-24'>
      <h1 className='mb-8 text-4xl font-bold'>Privacy Policy</h1>
      <div className='prose prose-lg max-w-none'>
        <p>
          Your privacy is important to us. It is Yukinu&apos;s policy to respect
          your privacy regarding any information we may collect from you across
          our website.
        </p>

        <h2 className='mt-8 text-2xl font-bold'>1. Information We Collect</h2>
        <p>
          We only ask for personal information when we truly need it to provide
          a service to you. We collect it by fair and lawful means, with your
          knowledge and consent. We also let you know why we’re collecting it
          and how it will be used.
        </p>

        <h2 className='mt-8 text-2xl font-bold'>
          2. How We Use Your Information
        </h2>
        <p>We use the information we collect in various ways, including to:</p>
        <ul className='list-disc pl-6'>
          <li>Provide, operate, and maintain our website</li>
          <li>Improve, personalize, and expand our website</li>
          <li>Understand and analyze how you use our website</li>
          <li>Develop new products, services, features, and functionality</li>
          <li>
            Communicate with you, either directly or through one of our
            partners, including for customer service, to provide you with
            updates and other information relating to the website, and for
            marketing and promotional purposes
          </li>
          <li>Send you emails</li>
          <li>Find and prevent fraud</li>
        </ul>

        <h2 className='mt-8 text-2xl font-bold'>3. Log Files</h2>
        <p>
          Yukinu follows a standard procedure of using log files. These files
          log visitors when they visit websites. All hosting companies do this
          and a part of hosting services&apos; analytics. The information
          collected by log files include internet protocol (IP) addresses,
          browser type, Internet Service Provider (ISP), date and time stamp,
          referring/exit pages, and possibly the number of clicks. These are not
          linked to any information that is personally identifiable. The purpose
          of the information is for analyzing trends, administering the site,
          tracking users&apos; movement on the website, and gathering
          demographic information.
        </p>

        <h2 className='mt-8 text-2xl font-bold'>4. Cookies and Web Beacons</h2>
        <p>
          Like any other website, Yukinu uses ‘cookies’. These cookies are used
          to store information including visitors’ preferences, and the pages on
          the website that the visitor accessed or visited. The information is
          used to optimize the users’ experience by customizing our web page
          content based on visitors’ browser type and/or other information.
        </p>

        <h2 className='mt-8 text-2xl font-bold'>
          5. Third-Party Privacy Policies
        </h2>
        <p>
          Yukinu&apos;s Privacy Policy does not apply to other advertisers or
          websites. Thus, we are advising you to consult the respective Privacy
          Policies of these third-party ad servers for more detailed
          information. It may include their practices and instructions about how
          to opt-out of certain options.
        </p>

        <h2 className='mt-8 text-2xl font-bold'>
          6. Children&apos;s Information
        </h2>
        <p>
          Another part of our priority is adding protection for children while
          using the internet. We encourage parents and guardians to observe,
          participate in, and/or monitor and guide their online activity.
        </p>
        <p>
          Yukinu does not knowingly collect any Personal Identifiable
          Information from children under the age of 13. If you think that your
          child provided this kind of information on our website, we strongly
          encourage you to contact us immediately and we will do our best
          efforts to promptly remove such information from our records.
        </p>
      </div>
    </main>
  )
}
