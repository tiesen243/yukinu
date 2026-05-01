import type { OneOrderDto } from '@yukinu/api/checkout'

import { Card, CardHeader, CardTitle, CardContent } from '@yukinu/ui/card'

export const DeliveryAddress: React.FC<{
  address: OneOrderDto.Output['address']
}> = ({ address }) => (
  <Card>
    <CardHeader>
      <CardTitle>Delivery Address</CardTitle>
    </CardHeader>
    <CardContent className='space-y-3'>
      <div>
        <p className='text-sm text-muted-foreground'>Recipient</p>
        <p className='font-semibold'>{address?.recipientName}</p>
      </div>
      <div>
        <p className='text-sm text-muted-foreground'>Address</p>
        <p className='font-medium'>
          {address?.street}
          <br />
          {address?.city}, {address?.state} {address?.postalCode}
          <br />
          {address?.country}
        </p>
      </div>
      <div>
        <p className='text-sm text-muted-foreground'>Phone Number</p>
        <p className='font-medium'>{address?.phoneNumber}</p>
      </div>
    </CardContent>
  </Card>
)

export const DeliveryAddressSkeleton: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Delivery Address</CardTitle>
    </CardHeader>
    <CardContent className='space-y-3'>
      <div className='animate-pulse'>
        <div className='w-1/3 rounded bg-current'>&nbsp;</div>
        <div className='mt-1 w-1/2 rounded bg-current'>&nbsp;</div>
      </div>
      <div className='animate-pulse'>
        <div className='w-2/3 rounded bg-current'>&nbsp;</div>
        <div className='mt-1 w-full rounded bg-current'>&nbsp;</div>
        <div className='mt-1 w-3/4 rounded bg-current'>&nbsp;</div>
      </div>
      <div className='animate-pulse'>
        <div className='w-1/3 rounded bg-current'>&nbsp;</div>
        <div className='mt-1 w-1/2 rounded bg-current'>&nbsp;</div>
      </div>
    </CardContent>
  </Card>
)
