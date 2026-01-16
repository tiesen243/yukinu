'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { Avatar, AvatarFallback, AvatarImage } from '@yukinu/ui/avatar'
import { Card, CardContent, CardHeader } from '@yukinu/ui/card'
import { UserIcon } from '@yukinu/ui/icons'
import { Typography } from '@yukinu/ui/typography'
import { useQueryStates } from 'nuqs'

import { ProductCard, ProductCardSkeleton } from '@/components/product-card'
import { ProductPagination } from '@/components/product-pagination'
import { productsOptions, productsParsers } from '@/lib/search'
import { useTRPC } from '@/lib/trpc/react'

export const VendorDetails: React.FC<{ id: string }> = ({ id }) => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.vendor.one.queryOptions({ id }))

  return (
    <Card render={<section />}>
      <CardHeader className='flex flex-row items-center gap-4'>
        <Avatar className='size-32'>
          <AvatarImage src={data.image ?? ''} alt={data.name} />
          <AvatarFallback>
            <UserIcon className='size-16 text-muted-foreground' />
          </AvatarFallback>
        </Avatar>

        <div>
          <Typography variant='h2'>{data.name}</Typography>
          <Typography className='text-muted-foreground'>
            Joined At: {data.createdAt.toDateString()}
          </Typography>
        </div>
      </CardHeader>

      <CardContent>
        <Typography className='whitespace-pre-wrap'>
          {data.description ?? 'No description provided.'}
        </Typography>

        <Typography variant='ul'>
          <li>
            <strong>Address:</strong> {data.address ?? 'N/A'}
          </li>
          <li>
            <strong>Contact:</strong> {data.contact ?? 'N/A'}
          </li>
        </Typography>
      </CardContent>
    </Card>
  )
}

export const VendorDetailsSkeleton: React.FC = () => (
  <Card className='animate-pulse' render={<section />}>
    <CardHeader className='flex flex-row items-center gap-4'>
      <Avatar className='size-32 bg-muted' />

      <div className='w-full'>
        <Typography variant='h2' className='w-1/4 rounded-sm bg-muted'>
          &nbsp;
        </Typography>
        <Typography className='w-1/3 rounded-sm bg-muted'>&nbsp;</Typography>
      </div>
    </CardHeader>

    <CardContent>
      <Typography className='h-20 w-full rounded-sm bg-muted'>
        &nbsp;
      </Typography>

      <Typography variant='ul'>
        <li className='w-1/3 rounded-sm bg-muted'>&nbsp;</li>
        <li className='w-1/4 rounded-sm bg-muted'>&nbsp;</li>
      </Typography>
    </CardContent>
  </Card>
)

export const VendorProducts: React.FC<{ id: string }> = ({ id }) => {
  const trpc = useTRPC()
  const [query, setQuery] = useQueryStates(productsParsers, productsOptions)

  const { data } = useSuspenseQuery(
    trpc.product.all.queryOptions({ ...query, vendorId: id }),
  )

  const goToPage = async (page: number) => {
    await setQuery((prev) => ({ ...prev, page }))
  }

  return (
    <>
      {data.products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}

      <ProductPagination
        pagination={data.pagination}
        query={query}
        goToPage={goToPage}
        className='col-span-full'
      />
    </>
  )
}

export const VendorProductsSkeleton: React.FC = () => {
  return (
    <>
      {Array.from({ length: 8 }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </>
  )
}
