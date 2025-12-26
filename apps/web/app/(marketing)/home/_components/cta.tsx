import { Button } from '@yukinu/ui/button'
import { ArrowRightIcon } from '@yukinu/ui/icons'
import { Typography } from '@yukinu/ui/typography'
import Link from 'next/link'

export const CTASection: React.FC = () => {
  return (
    <section className='bg-accent/20 px-4 py-20 text-accent-foreground sm:px-6 md:py-32 lg:px-8 dark:bg-accent/10'>
      <div className='container space-y-6 text-center'>
        <Typography variant='h2'>
          Ready to transform your shopping experience?
        </Typography>
        <Typography className='mx-auto max-w-2xl text-muted-foreground'>
          Join Yukinu today and discover the future of multi-vendor e-commerce.
          Whether you&apos;re a buyer or seller, we have a place for you.
        </Typography>

        <Button
          size='lg'
          variant='secondary'
          nativeButton={false}
          render={
            <Link href='/'>
              Get Started Now <ArrowRightIcon />
            </Link>
          }
        />
      </div>
    </section>
  )
}
