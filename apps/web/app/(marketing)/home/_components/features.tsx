import {
  LockIcon,
  PackageIcon,
  ShieldIcon,
  TrendingUpIcon,
  TruckIcon,
  ZapIcon,
} from '@yukinu/ui/icons'

export const FeaturesSection: React.FC = () => (
  <section
    id='features'
    className='bg-card px-4 py-20 sm:px-6 md:py-32 lg:px-8'
  >
    <div className='container mb-16 text-center'>
      <h2 className='mb-4 text-3xl font-bold text-foreground sm:text-4xl'>
        Why choose Yukinu?
      </h2>
      <p className='mx-auto max-w-2xl text-lg text-foreground/70'>
        We've built the platform to make online shopping easier, safer, and more
        rewarding.
      </p>
    </div>

    <div className='container grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
      {features.map((feature) => (
        <div
          key={feature.title}
          className='rounded-lg border bg-card p-8 text-accent-foreground transition-colors hover:border-accent hover:bg-accent/20 hover:text-primary'
        >
          <feature.icon className='mb-4 size-12' />
          <h3 className='mb-3 text-lg font-semibold'>{feature.title}</h3>
          <p className='text-accent-foreground/70'>{feature.description}</p>
        </div>
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
