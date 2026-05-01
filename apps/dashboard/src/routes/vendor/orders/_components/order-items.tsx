import type { OneOrderDto } from '@yukinu/api/checkout'

import { formatPrice } from '@yukinu/lib/utils'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@yukinu/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@yukinu/ui/item'

export const OrderItems: React.FC<{ items: OneOrderDto.Output['items'] }> = ({
  items,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Order Items</CardTitle>
      <CardDescription>{items.length} item(s)</CardDescription>
    </CardHeader>
    <CardContent>
      <ItemGroup>
        {items.map((item) => (
          <Item key={item.productId}>
            <ItemMedia variant='image'>
              <img
                src={item.productImage ?? '/assets/favicon.svg'}
                alt={item.productName ?? 'Product Image'}
                className='size-20 object-cover'
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{item.productName}</ItemTitle>
              <ItemDescription>Quantity: {item.quantity}</ItemDescription>
              <ItemTitle>{formatPrice(item.unitPrice)}</ItemTitle>
            </ItemContent>
            <ItemContent>
              <ItemDescription>Subtotal</ItemDescription>
              <ItemTitle>
                {formatPrice(Number.parseFloat(item.unitPrice) * item.quantity)}
              </ItemTitle>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    </CardContent>
  </Card>
)

export const OrderItemsSkeleton: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Order Items</CardTitle>
      <CardDescription className='animate-pulse'>&nbsp;</CardDescription>
    </CardHeader>
    <CardContent>
      <ItemGroup>
        {Array.from({ length: 3 }, (_, i) => (
          <Item key={i}>
            <ItemMedia variant='image'>
              <div className='h-16 w-16 animate-pulse rounded bg-current'>
                &nbsp;
              </div>
            </ItemMedia>
            <ItemContent>
              <ItemTitle className='w-1/2 animate-pulse rounded bg-current'>
                &nbsp;
              </ItemTitle>
              <ItemDescription className='mt-1 w-1/3 animate-pulse rounded bg-current'>
                &nbsp;
              </ItemDescription>
              <ItemTitle className='mt-1 w-1/4 animate-pulse rounded bg-current'>
                &nbsp;
              </ItemTitle>
            </ItemContent>
            <ItemContent>
              <ItemDescription className='w-24 animate-pulse rounded bg-current'>
                &nbsp;
              </ItemDescription>
              <ItemTitle className='mt-1 w-20 animate-pulse rounded bg-current'>
                &nbsp;
              </ItemTitle>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    </CardContent>
  </Card>
)
