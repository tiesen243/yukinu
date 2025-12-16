import { Button, Link, Text } from '@react-email/components'

import { EmailLayout } from '@/templates/_layout'

interface InviteProps {
  username: string
  inviterName: string
  inviterEmail: string
  vendorName: string
  inviteLink: string
}

export default function Invite(props: InviteProps) {
  const { username, inviterName, inviterEmail, vendorName, inviteLink } = props

  return (
    <EmailLayout preview={`${inviterName} has invited you to join Yukinu!`}>
      <Text>Hi {username},</Text>
      <Text>
        <strong>{inviterName}</strong> ({inviterEmail}) has invited you to the{' '}
        <strong>{vendorName}</strong> on <strong>Yukinu</strong>.
      </Text>

      <Button
        href={inviteLink}
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
        Accept Invitation
      </Button>

      <Text>
        or copy and paste the following link into your browser:{' '}
        <Link href={inviteLink}>{inviteLink}</Link>
      </Text>

      <Text>
        If you were not expecting this invitation, you can ignore this email. If
        you are concerned about your account's safety, please reply to this
        email to get in touch with us.
      </Text>
    </EmailLayout>
  )
}
