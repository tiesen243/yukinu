import Link from 'next/link'

import { Button } from '@yukinu/ui/button'
import { ArrowRightIcon, StarIcon } from '@yukinu/ui/icons'

import { getDashboardUrl } from '@/lib/utils'

export const HeroSection: React.FC = () => (
  <section className='container flex max-w-4xl flex-col justify-center gap-4 py-20 text-center md:py-32 lg:py-40'>
    <div className='mx-auto inline-flex w-fit items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground'>
      <StarIcon className='size-4' /> Welcome to the future of shopping
    </div>

    <h2 className='text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl'>
      Discover products from{' '}
      <span className='text-primary'>multiple sellers</span> in one place
    </h2>

    <p className='mx-auto max-w-2xl text-lg leading-relaxed text-foreground/70 sm:text-xl'>
      Shop smarter, compare prices, and find the best deals from trusted
      vendors. Experience seamless checkout and world-class customer service.
    </p>

    <div className='flex flex-col items-center justify-center gap-4 pt-8 sm:flex-row'>
      <Button size='lg' asChild>
        <Link href='/'>
          Start Shopping Now <ArrowRightIcon />
        </Link>
      </Button>
      <Button size='lg' variant='outline' asChild>
        <a
          href={`${getDashboardUrl()}/apply-vendor`}
          target='_blank'
          rel='noopener noreferrer'
        >
          Become a Seller
        </a>
      </Button>
    </div>

    <div className='pt-12'>
      <p className='mb-6 text-sm text-foreground/60'>
        Trusted by shoppers worldwide
      </p>
      <div className='grid grid-cols-3 items-center justify-center gap-8'>
        {trustedBy.map((item) => (
          <div
            key={item.title}
            className='rounded-xl border bg-card p-6 text-center text-accent-foreground transition-colors hover:border-accent hover:bg-accent/20 hover:text-primary'
          >
            <p className='text-2xl font-bold'>{item.title}</p>
            <p className='text-sm text-accent-foreground/70'>
              {item.description}
            </p>
          </div>
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
