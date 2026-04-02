import type { OneOutput } from '@yukinu/validators/order'

import { Card, CardContent, CardHeader, CardTitle } from '@yukinu/ui/card'

export const CustomerInformation: React.FC<{ user: OneOutput['user'] }> = ({
  user,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Customer Information</CardTitle>
    </CardHeader>
    <CardContent className='space-y-3'>
      <div>
        <p className='text-sm text-muted-foreground'>Username</p>
        <p className='font-semibold'>{user?.username}</p>
      </div>
      <div>
        <p className='text-sm text-muted-foreground'>Email</p>
        <p className='font-medium'>{user?.email}</p>
      </div>
    </CardContent>
  </Card>
)

export const CustomerInformationSkeleton: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Customer Information</CardTitle>
    </CardHeader>
    <CardContent className='space-y-3'>
      <div className='animate-pulse'>
        <div className='w-1/3 rounded bg-current'>&nbsp;</div>
        <div className='mt-1 w-1/2 rounded bg-current'>&nbsp;</div>
      </div>
      <div className='animate-pulse'>
        <div className='w-1/3 rounded bg-current'>&nbsp;</div>
        <div className='mt-1 w-1/2 rounded bg-current'>&nbsp;</div>
      </div>
    </CardContent>
  </Card>
)
