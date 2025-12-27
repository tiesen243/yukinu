import type { CategoryValidators } from '@yukinu/validators/category'

import { cn } from '@yukinu/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@yukinu/ui/card'
import Image from 'next/image'
import Link from 'next/link'

interface CategoryCardProps extends React.ComponentProps<typeof Card> {
  category: CategoryValidators.AllOutput['categories'][number]
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  className,
  ...props
}) => {
  return (
    <Card
      {...props}
      className={cn(
        'group/category-card pt-0 aspect-square transition-colors hover:ring-primary hover:bg-accent/40 hover:text-accent-foreground',
        className,
      )}
      render={<Link href={`/search?c=${category.id}`} />}
    >
      <div className='relative flex-1 overflow-hidden'>
        <Image
          src={category.image ?? '/assets/logo.svg'}
          alt={category.name}
          loading='eager'
          className={cn(
            'rounded-t-lg object-cover transition-transform group-hover/category-card:scale-105',
            { 'dark:invert': category.image === null },
          )}
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          fill
        />
      </div>

      <CardHeader>
        <CardTitle className='truncate text-lg'>{category.name}</CardTitle>
      </CardHeader>
    </Card>
  )
}

export const CategoryCardSkeleton: React.FC<
  React.ComponentProps<typeof Card>
> = ({ className, ...props }) => {
  return (
    <Card {...props} className={cn('rounded-lg pt-0', className)}>
      <CardHeader className='relative aspect-square animate-pulse rounded-t-lg bg-muted' />

      <CardContent>
        <CardTitle className='w-3/4 animate-pulse rounded-md bg-muted text-lg'>
          &nbsp;
        </CardTitle>
      </CardContent>
    </Card>
  )
}
