import {
  Body,
  Container,
  Font,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface EmailLayoutProps {
  preview?: string
  children: React.ReactNode
}

export function EmailLayout({ preview, children }: Readonly<EmailLayoutProps>) {
  return (
    <Html lang='en'>
      <Head>
        <Preview>
          {preview ?? 'This is an important email from Yukinu.'}
        </Preview>

        <Font
          fontFamily='Geist'
          fallbackFontFamily='sans-serif'
          webFont={{
            url: 'https://fonts.gstatic.com/s/geist/v4/gyByhwUxId8gMEwcGFU.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle='normal'
        />
      </Head>

      <Body style={{ backgroundColor: '#fafafa' }}>
        <Container
          style={{
            borderRadius: '12px',
            border: '1px solid #e4e4e4',
            backgroundColor: '#ffffff',
            padding: '24px',
          }}
        >
          <Img
            src='https://yukinu.vercel.app/web-app-manifest-512x512.png'
            width={64}
            height={64}
            alt='Yukinu Logo'
            style={{
              margin: '0 auto 20px auto',
              borderRadius: '8px',
              objectFit: 'cover',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          />

          {children}

          <Text>
            Still have questions? Please contact{' '}
            <Link href='mailto:support@tiesen.id.vn'>Yukinu Support</Link>
          </Text>

          <Text>
            Thanks,
            <br />
            Yukinu Support Team
          </Text>
        </Container>

        <Section style={{ textAlign: 'center', color: '#525252' }}>
          <Text>@ {new Date().getFullYear()} Yukinu. All rights reserved.</Text>
          <Text>67 Skibidi Street, Ligma City, Goon 693618, Earth</Text>
        </Section>
      </Body>
    </Html>
  )
}
