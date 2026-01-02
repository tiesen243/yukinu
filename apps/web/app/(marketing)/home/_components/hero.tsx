import { Button } from '@yukinu/ui/button'
import { Card } from '@yukinu/ui/card'
import { ArrowRightIcon } from '@yukinu/ui/icons'
import { Typography } from '@yukinu/ui/typography'
import Link from 'next/link'

import { getDashboardUrl } from '@/lib/utils'

export const HeroSection: React.FC = () => (
  <section className='container flex max-w-4xl flex-col justify-center gap-4 py-20 text-center md:py-32 lg:py-40'>
    <Typography variant='h2'>
      Discover products from{' '}
      <span className='text-primary'>multiple sellers</span> in one place
    </Typography>

    <Typography className='mx-auto max-w-2xl text-muted-foreground'>
      Shop smarter, compare prices, and find the best deals from trusted
      vendors. Experience seamless checkout and world-class customer service.
    </Typography>

    <div className='flex flex-col items-center justify-center gap-4 pt-8 sm:flex-row'>
      <Button
        size='lg'
        nativeButton={false}
        render={
          <Link href='/'>
            Start Shopping Now <ArrowRightIcon />
          </Link>
        }
      />
      <Button
        size='lg'
        variant='outline'
        nativeButton={false}
        render={
          // oxlint-disable-next-line no-html-link-for-pages
          <a
            href={`${getDashboardUrl()}/apply-vendor`}
            target='_blank'
            rel='noopener noreferrer'
          >
            Become a Seller
          </a>
        }
      />
    </div>

    <div className='pt-12'>
      <Typography className='mb-4 text-muted-foreground'>
        Trusted by shoppers worldwide
      </Typography>
      <div className='grid grid-cols-3 items-center justify-center gap-8'>
        {trustedBy.map((item) => (
          <Card
            key={item.title}
            className='gap-2 text-center text-accent-foreground transition-colors hover:bg-accent/20 hover:text-primary hover:ring-accent'
          >
            <Typography>{item.title}</Typography>
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
