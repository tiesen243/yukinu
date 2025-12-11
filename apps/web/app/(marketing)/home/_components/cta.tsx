import Link from 'next/link'

import { Button } from '@yukinu/ui/button'
import { ArrowRightIcon } from '@yukinu/ui/icons'

export const CTASection: React.FC = () => {
  return (
    <section className='bg-accent/60 px-4 py-20 text-accent-foreground sm:px-6 md:py-32 lg:px-8'>
      <div className='container space-y-6 text-center'>
        <h2 className='text-3xl font-bold sm:text-4xl lg:text-5xl'>
          Ready to transform your shopping experience?
        </h2>
        <p className='mx-auto max-w-2xl text-lg text-muted-foreground'>
          Join Yukinu today and discover the future of multi-vendor e-commerce.
          Whether you're a buyer or seller, we have a place for you.
        </p>

        <Button size='lg' variant='secondary' asChild>
          <Link href='/'>
            Get Started Now <ArrowRightIcon />
          </Link>
        </Button>
      </div>
    </section>
  )
}
