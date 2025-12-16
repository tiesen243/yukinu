import { Button, Link, Section, Text } from '@react-email/components'

import { EmailLayout } from '@/templates/_layout'

interface WelcomeEmailProps {
  username: string
  verificationLink?: string
}

export default function Welcome(props: WelcomeEmailProps) {
  const { username, verificationLink } = props

  return (
    <EmailLayout>
      <Text>Hi {username},</Text>
      <Text>Welcome to Yukinu! We're excited to have you on board.</Text>

      {verificationLink && (
        <>
          <Text>
            To get started, please verify your email address by clicking the
            link below:
          </Text>
          <Section style={{ textAlign: 'center', margin: '20px 0' }}>
            <Button
              href={verificationLink}
              style={{
                backgroundColor: '#3f5ec2',
                color: 'white',
                textDecoration: 'none',
                padding: '10px 16px',
                borderRadius: '6px',
                fontWeight: '500',
                fontSize: '14px',
                lineHeight: '20px',
                margin: '0 auto',
              }}
            >
              Verify Email
            </Button>
          </Section>

          <Text>
            or copy and paste the following link into your browser:{' '}
            <Link href={verificationLink}>{verificationLink}</Link>
          </Text>
        </>
      )}

      <Text>
        If you did not sign up for a Yukinu account, please ignore this email.
      </Text>
    </EmailLayout>
  )
}
