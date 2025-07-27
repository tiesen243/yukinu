import {
  Body,
  Container,
  Font,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

interface EmailLayoutProps {
  previewText: string
  children: React.ReactNode
}

export function EmailLayout(props: Readonly<EmailLayoutProps>) {
  const { previewText, children } = props

  return (
    <Html lang='en'>
      <Head>
        <Font
          fontFamily='Geist'
          fallbackFontFamily='Verdana'
          webFont={{
            url: 'https://fonts.gstatic.com/s/geist/v1/gyByhwUxId8gMEwcGFU.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle='normal'
        />
        <Preview>{previewText}</Preview>
      </Head>

      <Tailwind>
        <Body className='h-full w-full bg-white font-sans'>
          <Container
            className='mx-auto max-w-[580px] py-5 pb-12'
            style={{
              fontFamily:
                'Geist, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
          >
            <Section className='px-12'>
              <Img
                src='https://tiesen.id.vn/assets/images/logo.png'
                width='80'
                height='80'
                alt='Yukinu Logo'
                className='mx-auto'
              />
            </Section>

            <Section className='px-12'>
              {children}

              <Hr className='my-8 border-gray-200' />

              <Text className='my-4 text-base leading-relaxed text-gray-600'>
                Need help? Our customer service team is here for you 24/7. Visit
                our{' '}
                <Link
                  href='https://yukinu.vercel.app/help'
                  className='text-blue-600 underline'
                >
                  Help Center
                </Link>{' '}
                or contact us at{' '}
                <Link
                  href='mailto:support@yukinu.vercel.app'
                  className='text-blue-600 underline'
                >
                  support@yukinu.vercel.app
                </Link>
                .
              </Text>

              <Text className='mt-8 mb-0 text-sm leading-relaxed text-gray-600'>
                Happy shopping!
                <br />
                <Img
                  src='https://tiesen.id.vn/assets/images/tiesen.png'
                  width='200'
                  height='80'
                  alt='Tiesen Logo'
                />
              </Text>

              <Hr className='my-8 border-gray-200' />

              <Text className='m-0 text-center text-xs leading-relaxed text-gray-400'>
                You're receiving this email because you signed up for an
                account. If you no longer wish to receive these emails, you can{' '}
                <Link
                  href='https://youtu.be/dQw4w9WgXcQ'
                  className='text-gray-400 underline'
                >
                  unsubscribe here
                </Link>
                .
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
