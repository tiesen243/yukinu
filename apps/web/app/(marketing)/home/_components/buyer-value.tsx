'use client'

import { Button } from '@yukinu/ui/button'
import { MapPinIcon, ShoppingBagIcon, StarIcon } from '@yukinu/ui/icons'
import { Typography } from '@yukinu/ui/typography'
import Link from 'next/link'

export const BuyerValue: React.FC = () => {
  return (
    <section
      id='for-buyers'
      className='container grid grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 md:py-32 lg:grid-cols-2 lg:px-8'
    >
      <h2 className='sr-only'>Value for Shoppers</h2>

      <section className='space-y-8'>
        <span className='mb-0 inline-block rounded-full border-accent bg-accent/40 px-4 py-2 text-sm font-medium text-accent-foreground shadow-sm dark:border'>
          For Shoppers
        </span>
        <Typography variant='h3'>
          Shop smarter, save more, enjoy better
        </Typography>
        <Typography className='text-muted-foreground'>
          Browse thousands of products from verified sellers, compare prices in
          real-time, and make informed decisions. Get personalized
          recommendations based on your preferences.
        </Typography>

        <section className='space-y-4'>
          <h4 className='sr-only'>Benefits for Shoppers</h4>

          {benefits.map(({ icon: Icon, title, desc }) => (
            <div className='flex items-start gap-4' key={title}>
              <Icon className='size-6 shrink-0 text-accent-foreground' />
              <div>
                <Typography className='font-semibold'>{title}</Typography>
                <Typography className='text-muted-foreground' render={<span />}>
                  {desc}
                </Typography>
              </div>
            </div>
          ))}
        </section>

        <Button
          size='lg'
          nativeButton={false}
          render={<Link href='/'>Start Shopping</Link>}
        />
      </section>

      <section className='flex aspect-square items-center justify-center rounded-xl border border-accent bg-accent/20 p-8 md:p-12 dark:bg-accent/10'>
        <h3 className='sr-only'>Premium shopping experience section</h3>

        <div className='space-y-4 text-center'>
          <ShoppingBagIcon className='mx-auto size-20 text-accent' />
          <Typography className='text-accent-foreground/70'>
            Premium shopping experience
          </Typography>
        </div>
      </section>
    </section>
  )
}

const benefits = [
  {
    icon: ShoppingBagIcon,
    title: 'Infinite Selection',
    desc: 'Access products from hundreds of trusted vendors',
  },
  {
    icon: StarIcon,
    title: 'Verified Reviews',
    desc: 'Read authentic reviews from verified buyers',
  },
  {
    icon: MapPinIcon,
    title: 'Track Anywhere',
    desc: 'Real-time package tracking to your doorstep',
  },
]
