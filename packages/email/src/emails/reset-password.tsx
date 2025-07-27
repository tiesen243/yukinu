import {
  Button,
  Heading,
  Hr,
  Link,
  Section,
  Text,
} from '@react-email/components'

import type { SendEmailParams } from '..'
import { EmailLayout } from './_layout'

export default function ResetPasswordEmail({ data }: SendEmailParams) {
  const { name = 'Yuki', token = '' } = (data ?? {}) as Record<string, string>
  const resetUrl = `https://yukinu.vercel.app/forgot-password/reset?token=${token}`

  return (
    <EmailLayout previewText='Reset your password - Action required'>
      <Section className='my-6 rounded-lg border border-blue-200 bg-blue-50 p-6'>
        <Text className='m-0 mb-2 text-lg font-semibold text-blue-800'>
          🔑 Password Reset Request
        </Text>
        <Text className='m-0 text-sm text-blue-700'>
          We received a request to reset your account password.
        </Text>
      </Section>

      <Heading className='my-4 text-2xl leading-tight font-semibold text-black'>
        Hi {name},
      </Heading>

      <Text className='my-4 text-base leading-relaxed text-gray-600'>
        We received a request to reset the password for your account. If you
        made this request, click the button below to create a new password.
      </Text>

      <Section className='my-8 text-center'>
        <Button
          href={resetUrl}
          className='inline-block rounded-md bg-black px-6 py-3 text-center font-semibold text-white no-underline'
        >
          Reset My Password
        </Button>
      </Section>

      <Text className='my-4 text-center text-sm leading-relaxed text-gray-600'>
        This link will expire in{' '}
        <span className='font-semibold text-gray-800'>5 minutes</span> for your
        security.
      </Text>

      <Hr className='my-8 border-gray-200' />

      <Section className='my-6 rounded-lg border border-gray-200 bg-gray-50 p-6'>
        <Text className='mb-3 text-base font-semibold text-black'>
          Having trouble with the button?
        </Text>
        <Text className='mb-3 text-sm text-gray-600'>
          Copy and paste this link into your browser:
        </Text>
        <Text className='rounded border bg-white p-3 font-mono text-sm break-all text-blue-600'>
          {resetUrl}
        </Text>
      </Section>

      <Section className='my-6 rounded-lg border border-amber-200 bg-amber-50 p-6'>
        <Text className='mb-2 text-base font-semibold text-amber-800'>
          ⚠️ Didn't request this?
        </Text>
        <Text className='mb-4 text-sm text-amber-700'>
          If you didn't request a password reset, you can safely ignore this
          email. Your password will remain unchanged, and no further action is
          needed.
        </Text>
        <Text className='text-sm text-amber-700'>
          However, if you're concerned about your account security, please{' '}
          <Link
            href='mailto:security@yukinu.vercel.app'
            className='font-medium text-amber-800 underline'
          >
            contact our security team
          </Link>{' '}
          immediately.
        </Text>
      </Section>

      <Hr className='my-8 border-gray-200' />

      <Section className='my-6'>
        <Text className='mb-4 text-lg font-semibold text-black'>
          🛡️ Security Reminders:
        </Text>

        <Section className='grid gap-3'>
          <Text className='m-0 text-sm leading-relaxed text-gray-600'>
            • Choose a strong password with at least 8 characters
          </Text>
          <Text className='m-0 text-sm leading-relaxed text-gray-600'>
            • Include a mix of letters, numbers, and special characters
          </Text>
          <Text className='m-0 text-sm leading-relaxed text-gray-600'>
            • Don't reuse passwords from other accounts
          </Text>
          <Text className='m-0 text-sm leading-relaxed text-gray-600'>
            • Consider enabling two-factor authentication
          </Text>
          <Text className='m-0 text-sm leading-relaxed text-gray-600'>
            • Never share your password with anyone
          </Text>
        </Section>
      </Section>

      <Section className='my-6 rounded-lg border border-green-200 bg-green-50 p-6'>
        <Text className='mb-2 text-base font-semibold text-green-800'>
          💡 Pro Tip
        </Text>
        <Text className='text-sm text-green-700'>
          After resetting your password, consider setting up two-factor
          authentication in your account settings for enhanced security.
        </Text>
      </Section>
    </EmailLayout>
  )
}
