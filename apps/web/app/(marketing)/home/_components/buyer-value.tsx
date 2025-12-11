'use client'

import Link from 'next/link'

import { Button } from '@yukinu/ui/button'
import { MapPinIcon, ShoppingBagIcon, StarIcon } from '@yukinu/ui/icons'

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
        <h3 className='my-6 text-3xl leading-tight font-bold text-balance text-foreground sm:text-4xl'>
          Shop smarter, save more, enjoy better
        </h3>
        <p className='text-lg leading-relaxed text-foreground/70'>
          Browse thousands of products from verified sellers, compare prices in
          real-time, and make informed decisions. Get personalized
          recommendations based on your preferences.
        </p>

        <section className='space-y-4'>
          <h4 className='sr-only'>Benefits for Shoppers</h4>

          {benefits.map(({ icon: Icon, title, desc }) => (
            <div className='flex items-start gap-4' key={title}>
              <Icon className='size-6 shrink-0 text-accent-foreground' />
              <div>
                <p className='font-semibold'>{title}</p>
                <span className='text-muted-foreground'>{desc}</span>
              </div>
            </div>
          ))}
        </section>

        <Button size='lg' asChild>
          <Link href='/'>Start Shopping</Link>
        </Button>
      </section>

      <section className='flex aspect-square items-center justify-center rounded-xl border border-accent bg-accent/20 p-8 md:p-12 dark:bg-accent/10'>
        <h3 className='sr-only'>Premium shopping experience section</h3>

        <div className='space-y-4 text-center'>
          <ShoppingBagIcon className='mx-auto size-20 text-accent' />
          <p className='text-accent-foreground/70'>
            Premium shopping experience
          </p>
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
