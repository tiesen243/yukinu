import { Button, Heading, Hr, Section, Text } from '@react-email/components'

import type { SendEmailParams } from '..'
import { EmailLayout } from './_layout'

export default function ChangePasswordEmail({ data }: SendEmailParams) {
  const {
    name = 'Yuki',
    ipAddress = 'unknown',
    userAgent = 'unknown',
    changeDate = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(Date.now()),
  } = (data ?? {}) as Record<string, string>

  return (
    <EmailLayout previewText='Your password has been changed successfully'>
      <Section className='my-6 rounded-lg border border-green-200 bg-green-50 p-6'>
        <Text className='m-0 mb-2 text-lg font-semibold text-green-800'>
          🔒 Password Changed Successfully
        </Text>
        <Text className='m-0 text-sm text-green-700'>
          Your account password has been updated and is now secure.
        </Text>
      </Section>

      <Heading className='my-4 text-2xl leading-tight font-semibold text-black'>
        Hi {name},
      </Heading>

      <Text className='my-4 text-base leading-relaxed text-gray-600'>
        We're writing to confirm that your account password was successfully
        changed. This email serves as a security notification to keep you
        informed about important changes to your account.
      </Text>

      <Section className='my-6 rounded-lg border border-gray-200 bg-gray-50 p-6'>
        <Text className='mb-3 text-base font-semibold text-black'>
          Change Details:
        </Text>

        <Section className='grid gap-2'>
          <Text className='m-0 text-sm text-gray-600'>
            <span className='font-medium text-gray-800'>Date & Time:</span>{' '}
            {changeDate}
          </Text>
          <Text className='m-0 text-sm text-gray-600'>
            <span className='font-medium text-gray-800'>IP Address:</span>{' '}
            {ipAddress}
          </Text>
          <Text className='m-0 text-sm text-gray-600'>
            <span className='font-medium text-gray-800'>Device:</span>{' '}
            {userAgent}
          </Text>
        </Section>
      </Section>

      <Section className='my-6 rounded-lg border border-red-200 bg-red-50 p-6'>
        <Text className='mb-2 text-base font-semibold text-red-800'>
          ⚠️ Didn't make this change?
        </Text>
        <Text className='mb-4 text-sm text-red-700'>
          If you didn't change your password, your account may have been
          compromised. Please take immediate action.
        </Text>
        <Button
          href='https://yukinu.vercel.app/account/security'
          className='inline-block rounded-md bg-red-600 px-4 py-2 text-center text-sm font-semibold text-white no-underline'
        >
          Secure My Account
        </Button>
      </Section>

      <Hr className='my-8 border-gray-200' />

      <Section className='my-6'>
        <Text className='mb-4 text-lg font-semibold text-black'>
          🛡️ Security Tips:
        </Text>

        <Section className='grid gap-3'>
          <Text className='m-0 text-sm leading-relaxed text-gray-600'>
            • Use a strong, unique password that you don't use anywhere else
          </Text>
          <Text className='m-0 text-sm leading-relaxed text-gray-600'>
            • Enable two-factor authentication for added security
          </Text>
          <Text className='m-0 text-sm leading-relaxed text-gray-600'>
            • Never share your password with anyone
          </Text>
          <Text className='m-0 text-sm leading-relaxed text-gray-600'>
            • Log out of shared or public devices after use
          </Text>
          <Text className='m-0 text-sm leading-relaxed text-gray-600'>
            • Regularly review your account activity
          </Text>
        </Section>
      </Section>

      <Section className='my-8 text-center'>
        <Button
          href='https://yukinu.vercel.app/account/profile'
          className='inline-block rounded-md bg-black px-6 py-3 text-center font-semibold text-white no-underline'
        >
          Manage Account Settings
        </Button>
      </Section>
    </EmailLayout>
  )
}
