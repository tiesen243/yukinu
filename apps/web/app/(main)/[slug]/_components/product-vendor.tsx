import { Avatar, AvatarFallback, AvatarImage } from '@yukinu/ui/avatar'
import { Button } from '@yukinu/ui/button'

import { usePage } from '@/app/(main)/[slug]/page.provider'

export const ProductVendor: React.FC = () => {
  const {
    product: { vendor },
  } = usePage()

  return (
    <section className='flex items-center gap-4 rounded-lg bg-card p-6 shadow-md'>
      <h3 className='sr-only'>Vendor Information</h3>

      <Avatar className='size-20'>
        <AvatarImage src={vendor?.image ?? ''} alt={vendor?.name ?? 'Vendor'} />
        <AvatarFallback>
          {vendor?.name ? vendor.name.charAt(0).toUpperCase() : 'V'}
        </AvatarFallback>
      </Avatar>

      <div className='flex flex-1 flex-col gap-2'>
        <p className='text-xl font-semibold'>{vendor?.name}</p>

        <div className='flex gap-4'>
          <Button size='sm'>Contact</Button>

          <Button variant='outline' size='sm'>
            View Shop
          </Button>
        </div>
      </div>
    </section>
  )
}
