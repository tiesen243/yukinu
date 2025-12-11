import Image from 'next/image'
import Link from 'next/link'

import type { ProductValidators } from '@yukinu/validators/product'
import { slugify } from '@yukinu/lib/slugify'
import { cn } from '@yukinu/ui'
import { Badge } from '@yukinu/ui/badge'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@yukinu/ui/card'
import { StarIcon } from '@yukinu/ui/icons'

interface ProductCardProps extends Omit<
  React.ComponentProps<typeof Link>,
  'href'
> {
  product: ProductValidators.AllOutput['products'][number]
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className,
  ...props
}) => (
  <Link
    {...props}
    href={`/${slugify(product.name)}-${product.id}`}
    className={cn(
      'group/product-card flex aspect-square flex-col gap-6 rounded-xl border bg-card pb-6 text-card-foreground shadow-sm transition-colors hover:border-accent hover:bg-accent/20 hover:text-accent-foreground',
      className,
    )}
  >
    <CardHeader className='relative flex-1 overflow-hidden rounded-t-xl p-0'>
      <Image
        src={product.image ?? '/assets/logo.svg'}
        alt={product.name}
        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        loading='eager'
        className={cn(
          'rounded-t-xl object-cover transition-transform group-hover/product-card:scale-105',
          { 'dark:invert': product.image == null },
        )}
        fill
      />

      {product.category && (
        <Badge
          variant='outline'
          className='absolute top-2 right-2 bg-accent/60 text-accent-foreground backdrop-blur-xl group-hover/product-card:border-accent'
        >
          {product.category}
        </Badge>
      )}
    </CardHeader>

    <CardFooter className='flex-col items-start justify-end gap-2'>
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
    </CardFooter>
  </Link>
)

export const ProductCardSkeleton: React.FC<
  Omit<React.ComponentProps<typeof Card>, 'href'>
> = ({ className, ...props }) => (
  <Card {...props} className={cn('aspect-square pt-0', className)}>
    <CardHeader className='flex-1 animate-pulse bg-muted' />

    <CardFooter className='flex-col items-start justify-end gap-2'>
      <CardTitle className='w-3/4 animate-pulse rounded-md bg-muted text-lg'>
        &nbsp;
      </CardTitle>
      <CardDescription className='w-1/2 animate-pulse rounded-md bg-muted'>
        &nbsp;
      </CardDescription>

      <CardDescription className='w-full animate-pulse rounded-md bg-muted'>
        &nbsp;
      </CardDescription>
    </CardFooter>
  </Card>
)
