import { Badge } from '@yuki/ui/badge'
import { Button } from '@yuki/ui/button'
import { Card, CardContent } from '@yuki/ui/card'
import { CheckCircleIcon, InfoIcon, SettingsIcon } from '@yuki/ui/icons'
import { Typography } from '@yuki/ui/typography'

import { createMetadata } from '@/lib/metadata'
import { cookieFeatures, cookieTypes } from './page.config'

export const metadata = createMetadata({
  title: 'Cookie Policy',
  description:
    'Learn about our cookie policy and how we use cookies on our website.',
})

export default function CookiesPolicyPage() {
  return (
    <main>
      <section className='bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-20 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950'>
        <div className='container text-center'>
          <Badge variant='secondary' className='mb-6'>
            🍪 Your Privacy Matters
          </Badge>

          <Typography variant='h1' className='mb-6'>
            Cookies Policy
          </Typography>

          <Typography className='mx-auto mb-8 max-w-3xl text-xl text-muted-foreground'>
            This policy explains how Yukinu uses cookies and similar
            technologies to provide, improve, and protect our services. By using
            our website, you agree to our use of cookies as described in this
            policy.
          </Typography>

          <div className='mt-12 grid gap-6 md:grid-cols-3'>
            {cookieFeatures.map((feature) => (
              <div key={feature.title} className='text-center'>
                <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary shadow-sm'>
                  {feature.icon}
                </div>
                <Typography variant='h6' className='mb-2'>
                  {feature.title}
                </Typography>
                <Typography
                  variant='caption'
                  component='p'
                  className='text-muted-foreground'
                >
                  {feature.description}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='container py-20'>
        <Typography variant='h2' className='mb-12 text-center'>
          What are Cookies?
        </Typography>
        <Typography className='mb-6 text-muted-foreground'>
          Cookies are small text files that are placed on your computer or
          mobile device when you visit a website. They are widely used to make
          websites work more efficiently, as well as to provide information to
          the owners of the site. Cookies enable the website to remember your
          actions and preferences (such as login, language, font size, and other
          display preferences) over a period of time, so you don't have to keep
          re-entering them whenever you come back to the site or browse from one
          page to another.
        </Typography>
        <Typography className='mb-0 text-muted-foreground'>
          Cookies can be "persistent" or "session" cookies. Persistent cookies
          remain on your personal computer or mobile device when you go offline,
          while session cookies are deleted as soon as you close your web
          browser.
        </Typography>
      </section>

      <section className='bg-secondary py-20'>
        <div className='container'>
          <div className='mb-16 text-center'>
            <Typography variant='h2' className='mb-4'>
              How We Use Cookies
            </Typography>
            <Typography className='mx-auto max-w-2xl text-muted-foreground'>
              We use cookies for various purposes to enhance your experience on
              Yukinu.
            </Typography>
          </div>

          <div className='grid gap-8 md:grid-cols-2'>
            {cookieTypes.map((type) => (
              <Card
                key={type.title}
                className='border-0 shadow-sm transition-shadow hover:shadow-md'
              >
                <CardContent className='p-8'>
                  <div className='mb-6 flex items-start space-x-4'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
                      <div className='text-primary'>{type.icon}</div>
                    </div>
                    <div className='flex-1'>
                      <Typography variant='h4' className='mb-2'>
                        {type.title}
                      </Typography>
                      <Typography className='mb-4 text-muted-foreground'>
                        {type.description}
                      </Typography>
                    </div>
                  </div>

                  <div>
                    <Typography variant='h6' className='mb-3'>
                      Examples
                    </Typography>
                    <ul className='space-y-2'>
                      {type.examples.map((example) => (
                        <li
                          key={example}
                          className='flex items-center space-x-2'
                        >
                          <CheckCircleIcon className='h-4 w-4 text-green-500' />
                          <Typography className='text-sm text-muted-foreground'>
                            {example}
                          </Typography>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className='container py-20'>
        <Typography variant='h2' className='mb-12 text-center'>
          Managing Your Cookie Preferences
        </Typography>
        <Typography className='mb-6 text-muted-foreground'>
          You have the right to decide whether to accept or reject cookies. You
          can exercise your cookie preferences by clicking on the appropriate
          opt-out links provided in the "How We Use Cookies" section above, or
          by setting your browser to refuse all or some browser cookies, or to
          alert you when websites set or access cookies.
        </Typography>
        <Typography className='mb-6 text-muted-foreground'>
          If you disable or refuse cookies, please note that some parts of this
          website may become inaccessible or not function properly.
        </Typography>

        <div className='space-y-6'>
          <Card className='border-info bg-info/10 shadow-sm'>
            <CardContent className='p-8'>
              <div className='flex items-start space-x-4'>
                <InfoIcon className='mt-1 h-6 w-6 text-info' />
                <div>
                  <Typography variant='h5' className='mb-3 text-info'>
                    Browser Settings
                  </Typography>
                  <Typography className='mb-4 text-info/90'>
                    Most web browsers allow some control of most cookies through
                    the browser settings. To find out more about cookies,
                    including how to see what cookies have been set and how to
                    manage and delete them, visit{' '}
                    <a
                      href='https://www.allaboutcookies.org'
                      className='text-info/80 hover:underline'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      www.allaboutcookies.org
                    </a>
                    .
                  </Typography>
                  <Typography className='text-sm text-info/80'>
                    For specific browser instructions:
                  </Typography>
                  <ul className='mt-2 list-inside list-disc space-y-1 text-sm text-info/80'>
                    <li>
                      Google Chrome: Settings &gt; Privacy and security &gt;
                      Cookies and other site data
                    </li>
                    <li>
                      Mozilla Firefox: Options &gt; Privacy & Security &gt;
                      Cookies and Site Data
                    </li>
                    <li>
                      Microsoft Edge: Settings &gt; Privacy, search, and
                      services &gt; Clear browsing data
                    </li>
                    <li>
                      Apple Safari: Preferences &gt; Privacy &gt; Manage Website
                      Data
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='border-warning bg-warning/10 shadow-sm'>
            <CardContent className='p-8'>
              <div className='flex items-start space-x-4'>
                <SettingsIcon className='mt-1 h-6 w-6 text-warning' />
                <div>
                  <Typography variant='h5' className='mb-3 text-warning'>
                    Cookie Consent Tool
                  </Typography>
                  <Typography className='mb-4 text-warning/90'>
                    You can also manage your preferences directly through our
                    website's cookie consent tool, which appears when you first
                    visit our site. This tool allows you to accept or reject
                    different categories of cookies.
                  </Typography>
                  <Button
                    variant='outline'
                    className='bg-warning text-warning hover:bg-warning/90 hover:text-warning/90'
                    asChild
                  >
                    <a
                      href='https://youtu.be/9lNZ_Rnr7Jc'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      Open Cookie Settings
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className='bg-secondary py-20'>
        <div className='container'>
          <Typography variant='h2' className='mb-12 text-center'>
            Changes to This Cookies Policy
          </Typography>
          <Typography className='mb-6 text-muted-foreground'>
            We may update our Cookies Policy from time to time. We will notify
            you of any changes by posting the new Cookies Policy on this page.
            We will let you know via email and/or a prominent notice on our
            service, prior to the change becoming effective and update the "Last
            updated" date at the top of this Cookies Policy.
          </Typography>
          <Typography className='mb-0 text-muted-foreground'>
            You are advised to review this Cookies Policy periodically for any
            changes. Changes to this Cookies Policy are effective when they are
            posted on this page.
          </Typography>
        </div>
      </section>
    </main>
  )
}
