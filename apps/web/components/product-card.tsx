import type { ProductValidators } from '@yukinu/validators/product'

import { slugify } from '@yukinu/lib/slugify'
import { cn } from '@yukinu/ui'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@yukinu/ui/card'
import { StarIcon } from '@yukinu/ui/icons'
import Image from 'next/image'
import Link from 'next/link'

interface ProductCardProps extends React.ComponentProps<typeof Card> {
  product: ProductValidators.AllOutput['products'][number]
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className,
  ...props
}) => (
  <Card
    {...props}
    className={cn(
      'group/product-card flex aspect-square pt-0 transition-colors hover:ring-primary hover:bg-accent/40 hover:text-accent-foreground',
      className,
    )}
    render={<Link href={`/${slugify(product.name)}-${product.id}`} />}
  >
    <div className='relative flex-1 overflow-hidden'>
      <Image
        src={product.image ?? '/assets/logo.svg'}
        alt={product.name}
        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        className={cn(
          'object-cover transition-transform group-hover/product-card:scale-105',
          { 'dark:invert': !product.image },
        )}
        fill
      />
    </div>

    <CardHeader>
      <CardTitle className='line-clamp-1 text-lg'>{product.name}</CardTitle>

      <CardDescription>
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(parseFloat(product.price))}
      </CardDescription>

      <CardDescription className='flex w-full items-center justify-between'>
        <p className='flex items-center gap-1'>
          <StarIcon className='size-4' /> {product.rating}
        </p>
        <p>Sold {product.sold}</p>
      </CardDescription>
    </CardHeader>
  </Card>
)

export const ProductCardSkeleton: React.FC<
  Omit<React.ComponentProps<typeof Card>, 'href'>
> = ({ className, ...props }) => (
  <Card {...props} className={cn('aspect-square pt-0', className)}>
    <CardHeader className='flex-1 animate-pulse bg-muted' />

    <CardContent className='flex-col items-start justify-end gap-2'>
      <CardTitle className='w-3/4 animate-pulse rounded-md bg-muted text-lg'>
        &nbsp;
      </CardTitle>
      <CardDescription className='w-1/2 animate-pulse rounded-md bg-muted'>
        &nbsp;
      </CardDescription>

      <CardDescription className='w-full animate-pulse rounded-md bg-muted'>
        &nbsp;
      </CardDescription>
    </CardContent>
  </Card>
)
