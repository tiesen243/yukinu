import { Button } from '@yukinu/ui/button'
import { Card } from '@yukinu/ui/card'
import { ArrowRightIcon } from '@yukinu/ui/icons'
import { Typography } from '@yukinu/ui/typography'
import Link from 'next/link'

import { env } from '@/lib/env'

export const HeroSection: React.FC = () => (
  <section className='relative container flex flex-col justify-center gap-4 py-20 text-center md:py-32'>
    <div
      className='absolute inset-0 -z-1 size-full'
      style={{
        backgroundSize: '52px 52px',
        backgroundImage: `
            linear-gradient(to right, var(--color-secondary) 1px, transparent 1px),
            linear-gradient(to bottom, var(--color-secondary) 1px, transparent 1px)
          `,

        maskImage:
          'radial-gradient(circle at center, black 20%, transparent 100%)',
        WebkitMaskImage:
          'radial-gradient(circle at center, black 20%, transparent 100%)',

        pointerEvents: 'none',
      }}
    />

    <Typography variant='h2'>
      Discover products from{' '}
      <span className='text-primary'>multiple sellers</span> in one place
    </Typography>

    <Typography className='mx-auto max-w-2xl text-center text-muted-foreground'>
      Shop smarter, compare prices, and find the best deals from trusted
      vendors. Experience seamless checkout and world-class customer service.
    </Typography>

    <div className='flex flex-col items-center justify-center gap-4 pt-8 sm:flex-row'>
      <Button
        size='lg'
        nativeButton={false}
        render={
          <Link href='/'>
            Start Shopping Now{' '}
            <ArrowRightIcon
              data-icon='inline-end'
              className='transition-transform group-hover/button:translate-x-0.5'
            />
          </Link>
        }
      />
      <Button
        size='lg'
        variant='outline'
        nativeButton={false}
        render={
          <a
            href={`${env.NEXT_PUBLIC_DASHBOARD_URL}/register-vendor`}
            target='_blank'
            rel='noopener noreferrer'
          >
            Become a Seller
          </a>
        }
      />
    </div>

    <div className='w-full pt-12'>
      <Typography variant='h3' className='mb-4 text-muted-foreground'>
        Trusted by shoppers worldwide
      </Typography>
      <div className='grid gap-8 md:grid-cols-3'>
        {trustedBy.map((item) => (
          <Card
            key={item.title}
            className='gap-2 px-4 text-center text-accent-foreground transition-colors hover:bg-accent hover:text-primary hover:ring-accent'
          >
            <Typography className='text-lg'>{item.title}</Typography>
            <Typography className='text-sm text-accent-foreground/70 lg:text-base'>
              {item.description}
            </Typography>
          </Card>
        ))}
      </div>
    </div>
  </section>
)

const trustedBy = [
  {
    title: '50K+',
    description: 'Active Products',
  },
  {
    title: '500+',
    description: 'Trusted Vendors',
  },
  {
    title: '100K+',
    description: 'Happy Customers',
  },
]
