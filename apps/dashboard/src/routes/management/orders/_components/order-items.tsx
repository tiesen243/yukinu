import type { OneOrderDto } from '@yukinu/api/checkout'

import { formatPrice } from '@yukinu/lib/utils'
import { PackageIcon } from '@yukinu/ui/icons'
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from '@yukinu/ui/table'

export const OrderItems: React.FC<{
  items: OneOrderDto.Output['items']
}> = ({ items }) => (
  <section className='space-y-3'>
    <h4 className='sr-only'>Order Items section</h4>

    <div className='flex items-center gap-2 text-sm font-semibold tracking-wider text-foreground/80 uppercase'>
      <PackageIcon className='h-4 w-4 text-muted-foreground' />
      Order Items ({items.length})
    </div>
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead className='text-right'>Unit Price</TableHead>
            <TableHead className='text-center'>Quantity</TableHead>
            <TableHead className='text-right'>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => {
            const totalItemPrice =
              Number.parseFloat(item.unitPrice) * item.quantity
            return (
              <TableRow key={item.productId ?? index}>
                <TableCell className='flex items-center gap-3 font-medium'>
                  {item.productImage ? (
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className='size-9 rounded border bg-background object-cover'
                    />
                  ) : (
                    <div className='flex h-9 w-9 items-center justify-center rounded border bg-muted text-[10px] text-muted-foreground'>
                      No Pic
                    </div>
                  )}
                  <div>
                    <div className='line-clamp-1 text-sm font-semibold'>
                      {item.productName}
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      ID: {item.productId}
                    </div>
                  </div>
                </TableCell>
                <TableCell className='text-right'>
                  ${Number.parseFloat(item.unitPrice).toFixed(2)}
                </TableCell>
                <TableCell className='text-center'>{item.quantity}</TableCell>
                <TableCell className='text-right font-medium'>
                  {formatPrice(totalItemPrice)}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  </section>
)

export const OrderItemsSkeleton: React.FC = () => (
  <section className='animate-pulse space-y-3'>
    <h4 className='sr-only'>Order Items section</h4>

    <div className='flex items-center gap-2 text-sm font-semibold tracking-wider text-foreground/80 uppercase'>
      <PackageIcon className='h-4 w-4 text-muted-foreground' />
      Order Items
    </div>
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead className='text-right'>Unit Price</TableHead>
            <TableHead className='text-center'>Quantity</TableHead>
            <TableHead className='text-right'>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 3 }, (_, i) => (
            <TableRow key={i} className='animate-pulse'>
              <TableCell className='flex items-center gap-3 font-medium'>
                <div className='size-9 rounded border bg-muted' />
                <div>
                  <div className='line-clamp-1 w-32 bg-muted text-sm font-semibold'>
                    &nbsp;
                  </div>
                  <div className='w-24 bg-muted text-xs text-muted-foreground'>
                    &nbsp;
                  </div>
                </div>
              </TableCell>
              <TableCell className='text-right'>
                <div className='w-16 rounded bg-muted'>&nbsp;</div>
              </TableCell>
              <TableCell className='text-center'>
                <div className='w-8 rounded bg-muted'>&nbsp;</div>
              </TableCell>
              <TableCell className='text-right font-medium'>
                <div className='w-16 rounded bg-muted'>&nbsp;</div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </section>
)
