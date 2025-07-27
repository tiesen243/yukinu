import { Heading, Hr, Img, Section, Text } from '@react-email/components'

import type { SendEmailParams } from '..'
import { EmailLayout } from './_layout'

const SHIPPING = 9.99
const TAX = 0.08

export default function OrderConfirmation({ data }: SendEmailParams) {
  const { user, order, items, address } =
    data as unknown as OrderConfirmationData

  const estimatedDelivery = new Date(order.createdAt)
  estimatedDelivery.setDate(
    estimatedDelivery.getDate() + 7 + Math.floor(Math.random() * 4),
  )

  return (
    <EmailLayout
      previewText={`Order confirmation #${order.id} - Thank you for your purchase!`}
    >
      <Section className='my-6 rounded-lg border border-green-200 bg-green-50 p-6'>
        <Text className='m-0 mb-2 text-lg font-semibold text-green-800'>
          ✅ Order Confirmed!
        </Text>
        <Text className='m-0 text-sm text-green-700'>
          Thank you for your purchase. We're preparing your order for shipment.
        </Text>
      </Section>

      <Heading className='my-4 text-2xl leading-tight font-semibold text-black'>
        Hi {user.name},
      </Heading>

      <Text className='my-4 text-base leading-relaxed text-gray-600'>
        Thank you for your order! We've received your purchase and are getting
        it ready for shipment. You'll receive another email with tracking
        information once your order ships.
      </Text>

      <Section className='my-6 rounded-lg border border-gray-200 bg-gray-50 p-6'>
        <Text className='mb-4 text-lg font-semibold text-black'>
          📦 Order Details
        </Text>

        <Section className='mb-4 grid grid-cols-2 gap-4'>
          <Section>
            <Text className='m-0 mb-1 text-sm text-gray-600'>Order Number</Text>
            <Text className='m-0 text-base font-semibold text-black'>
              #{order.id}
            </Text>
          </Section>
          <Section>
            <Text className='m-0 mb-1 text-sm text-gray-600'>Order Date</Text>
            <Text className='m-0 text-base font-semibold text-black'>
              {formatDate(order.createdAt)}
            </Text>
          </Section>
        </Section>

        <Section className='grid grid-cols-2 gap-4'>
          <Section>
            <Text className='m-0 mb-1 text-sm text-gray-600'>Email</Text>
            <Text className='m-0 text-base font-semibold text-black'>
              {user.email}
            </Text>
          </Section>
          <Section>
            <Text className='m-0 mb-1 text-sm text-gray-600'>
              Estimated Delivery
            </Text>
            <Text className='m-0 text-base font-semibold text-black'>
              {formatDate(estimatedDelivery)}
            </Text>
          </Section>
        </Section>
      </Section>

      <Section className='my-6'>
        <Text className='mb-4 text-lg font-semibold text-black'>
          🛍️ Items Ordered
        </Text>

        {items.map((item) => (
          <Section
            key={item.productId}
            className='mb-4 border-b border-gray-200 pb-4 last:mb-0 last:border-b-0'
          >
            <Section className='flex gap-4'>
              <Img
                src={item.productImage}
                width='80'
                height='80'
                alt={item.productName}
                className='rounded-lg object-cover'
              />
              <Section className='flex-1'>
                <Text className='m-0 mb-1 text-base font-semibold text-black'>
                  {item.productName}
                </Text>
                <Text className='m-0 mt-2 text-sm text-gray-600'>
                  Quantity: {item.quantity} ×{' '}
                  {formatCurrency(item.productPrice)}
                </Text>
              </Section>
              <Section className='text-right'>
                <Text className='m-0 text-base font-semibold text-black'>
                  {formatCurrency(item.productPrice * item.quantity)}
                </Text>
              </Section>
            </Section>
          </Section>
        ))}
      </Section>

      <Section className='my-6 rounded-lg border border-gray-200 bg-gray-50 p-6'>
        <Text className='mb-4 text-lg font-semibold text-black'>
          💰 Order Summary
        </Text>

        <Section className='space-y-2'>
          <Section className='flex justify-between'>
            <Text className='m-0 text-base text-gray-600'>Subtotal</Text>
            <Text className='m-0 text-base text-gray-600'>
              {formatCurrency(order.total)}
            </Text>
          </Section>
          <Section className='flex justify-between'>
            <Text className='m-0 text-base text-gray-600'>Shipping</Text>
            <Text className='m-0 text-base text-gray-600'>
              {formatCurrency(SHIPPING)}
            </Text>
          </Section>
          <Section className='flex justify-between'>
            <Text className='m-0 text-base text-gray-600'>Tax</Text>
            <Text className='m-0 text-base text-gray-600'>
              {formatCurrency(order.total * TAX)}
            </Text>
          </Section>
          <Hr className='my-3 border-gray-300' />
          <Section className='flex justify-between'>
            <Text className='m-0 text-lg font-semibold text-black'>Total</Text>
            <Text className='m-0 text-lg font-semibold text-black'>
              {formatCurrency(order.total + SHIPPING + order.total * TAX)}
            </Text>
          </Section>
        </Section>
      </Section>

      <Section className='my-6 rounded-lg border border-blue-200 bg-blue-50 p-6'>
        <Text className='mb-4 text-lg font-semibold text-black'>
          🚚 Shipping Address
        </Text>
        <Text className='m-0 text-base leading-relaxed text-gray-700'>
          {address.line1}
          {address.line2 ? `, ${address.line2}` : ''}
          <br />
          {address.city}, {address.state} {address.postalCode}
          <br />
          {address.country}
        </Text>
      </Section>
    </EmailLayout>
  )
}

interface OrderConfirmationData {
  user: {
    name: string
    email: string
  }
  order: {
    id: string
    total: number
    createdAt: Date
  }
  address: {
    line1: string
    line2: string | null
    city: string
    state: string
    postalCode: string
    country: string
  }
  items: {
    productId: string
    productName: string
    productImage: string
    productPrice: number
    quantity: number
  }[]
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}
