import { Card } from '@yukinu/ui/card'
import {
  LockIcon,
  PackageIcon,
  ShieldIcon,
  TrendingUpIcon,
  TruckIcon,
  ZapIcon,
} from '@yukinu/ui/icons'
import { Typography } from '@yukinu/ui/typography'

export const FeaturesSection: React.FC = () => (
  <section
    id='features'
    className='bg-card px-4 py-20 text-card-foreground sm:px-6 md:py-32 lg:px-8'
  >
    <div className='container mb-16 text-center'>
      <Typography variant='h2'>Why choose Yukinu?</Typography>
      <Typography className='mx-auto max-w-2xl text-muted-foreground'>
        We&apos;ve built the platform to make online shopping easier, safer, and
        more rewarding.
      </Typography>
    </div>

    <div className='container grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
      {features.map((feature) => (
        <Card
          key={feature.title}
          className='gap-2 bg-background/80 px-4 text-accent-foreground transition-colors hover:bg-accent/20 hover:text-primary hover:ring-accent'
        >
          <feature.icon className='size-12' />
          <Typography variant='h6' render={<h3>{feature.title}</h3>} />
          <Typography className='text-accent-foreground/70'>
            {feature.description}
          </Typography>
        </Card>
      ))}
    </div>
  </section>
)

const features = [
  {
    icon: PackageIcon,
    title: 'Curated Selection',
    description:
      'Hand-picked products from verified sellers to ensure quality and authenticity.',
  },
  {
    icon: LockIcon,
    title: 'Secure Checkout',
    description:
      'Industry-leading encryption and fraud protection for your peace of mind.',
  },
  {
    icon: ZapIcon,
    title: 'Lightning Fast',
    description:
      'Quick browsing, instant notifications, and real-time inventory updates.',
  },
  {
    icon: TrendingUpIcon,
    title: 'Best Prices',
    description:
      'Compare prices across vendors and find the best deals on everything.',
  },
  {
    icon: ShieldIcon,
    title: 'Buyer Protection',
    description:
      '100% satisfaction guarantee with hassle-free returns within 30 days.',
  },
  {
    icon: TruckIcon,
    title: 'Fast Shipping',
    description:
      'Multiple shipping options with real-time tracking and delivery updates.',
  },
]
