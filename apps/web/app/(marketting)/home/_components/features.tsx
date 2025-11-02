import {
  BarChart3Icon,
  CheckCircle2Icon,
  GlobeIcon,
  UsersIcon,
  ZapIcon,
} from '@yukinu/ui/icons'

export function FeaturesSection() {
  return (
    <section id='features' className='container py-20 md:py-28'>
      <div className='mb-16 text-center'>
        <h2 className='mb-4 text-4xl font-bold text-balance md:text-5xl'>
          Designed for Marketplaces
        </h2>
        <p className='mx-auto max-w-2xl text-lg text-muted-foreground'>
          Everything you need to launch, manage, and scale a successful
          multi-vendor platform.
        </p>
      </div>

      <section className='grid gap-8 md:grid-cols-3'>
        <h3 className='sr-only'>Features list</h3>
        {features.map((feature) => (
          <section
            key={feature.title}
            className='rounded-xl border bg-card p-8 shadow-sm transition-colors hover:border-primary/50'
          >
            <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20'>
              <feature.icon className='size-6 text-primary' />
            </div>
            <h4 className='mb-2 text-xl font-semibold'>{feature.title}</h4>
            <p className='text-muted-foreground'>{feature.description}</p>
          </section>
        ))}
      </section>
    </section>
  )
}

const features = [
  {
    icon: ZapIcon,
    title: 'Lightning Fast',
    description:
      'Sub-second response times and optimized infrastructure to handle millions of transactions.',
  },
  {
    icon: UsersIcon,
    title: 'Vendor Management',
    description:
      'Onboard, manage, and support unlimited vendors with built-in analytics and compliance tools.',
  },
  {
    icon: BarChart3Icon,
    title: 'Advanced Analytics',
    description:
      'Real-time insights into sales, vendor performance, and customer behavior.',
  },
  {
    icon: GlobeIcon,
    title: 'Global Scale',
    description:
      'Multi-currency, multi-language support with compliance built-in for 150+ countries.',
  },
  {
    icon: CheckCircle2Icon,
    title: 'Enterprise Ready',
    description:
      'Security, reliability, and compliance features designed for enterprise needs.',
  },
  {
    icon: ZapIcon,
    title: 'Easy Integration',
    description:
      'RESTful APIs and webhooks to integrate with your existing tools and systems.',
  },
]
