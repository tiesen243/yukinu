import Link from 'next/link'

import { Badge } from '@yuki/ui/badge'
import { Button } from '@yuki/ui/button'
import { Card, CardContent } from '@yuki/ui/card'
import {
  AlertCircleIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  DollarSignIcon,
  MapPinIcon,
  PackageIcon,
} from '@yuki/ui/icons'
import { Typography } from '@yuki/ui/typography'

import { createMetadata } from '@/lib/metadata'
import {
  deliveryFeatures,
  internationalRestrictions,
  restrictedItems,
  shippingOptions,
  shippingZones,
} from './page.config'

export const metadata = createMetadata({
  title: 'Shipping',
  description: 'Information about our shipping policies and options.',
})

export default function ShippingPage() {
  return (
    <main>
      <section className='bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-20 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950'>
        <div className='container text-center'>
          <Badge variant='secondary' className='mb-6'>
            🚚 Shipping Information
          </Badge>

          <Typography variant='h1' className='mb-6'>
            Shipping Policy
          </Typography>

          <Typography className='mx-auto mb-8 max-w-3xl text-xl text-muted-foreground'>
            Everything you need to know about our shipping options, delivery
            times, costs, and policies. We're committed to getting your orders
            to you safely and on time.
          </Typography>

          <div className='mt-12 grid gap-6 md:grid-cols-3'>
            {deliveryFeatures.map((feature) => (
              <div key={feature.title} className='text-center'>
                <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary shadow-sm'>
                  {feature.icon}
                </div>
                <Typography variant='h6' className='mb-2'>
                  {feature.title}
                </Typography>
                <Typography
                  variant='caption'
                  component='p'
                  className='text-muted-foreground'
                >
                  {feature.description}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='container py-20'>
        <div className='mb-16 text-center'>
          <Typography variant='h2' className='mb-4'>
            Shipping Options
          </Typography>
          <Typography className='mx-auto max-w-2xl text-muted-foreground'>
            Choose the shipping method that best fits your needs and timeline.
          </Typography>
        </div>

        <div className='grid gap-8 md:grid-cols-2'>
          {shippingOptions.map((option) => (
            <Card
              key={option.name}
              className='shadow-sm transition-shadow hover:shadow-md'
            >
              <CardContent>
                <div className='mb-6 flex items-start space-x-4'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
                    <div className='text-primary'>{option.icon}</div>
                  </div>
                  <div className='flex-1'>
                    <Typography variant='h4' className='mb-2'>
                      {option.name}
                    </Typography>
                    <Typography className='mb-4 text-muted-foreground'>
                      {option.description}
                    </Typography>
                  </div>
                </div>

                <div className='mb-6 grid grid-cols-2 gap-4'>
                  <div>
                    <Typography variant='h6' className='mb-1 text-primary'>
                      Delivery Time
                    </Typography>
                    <Typography className='text-sm text-muted-foreground'>
                      {option.timeframe}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant='h6' className='mb-1 text-primary'>
                      Cost
                    </Typography>
                    <Typography className='text-sm text-muted-foreground'>
                      {option.cost}
                    </Typography>
                  </div>
                </div>

                <div>
                  <Typography variant='h6' className='mb-3'>
                    Features
                  </Typography>
                  <ul className='space-y-2'>
                    {option.features.map((feature) => (
                      <li key={feature} className='flex items-center space-x-2'>
                        <CheckCircleIcon className='h-4 w-4 text-success' />
                        <Typography className='text-sm text-muted-foreground'>
                          {feature}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className='bg-secondary py-20'>
        <div className='container'>
          <div className='mb-16 text-center'>
            <Typography variant='h2' className='mb-4'>
              Shipping Zones & Rates
            </Typography>
            <Typography className='mx-auto max-w-2xl text-muted-foreground'>
              Shipping costs and delivery times vary by destination. Find your
              shipping zone below.
            </Typography>
          </div>

          <div className='grid gap-6'>
            {shippingZones.map((zone) => (
              <Card key={zone.zone} className='border-0 shadow-sm'>
                <CardContent>
                  <div className='grid items-center gap-4 md:grid-cols-5'>
                    <div>
                      <Typography variant='h6' className='mb-1'>
                        {zone.zone}
                      </Typography>
                      <Typography className='text-sm text-muted-foreground'>
                        {zone.regions.join(', ')}
                      </Typography>
                    </div>
                    <div className='text-center'>
                      <Typography
                        variant='caption'
                        component='p'
                        className='mb-1 text-muted-foreground'
                      >
                        Standard
                      </Typography>
                      <Typography className='text-sm font-medium'>
                        {zone.standardTime}
                      </Typography>
                    </div>
                    <div className='text-center'>
                      <Typography
                        variant='caption'
                        component='p'
                        className='mb-1 text-muted-foreground'
                      >
                        Express
                      </Typography>
                      <Typography className='text-sm font-medium'>
                        {zone.expressTime}
                      </Typography>
                    </div>
                    <div className='text-center'>
                      <Typography
                        variant='caption'
                        component='p'
                        className='mb-1 text-muted-foreground'
                      >
                        Starting Cost
                      </Typography>
                      <Typography className='text-sm font-medium text-primary'>
                        {zone.cost}
                      </Typography>
                    </div>
                    <div className='text-center'>
                      <Button variant='outline' size='sm' disabled>
                        Calculate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className='container py-20'>
        <Typography variant='h2' className='mb-12 text-center'>
          Processing & Handling
        </Typography>

        <div className='mb-12 grid gap-8 md:grid-cols-2'>
          <Card className='border-0 shadow-sm'>
            <CardContent className='p-8'>
              <div className='mb-4 flex items-center space-x-3'>
                <CalendarIcon className='h-6 w-6 text-primary' />
                <Typography variant='h4'>Processing Time</Typography>
              </div>
              <Typography className='mb-6 text-muted-foreground'>
                Most orders are processed within 1-2 business days. Custom or
                personalized items may take longer.
              </Typography>
              <div className='space-y-3'>
                <div className='flex justify-between'>
                  <Typography className='text-sm'>Standard items</Typography>
                  <Typography className='text-sm font-medium'>
                    1-2 business days
                  </Typography>
                </div>
                <div className='flex justify-between'>
                  <Typography className='text-sm'>Custom items</Typography>
                  <Typography className='text-sm font-medium'>
                    3-5 business days
                  </Typography>
                </div>
                <div className='flex justify-between'>
                  <Typography className='text-sm'>Pre-orders</Typography>
                  <Typography className='text-sm font-medium'>
                    As specified
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='border-0 shadow-sm'>
            <CardContent className='p-8'>
              <div className='mb-4 flex items-center space-x-3'>
                <PackageIcon className='h-6 w-6 text-primary' />
                <Typography variant='h4'>Packaging</Typography>
              </div>
              <Typography className='mb-6 text-muted-foreground'>
                All items are carefully packaged to ensure they arrive in
                perfect condition.
              </Typography>
              <div className='space-y-3'>
                <div className='flex items-center space-x-2'>
                  <CheckCircleIcon className='h-4 w-4 text-success' />
                  <Typography className='text-sm'>
                    Protective packaging materials
                  </Typography>
                </div>
                <div className='flex items-center space-x-2'>
                  <CheckCircleIcon className='h-4 w-4 text-success' />
                  <Typography className='text-sm'>
                    Eco-friendly packaging options
                  </Typography>
                </div>
                <div className='flex items-center space-x-2'>
                  <CheckCircleIcon className='h-4 w-4 text-success' />
                  <Typography className='text-sm'>
                    Fragile item special handling
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className='border-0 bg-info/10 shadow-sm'>
          <CardContent className='p-8'>
            <div className='flex items-start space-x-4'>
              <AlertCircleIcon className='mt-1 h-6 w-6 text-info' />
              <div>
                <Typography variant='h5' className='mb-3 text-info'>
                  Order Cutoff Times
                </Typography>
                <Typography className='mb-4 text-info/80'>
                  To ensure same-day processing, orders must be placed by the
                  following times:
                </Typography>
                <div className='grid gap-4 md:grid-cols-2'>
                  <div>
                    <Typography className='font-medium text-info'>
                      Monday - Friday: 2:00 PM EST
                    </Typography>
                    <Typography className='text-sm text-info/80'>
                      Orders placed after will be processed next business day
                    </Typography>
                  </div>
                  <div>
                    <Typography className='font-medium text-info'>
                      Weekends: No processing
                    </Typography>
                    <Typography className='text-sm text-info/80'>
                      Weekend orders processed on Monday
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className='bg-secondary py-20'>
        <div className='container'>
          <div className='mb-16 text-center'>
            <Typography variant='h2' className='mb-4'>
              International Shipping
            </Typography>
            <Typography className='mx-auto max-w-2xl text-muted-foreground'>
              We ship worldwide with customs handling and duty calculation
              included.
            </Typography>
          </div>

          <div className='mb-12 grid gap-8 md:grid-cols-2'>
            <Card className='border-0 shadow-sm'>
              <CardContent className='p-8'>
                <Typography variant='h4' className='mb-6'>
                  Important Information
                </Typography>
                <div className='space-y-4'>
                  <div className='flex items-start space-x-3'>
                    <DollarSignIcon className='mt-1 h-5 w-5 text-primary' />
                    <div>
                      <Typography variant='h6' className='mb-1'>
                        Duties & Taxes
                      </Typography>
                      <Typography className='text-sm text-muted-foreground'>
                        Additional duties and taxes may apply based on your
                        country's regulations. These are not included in our
                        shipping costs.
                      </Typography>
                    </div>
                  </div>
                  <div className='flex items-start space-x-3'>
                    <ClockIcon className='mt-1 h-5 w-5 text-primary' />
                    <div>
                      <Typography variant='h6' className='mb-1'>
                        Customs Clearance
                      </Typography>
                      <Typography className='text-sm text-muted-foreground'>
                        International shipments may be delayed by customs
                        processing. This is beyond our control and not included
                        in delivery estimates.
                      </Typography>
                    </div>
                  </div>
                  <div className='flex items-start space-x-3'>
                    <MapPinIcon className='mt-1 h-5 w-5 text-primary' />
                    <div>
                      <Typography variant='h6' className='mb-1'>
                        Address Accuracy
                      </Typography>
                      <Typography className='text-sm text-muted-foreground'>
                        Ensure your address is complete and accurate. Incorrect
                        addresses may result in additional fees or returned
                        packages.
                      </Typography>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='border-0 shadow-sm'>
              <CardContent className='p-8'>
                <Typography variant='h4' className='mb-6'>
                  Restricted Items
                </Typography>
                <Typography className='mb-4 text-muted-foreground'>
                  The following items cannot be shipped internationally:
                </Typography>
                <ul className='space-y-2'>
                  {restrictedItems.map((item) => (
                    <li key={item} className='flex items-center space-x-2'>
                      <AlertCircleIcon className='h-4 w-4 text-error' />
                      <Typography className='text-sm text-muted-foreground'>
                        {item}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div>
            <Typography variant='h3' className='mb-8 text-center'>
              Country-Specific Information
            </Typography>
            <div className='grid gap-6 md:grid-cols-2'>
              {internationalRestrictions.map((country) => (
                <Card key={country.country} className='border-0 shadow-sm'>
                  <CardContent className='p-6'>
                    <Typography variant='h5' className='mb-4'>
                      {country.country}
                    </Typography>
                    <div className='space-y-3'>
                      <div>
                        <Typography variant='h6' className='mb-2 text-sm'>
                          Restrictions
                        </Typography>
                        <ul className='space-y-1'>
                          {country.restrictions.map((restriction) => (
                            <li key={restriction}>
                              <Typography className='text-sm text-muted-foreground'>
                                • {restriction}
                              </Typography>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <Typography variant='h6' className='mb-1 text-sm'>
                          Duties & Taxes
                        </Typography>
                        <Typography className='text-sm text-muted-foreground'>
                          {country.duties}
                        </Typography>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className='container py-20'>
        <Typography variant='h2' className='mb-12 text-center'>
          Tracking & Support
        </Typography>

        <div className='grid gap-8 md:grid-cols-2'>
          <Card className='border-0 shadow-sm'>
            <CardContent>
              <Typography variant='h4' className='mb-6'>
                Order Tracking
              </Typography>
              <Typography className='mb-6 text-muted-foreground'>
                Stay updated on your order's progress with our comprehensive
                tracking system.
              </Typography>
              <div className='space-y-4'>
                <div className='flex items-center space-x-3'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10'>
                    <Typography className='text-xs font-bold text-primary'>
                      1
                    </Typography>
                  </div>
                  <div>
                    <Typography className='text-sm font-medium'>
                      Order Confirmed
                    </Typography>
                    <Typography className='text-xs text-muted-foreground'>
                      You'll receive an email confirmation
                    </Typography>
                  </div>
                </div>
                <div className='flex items-center space-x-3'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10'>
                    <Typography className='text-xs font-bold text-primary'>
                      2
                    </Typography>
                  </div>
                  <div>
                    <Typography className='text-sm font-medium'>
                      Processing
                    </Typography>
                    <Typography className='text-xs text-muted-foreground'>
                      Your order is being prepared
                    </Typography>
                  </div>
                </div>
                <div className='flex items-center space-x-3'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10'>
                    <Typography className='text-xs font-bold text-primary'>
                      3
                    </Typography>
                  </div>
                  <div>
                    <Typography className='text-sm font-medium'>
                      Shipped
                    </Typography>
                    <Typography className='text-xs text-muted-foreground'>
                      Tracking number provided
                    </Typography>
                  </div>
                </div>
                <div className='flex items-center space-x-3'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10'>
                    <Typography className='text-xs font-bold text-primary'>
                      4
                    </Typography>
                  </div>
                  <div>
                    <Typography className='text-sm font-medium'>
                      Delivered
                    </Typography>
                    <Typography className='text-xs text-muted-foreground'>
                      Package arrives at your door
                    </Typography>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='border-0 shadow-sm'>
            <CardContent>
              <Typography variant='h4' className='mb-6'>
                Shipping Support
              </Typography>
              <Typography className='mb-6 text-muted-foreground'>
                Need help with your shipment? Our support team is here to assist
                you.
              </Typography>
              <div className='space-y-4'>
                <div className='rounded-lg bg-secondary p-4'>
                  <Typography variant='h6' className='mb-2'>
                    Lost or Damaged Package
                  </Typography>
                  <Typography className='mb-3 text-sm text-muted-foreground'>
                    We'll investigate and provide a replacement or refund.
                  </Typography>
                  <Button variant='outline' size='sm' asChild>
                    <a
                      href='https://youtu.be/9lNZ_Rnr7Jc'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      Report Issue
                    </a>
                  </Button>
                </div>
                <div className='rounded-lg bg-secondary p-4'>
                  <Typography variant='h6' className='mb-2'>
                    Delivery Questions
                  </Typography>
                  <Typography className='mb-3 text-sm text-muted-foreground'>
                    Questions about delivery times or shipping options.
                  </Typography>
                  <Button variant='outline' size='sm' asChild>
                    <Link href='/contact'>Contact Support</Link>
                  </Button>
                </div>
                <div className='rounded-lg bg-secondary p-4'>
                  <Typography variant='h6' className='mb-2'>
                    Address Changes
                  </Typography>
                  <Typography className='mb-3 text-sm text-muted-foreground'>
                    Need to update your delivery address before shipping.
                  </Typography>
                  <Button variant='outline' size='sm' asChild>
                    <Link href='/profile/address'>Update Address</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
