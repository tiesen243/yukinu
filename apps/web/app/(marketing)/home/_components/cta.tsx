import Link from 'next/link'

import { Button } from '@yukinu/ui/button'
import { ArrowRightIcon } from '@yukinu/ui/icons'

export function CTASection() {
  return (
    <section className='border-t border-b border-border bg-gradient-to-br from-accent/5 to-primary/5 py-20 md:py-28'>
      <div className='container text-center'>
        <h2 className='mb-4 text-4xl font-bold text-balance md:text-5xl'>
          Ready to launch your marketplace?
        </h2>
        <p className='mx-auto mb-8 max-w-2xl text-lg text-muted-foreground'>
          Join thousands of successful platforms built on our infrastructure.
          Start free, scale infinitely.
        </p>

        <section className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
          <h3 className='sr-only'>Call to Action Buttons</h3>

          <Button size='lg' asChild>
            <Link href='/register'>
              Create Free Account <ArrowRightIcon />
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
        </section>
      </div>
    </section>
  )
}
