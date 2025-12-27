import { Button } from '@yukinu/ui/button'
import {
  BarChart3Icon,
  DollarSignIcon,
  UsersIcon,
  ZapIcon,
} from '@yukinu/ui/icons'
import { Typography } from '@yukinu/ui/typography'

import { getDashboardUrl } from '@/lib/utils'

export const SellerValue: React.FC = () => (
  <section
    id='for-sellers'
    className='bg-card text-card-foreground py-20 md:py-32'
  >
    <h2 className='sr-only'>Value for Sellers</h2>

    <div className='container grid grid-cols-1 items-center gap-12 lg:grid-cols-2'>
      <section className='order-2 flex aspect-square items-center justify-center rounded-xl border border-accent bg-accent/40 p-8 md:p-12 lg:order-1'>
        <h3 className='sr-only'>
          Business growth and sales optimization section
        </h3>

        <div className='space-y-4 text-center'>
          <BarChart3Icon className='mx-auto size-20 text-primary' />
          <Typography className='text-accent-foreground/70'>
            Grow your business
          </Typography>
        </div>
      </section>

      <section className='order-1 space-y-8 lg:order-2'>
        <span className='mb-0 inline-block rounded-full border-accent bg-accent/40 px-4 py-2 text-sm font-medium text-accent-foreground shadow-sm dark:border'>
          For Vendors
        </span>
        <Typography variant='h3'>
          Reach thousands of buyers and grow your business
        </Typography>
        <Typography className='text-muted-foreground'>
          List your products, manage inventory, and reach a massive audience.
          Our commission-based model means you only pay when you sell.
        </Typography>

        <ul className='space-y-4'>
          {benefits.map(({ icon: Icon, title, desc }) => (
            <li className='flex items-start gap-4' key={title}>
              <Icon className='size-6 shrink-0 text-accent-foreground' />
              <div>
                <Typography className='font-semibold'>{title}</Typography>
                <Typography className='text-muted-foreground' render={<span />}>
                  {desc}
                </Typography>
              </div>
            </li>
          ))}
        </ul>

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
              Apply as Vendor
            </a>
          }
        />
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
