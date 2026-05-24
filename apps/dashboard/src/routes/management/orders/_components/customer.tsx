import type { OneOrderDto } from '@yukinu/api/checkout'

import { MapPinIcon, UserIcon } from '@yukinu/ui/icons'

export const Customer: React.FC<{
  user: OneOrderDto.Output['user']
  address: OneOrderDto.Output['address']
}> = ({ user, address }) => (
  <section className='grid gap-6 border-b pb-6 sm:grid-cols-2'>
    <h4 className='sr-only'>Customer and Shipping Information</h4>

    <div className='space-y-2.5'>
      <div className='flex items-center gap-2 text-sm font-semibold tracking-wider text-foreground/80 uppercase'>
        <UserIcon className='size-4 text-muted-foreground' />
        Customer Details
      </div>

      {user ? (
        <div className='space-y-1 rounded-lg border bg-muted/30 p-3 text-sm'>
          <div>
            <span className='text-muted-foreground'>Username:</span>{' '}
            <strong className='font-medium'>{user.username}</strong>
          </div>
          <div>
            <span className='text-muted-foreground'>Email:</span>{' '}
            <span className='font-medium break-all'>{user.email}</span>
          </div>
          <div className='mt-1 border-t pt-1 text-xs text-muted-foreground'>
            User ID: <code>{user.id}</code>
          </div>
        </div>
      ) : (
        <div className='rounded-lg border bg-muted/20 p-3 text-center text-sm text-muted-foreground italic'>
          Guest Checkout
        </div>
      )}
    </div>

    <div className='space-y-2.5'>
      <div className='flex items-center gap-2 text-sm font-semibold tracking-wider text-foreground/80 uppercase'>
        <MapPinIcon className='size-4 text-muted-foreground' />
        Shipping Address
      </div>

      {address ? (
        <div className='space-y-1 rounded-lg border bg-muted/30 p-3 text-sm'>
          <div>
            <span className='text-muted-foreground'>Recipient:</span>{' '}
            <strong className='font-medium'>{address.recipientName}</strong>
          </div>
          <div>
            <span className='text-muted-foreground'>Phone:</span>{' '}
            <span className='font-medium'>{address.phoneNumber}</span>
          </div>
          <div className='mt-0.5 line-clamp-2 border-t pt-1 text-xs leading-relaxed text-muted-foreground'>
            {address.street}, {address.city}, {address.state}{' '}
            {address.postalCode && `, ${address.postalCode}`}, {address.country}
          </div>
        </div>
      ) : (
        <div className='rounded-lg border bg-muted/20 p-3 text-center text-sm text-muted-foreground italic'>
          No shipping address provided
        </div>
      )}
    </div>
  </section>
)

export const CustomerSkeleton: React.FC = () => (
  <section className='grid gap-6 border-b pb-6 sm:grid-cols-2'>
    <div className='space-y-2.5'>
      <div className='flex items-center gap-2 text-sm font-semibold tracking-wider text-foreground/80 uppercase'>
        <UserIcon className='size-4 text-muted-foreground' />
        Customer Details
      </div>
      <div className='animate-pulse space-y-1 rounded-lg border bg-muted/30 p-3 text-sm'>
        <div className='w-1/2 rounded bg-muted'>&nbsp;</div>
        <div className='w-3/4 rounded bg-muted'>&nbsp;</div>
        <div className='mt-1 w-1/4 rounded bg-muted'>&nbsp;</div>
      </div>
    </div>

    <div className='space-y-2.5'>
      <div className='flex items-center gap-2 text-sm font-semibold tracking-wider text-foreground/80 uppercase'>
        <MapPinIcon className='size-4 text-muted-foreground' />
        Shipping Address
      </div>
      <div className='animate-pulse space-y-1 rounded-lg border bg-muted/30 p-3 text-sm'>
        <div className='w-1/2 rounded bg-muted'>&nbsp;</div>
        <div className='w-3/4 rounded bg-muted'>&nbsp;</div>
        <div className='mt-0.5 w-full rounded bg-muted'>&nbsp;</div>
      </div>
    </div>
  </section>
)
