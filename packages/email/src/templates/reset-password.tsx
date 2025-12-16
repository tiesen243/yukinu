import { Button, Link, Section, Text } from '@react-email/components'

import { EmailLayout } from '@/templates/_layout'

interface ResetPasswordEmailProps {
  username: string
  resetLink: string
}

export default function ResetPassword(props: ResetPasswordEmailProps) {
  const { username, resetLink } = props

  const formattedDate = new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(new Date())

  return (
    <EmailLayout>
      <Text>Hi {username},</Text>
      <Text>
        You updated the password for your Yukinu account on {formattedDate}. If
        this was you, then no further action is required.
      </Text>

      <Text>
        However if you did NOT perform this password change, just ignore this
        email and your password will remain unchanged. If you want to reset your
        password, please click the link below:
      </Text>

      <Section style={{ textAlign: 'center', margin: '20px 0' }}>
        <Button
          href={resetLink}
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
          Reset Password
        </Button>
      </Section>

      <Text>
        Or copy and paste the following link into your browser:{' '}
        <Link href={resetLink}>{resetLink}</Link>
      </Text>

      <Text>
        Remember to use a password that is both strong and unique to your Yukinu
        account. To learn more about how to create a strong and unique password,{' '}
        <Link href='https://www.cisa.gov/secure-our-world/use-strong-passwords'>
          click here
        </Link>
        .
      </Text>
    </EmailLayout>
  )
}
