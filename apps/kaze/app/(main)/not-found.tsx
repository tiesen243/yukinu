import Link from 'next/link'

import { Button } from '@yuki/ui/button'
import { Typography } from '@yuki/ui/typography'

import { createMetadata } from '@/lib/metadata'

export const metadata = createMetadata({
  title: 'Product Not Found',
  description:
    'The product you are looking for could not be found. Browse our collection or return to the homepage.',
})

export default function NotFound() {
  return (
    <main className='container flex min-h-[calc(100dvh-6rem)] flex-col items-center justify-center gap-8 md:min-h-[calc(100dvh-4rem)]'>
      <div className='flex h-fit flex-col items-center gap-4 md:flex-row'>
        <Typography variant='h1' className='mb-0'>
          404
        </Typography>
        <div className='hidden h-28 w-0.5 bg-muted-foreground md:block lg:h-32' />
        <div className='text-center md:text-left'>
          <Typography variant='h2'>Product Not Found</Typography>
          <Typography className='max-w-md text-muted-foreground'>
            Sorry, the product you're looking for doesn't exist or may have been
            removed.
          </Typography>
        </div>
      </div>

      <div className='flex flex-col gap-4 md:flex-row'>
        <Button size='lg' asChild>
          <Link href='/'>Take me home</Link>
        </Button>
        <Button size='lg' variant='outline' asChild>
          <Link href='/search'>Browse products</Link>
        </Button>
      </div>
    </main>
  )
}
