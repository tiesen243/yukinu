import { Button } from '@yukinu/ui/button'
import {
  BarChart3Icon,
  DollarSignIcon,
  UsersIcon,
  ZapIcon,
} from '@yukinu/ui/icons'

import { getDashboardUrl } from '@/lib/utils'

export const SellerValue: React.FC = () => (
  <section id='for-sellers' className='bg-card py-20 md:py-32'>
    <h2 className='sr-only'>Value for Sellers</h2>

    <div className='container grid grid-cols-1 items-center gap-12 lg:grid-cols-2'>
      <section className='order-2 flex aspect-square items-center justify-center rounded-xl border border-accent bg-accent/20 p-8 md:p-12 lg:order-1 dark:bg-accent/10'>
        <h3 className='sr-only'>
          Business growth and sales optimization section
        </h3>

        <div className='space-y-4 text-center'>
          <BarChart3Icon className='mx-auto size-20 text-accent' />
          <p className='text-accent-foreground/70'>Grow your business</p>
        </div>
      </section>

      <section className='order-1 space-y-8 lg:order-2'>
        <span className='mb-0 inline-block rounded-full border-accent bg-accent/40 px-4 py-2 text-sm font-medium text-accent-foreground shadow-sm dark:border'>
          For Vendors
        </span>
        <h3 className='my-6 text-3xl leading-tight font-bold text-balance text-foreground sm:text-4xl'>
          Reach thousands of buyers and grow your business
        </h3>
        <p className='text-lg leading-relaxed text-foreground/70'>
          List your products, manage inventory, and reach a massive audience.
          Our commission-based model means you only pay when you sell.
        </p>

        <section className='space-y-4'>
          <h4 className='sr-only'>Benefits for Vendors</h4>

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

        <Button size='lg' variant='outline' asChild>
          <a
            href={`${getDashboardUrl()}/apply-vendor`}
            target='_blank'
            rel='noopener noreferrer'
          >
            Apply as Vendor
          </a>
        </Button>
      </section>
    </div>
  </section>
)

const benefits = [
  {
    icon: UsersIcon,
    title: 'Massive Audience',
    desc: 'Access 100K+ active buyers searching for products',
  },
  {
    icon: ZapIcon,
    title: 'Easy Setup',
    desc: 'Get started in minutes with intuitive seller tools',
  },
  {
    icon: DollarSignIcon,
    title: 'Fair Pricing',
    desc: 'Competitive commissions with transparent pricing',
  },
]
