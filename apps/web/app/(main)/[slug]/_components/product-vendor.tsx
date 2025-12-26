'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@yukinu/ui/avatar'
import { Button } from '@yukinu/ui/button'
import Link from 'next/link'

import { usePage } from '@/app/(main)/[slug]/page.provider'

export const ProductVendor: React.FC = () => {
  const {
    product: { vendor },
  } = usePage()

  if (vendor === null)
    return (
      <section className='flex items-center gap-4 rounded-lg bg-card p-6 shadow-md dark:border'>
        <h2 className='sr-only'>Vendor Information</h2>
        <p className='text-sm text-muted-foreground'>
          Vendor information is unavailable because the vendor has been deleted.
        </p>
      </section>
    )

  return (
    <section className='flex items-center gap-4 rounded-lg bg-card p-6 shadow-md dark:border'>
      <h2 className='sr-only'>Vendor Information</h2>

      <Avatar className='size-14'>
        <AvatarImage src={vendor.image ?? ''} alt={vendor.name} />
        <AvatarFallback>{vendor.name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className='flex flex-1 flex-col items-start justify-between gap-2 text-center sm:flex-row sm:items-center'>
        <div className='flex flex-col items-start gap-2'>
          <p className='text-xl font-semibold'>{vendor.name}</p>
          <p className='text-sm text-muted-foreground'>{vendor.address}</p>
        </div>

        <div className='flex gap-4'>
          <Button size='sm'>Contact</Button>

          <Button
            variant='outline'
            size='sm'
            nativeButton={false}
            render={<Link href={`/search?v=${vendor.id}`}>View Shop</Link>}
          />
        </div>
      </div>
    </section>
  )
}
