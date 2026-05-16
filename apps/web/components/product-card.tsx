import type { AllProductsDto } from '@yukinu/api/catalog'

import { slugify } from '@yukinu/lib/utils'
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

import { Link } from '@/components/link'

interface ProductCardProps extends React.ComponentProps<typeof Card> {
  product: AllProductsDto.Output['products'][number]
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className,
  ...props
}) => (
  <Card
    {...props}
    className={cn(
      'group/product-card flex aspect-square pt-0 transition-colors hover:bg-accent/40 hover:text-accent-foreground hover:ring-primary',
      className,
    )}
    render={<Link href={`/${slugify(product.name)}-${product.id}` as never} />}
  >
    <div className='relative flex-1 overflow-hidden'>
      <Image
        src={product.image ?? '/assets/logo.svg'}
        alt={product.name}
        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        className='object-cover transition-transform group-hover/product-card:scale-105'
        fill
      />
    </div>

    <CardHeader>
      <CardTitle className='line-clamp-1 text-lg'>{product.name}</CardTitle>

      <CardDescription>
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(+product.price)}
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
