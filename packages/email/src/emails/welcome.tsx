import { Button, Heading, Hr, Section, Text } from '@react-email/components'

import type { SendEmailParams } from '..'
import { EmailLayout } from './_layout'

export default function Welcome({ data }: SendEmailParams) {
  const { name = 'Yuki' } = (data ?? {}) as Record<string, string>

  return (
    <EmailLayout previewText='Welcome to our store - Start shopping today!'>
      <Heading className='my-4 text-2xl leading-tight font-semibold text-black'>
        Welcome to our store, {name}!
      </Heading>

      <Text className='my-4 text-base leading-relaxed text-gray-600'>
        Thank you for joining our community! We're thrilled to have you as part
        of our family. Get ready to discover amazing products, exclusive deals,
        and a shopping experience like no other.
      </Text>

      <Text className='my-4 text-base leading-relaxed text-gray-600'>
        Here's what's waiting for you:
      </Text>

      <Section className='my-8 text-center'>
        <Button
          href='https://yukinu.vercel.app'
          className='inline-block rounded-md bg-black px-6 py-3 text-center font-semibold text-white no-underline'
        >
          Start Shopping
        </Button>
      </Section>

      <Hr className='my-8 border-gray-200' />

      <Section className='my-8'>
        <Text className='mb-4 text-lg font-semibold text-black'>
          🎉 Your exclusive perks:
        </Text>

        <Section className='my-4'>
          <Text className='mb-1 text-base font-semibold text-black'>
            🛍️ 15% off your first order
          </Text>
          <Text className='m-0 text-sm leading-relaxed text-gray-600'>
            Use code WELCOME15 at checkout to save on your first purchase.
          </Text>
        </Section>

        <Section className='my-4'>
          <Text className='mb-1 text-base font-semibold text-black'>
            🚚 Free shipping on orders over $50
          </Text>
          <Text className='m-0 text-sm leading-relaxed text-gray-600'>
            Enjoy complimentary shipping on qualifying orders to your doorstep.
          </Text>
        </Section>

        <Section className='my-4'>
          <Text className='mb-1 text-base font-semibold text-black'>
            ⭐ Early access to sales
          </Text>
          <Text className='m-0 text-sm leading-relaxed text-gray-600'>
            Be the first to know about new arrivals, exclusive deals, and
            seasonal sales.
          </Text>
        </Section>

        <Section className='my-4'>
          <Text className='mb-1 text-base font-semibold text-black'>
            💎 VIP customer support
          </Text>
          <Text className='m-0 text-sm leading-relaxed text-gray-600'>
            Get priority support from our dedicated customer service team.
          </Text>
        </Section>
      </Section>
    </EmailLayout>
  )
}
