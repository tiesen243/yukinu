import { useQuery } from '@tanstack/react-query'
import { Loader2Icon, TriangleAlertIcon } from '@yukinu/ui/icons'
import { Typography } from '@yukinu/ui/typography'

import { useTRPC } from '@/lib/trpc'
import { SaveCategoryForm } from '@/routes/(catalog)/categories/_components/save-category-form'

import type { Route } from './+types/[id]'

export default function CatalogCategoriesIDPage({
  params,
}: Route.ComponentProps) {
  const { trpc } = useTRPC()
  const { data, isLoading } = useQuery({
    ...trpc.catalog.category.one.queryOptions(params),
  })

  return (
    <>
      <Typography variant='h2'>
        Edit Category: {data?.name ?? 'Loading...'}
      </Typography>
      <Typography className='text-muted-foreground'>
        Edit the details of the category below. You can update the name,
        description, and other relevant information to keep your catalog
        organized and up-to-date.
      </Typography>

      {isLoading && (
        <div className='my-4 flex h-64 animate-pulse flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-card/10'>
          <Loader2Icon className='animate-spin text-muted-foreground' />
          <Typography className='text-muted-foreground'>
            Loading category details...
          </Typography>
        </div>
      )}

      {!isLoading && !data && (
        <div className='my-4 flex h-64 flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-destructive/10'>
          <TriangleAlertIcon className='text-destructive' />
          <Typography className='text-destructive'>
            Failed to load category details. Please try again later.
          </Typography>
        </div>
      )}

      {data && <SaveCategoryForm category={data} />}
    </>
  )
}
