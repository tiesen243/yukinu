import {
  Column,
  Heading,
  Hr,
  Img,
  Row,
  Section,
  Text,
} from '@react-email/components'

import type { SendEmailParams } from '..'
import { EmailLayout } from './_layout'

interface OrderConfirmationProps extends SendEmailParams {
  data?: {
    user: {
      name: string
      email: string
    }
    order: {
      id: string
      subtotal: number
      shipping: number
      tax: number
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
}

export default function OrderConfirmation({ data }: OrderConfirmationProps) {
  const { user, order, items, address } = data ?? sampleData

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

      <Section className='my-6 rounded-lg border border-gray-200 bg-gray-100 p-6'>
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
          <Row key={item.productId} className='mb-4 flex gap-4'>
            <Column className='pr-4'>
              <Img
                src={item.productImage}
                width='80'
                height='80'
                alt={item.productName}
                className='rounded-lg object-cover'
              />
            </Column>

            <Column className='flex-1'>
              <Text className='m-0 mb-1 text-base font-semibold text-black'>
                {item.productName}
              </Text>
              <Text className='m-0 mt-2 text-sm text-gray-600'>
                Quantity: {item.quantity} × {formatCurrency(item.productPrice)}
              </Text>
              <Text className='m-0 text-base font-semibold text-black'>
                {formatCurrency(item.productPrice * item.quantity)}
              </Text>
            </Column>
          </Row>
        ))}
      </Section>

      <Section className='my-6 rounded-lg border border-gray-200 bg-gray-100 p-6'>
        <Text className='mb-4 text-lg font-semibold text-black'>
          💰 Order Summary
        </Text>

        <Section className='grid gap-2'>
          <Section className='flex justify-between'>
            <Text className='m-0 text-base text-gray-600'>Subtotal</Text>
            <Text className='m-0 text-base font-semibold text-black'>
              {formatCurrency(order.subtotal)}
            </Text>
          </Section>
          <Section className='flex justify-between'>
            <Text className='m-0 text-base text-gray-600'>Shipping</Text>
            <Text className='m-0 text-base font-semibold text-black'>
              {formatCurrency(order.shipping)}
            </Text>
          </Section>
          <Section className='flex justify-between'>
            <Text className='m-0 text-base text-gray-600'>Tax (10%)</Text>
            <Text className='m-0 text-base font-semibold text-black'>
              {formatCurrency(order.tax)}
            </Text>
          </Section>
          <Hr className='my-3 border-gray-400' />
          <Section className='flex justify-between'>
            <Text className='m-0 text-lg font-semibold text-black'>Total</Text>
            <Text className='m-0 text-lg font-semibold text-black'>
              {formatCurrency(order.subtotal + order.shipping + order.tax)}
            </Text>
          </Section>
        </Section>
      </Section>

      <Section className='my-6 rounded-lg border border-blue-200 bg-blue-100 p-6'>
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

const sampleData = {
  user: {
    name: 'Yuki',
    email: 'yuki@example.com',
  },
  order: {
    id: '123456',
    subtotal: 79.97,
    shipping: 9.99,
    tax: 97.957,
    createdAt: new Date(),
  },
  address: {
    line1: '123 Main St',
    line2: null,
    city: 'Springfield',
    state: 'IL',
    postalCode: '62701',
    country: 'USA',
  },
  items: [
    {
      productId: 'prod_001',
      productName: 'Yukinu Plush Toy',
      productImage: 'https://github.com/tiesen243.png',
      productPrice: 29.99,
      quantity: 2,
    },
    {
      productId: 'prod_002',
      productName: 'Yukinu T-Shirt',
      productImage: 'https://github.com/tiesen243.png',
      productPrice: 19.99,
      quantity: 1,
    },
  ],
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
