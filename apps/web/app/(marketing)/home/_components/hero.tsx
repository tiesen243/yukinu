import Link from 'next/link'

import { Button } from '@yukinu/ui/button'
import { ArrowRightIcon } from '@yukinu/ui/icons'

export function HeroSection() {
  return (
    <section className='relative overflow-hidden py-20 md:py-32 lg:py-40'>
      <h2 className='sr-only'>Hero section</h2>

      <div className='absolute inset-0 -z-10'>
        <div className='absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 opacity-30 blur-3xl' />
      </div>

      <div className='container grid items-center gap-12 md:grid-cols-2'>
        <section className='flex flex-col gap-6'>
          <h3 className='text-5xl leading-tight font-bold text-balance md:text-6xl'>
            The fastest platform to build your multi-vendor marketplace.
          </h3>

          <p className='max-w-xl text-lg leading-relaxed text-muted-foreground'>
            Empower vendors to grow while you scale effortlessly. Build, deploy,
            and manage a thriving marketplace ecosystem with powerful tools
            built for success.
          </p>

          <div className='flex items-center gap-3 pt-4'>
            <Button size='lg' asChild>
              <Link href='/register'>
                Get Started <ArrowRightIcon />
              </Link>
            </Button>
            <Button size='lg' variant='outline' asChild>
              <a
                href='https://tiesen243.github.io/yukinu'
                target='_blank'
                rel='noopener noreferrer'
              >
                Learn more about Yukinu platform
              </a>
            </Button>
          </div>
        </section>

        <section>
          <h3 className='sr-only'>Hero Image section</h3>

          <div className='rounded-lg border border-border bg-card p-8 shadow-xl'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='h-32 rounded-lg bg-muted' />
              <div className='h-32 rounded-lg bg-muted' />
              <div className='h-32 rounded-lg bg-muted' />
              <div className='h-32 rounded-lg bg-muted' />
            </div>
          </div>
        </section>
      </div>
    </section>
  )
}
