import Image from 'next/image'
import Link from 'next/link'

import type { CategoryValidators } from '@yukinu/validators/category'
import { cn } from '@yukinu/ui'
import { Card, CardFooter, CardHeader, CardTitle } from '@yukinu/ui/card'

interface CategoryCardProps extends Omit<
  React.ComponentProps<typeof Link>,
  'href'
> {
  category: CategoryValidators.AllOutput['categories'][number]
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  className,
  ...props
}) => {
  return (
    <Link
      {...props}
      href={`/search?c=${category.id}`}
      className={cn(
        'group/category-card flex flex-col gap-6 rounded-lg border bg-card pb-6 text-card-foreground shadow-sm transition-colors hover:border-accent hover:bg-accent/20 hover:text-accent-foreground',
        className,
      )}
    >
      <CardHeader className='relative aspect-square overflow-hidden rounded-t-lg p-0'>
        <Image
          src={category.image ?? '/assets/logo.svg'}
          alt={category.name}
          loading='eager'
          className={cn(
            'rounded-t-lg object-cover transition-transform group-hover/category-card:scale-105',
            { 'dark:invert': category.image == null },
          )}
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          fill
        />
      </CardHeader>

      <CardFooter>
        <CardTitle className='truncate text-lg'>{category.name}</CardTitle>
      </CardFooter>
    </Link>
  )
}

export const CategoryCardSkeleton: React.FC<
  React.ComponentProps<typeof Card>
> = ({ className, ...props }) => {
  return (
    <Card {...props} className={cn('rounded-lg pt-0', className)}>
      <CardHeader className='relative aspect-square animate-pulse rounded-t-lg bg-muted' />

      <CardFooter>
        <CardTitle className='w-3/4 animate-pulse rounded-md bg-muted text-lg'>
          &nbsp;
        </CardTitle>
      </CardFooter>
    </Card>
  )
}
