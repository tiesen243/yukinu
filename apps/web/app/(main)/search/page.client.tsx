'use client'

import { useQuery } from '@tanstack/react-query'
import { Avatar, AvatarFallback, AvatarImage } from '@yukinu/ui/avatar'
import { Button } from '@yukinu/ui/button'
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@yukinu/ui/field'
import { FilterIcon } from '@yukinu/ui/icons'
import { Input } from '@yukinu/ui/input'
import { NativeSelect, NativeSelectOption } from '@yukinu/ui/native-select'
import { ProductValidators } from '@yukinu/validators/product'
import { useQueryStates } from 'nuqs'

import { ProductCard, ProductCardSkeleton } from '@/components/product-card'
import { productsOptions, productsParsers } from '@/lib/search'
import { useTRPC } from '@/lib/trpc/react'

export const FilterForm: React.FC = () => {
  const [query, setQuery] = useQueryStates(productsParsers, productsOptions)

  const trpc = useTRPC()
  const { data } = useQuery(
    trpc.category.all.queryOptions({ search: null, limit: 100 }),
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = Object.fromEntries(
      new FormData(e.currentTarget),
    ) as Record<string, string>
    const search = formData.q ?? null
    const categoryId =
      formData.categoryId === '' ? null : (formData.categoryId ?? null)
    const orderBy =
      (formData.orderBy as ProductValidators.OrderBy | null) ?? 'createdAt_desc'

    await setQuery((prev) => ({
      ...prev,
      search,
      categoryId,
      orderBy,
      page: 1,
    }))
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldSet>
        <FieldLegend className='hidden md:flex'>Filters</FieldLegend>
        <FieldGroup className='gap-4'>
          <Field>
            <FieldLabel htmlFor='q'>Search</FieldLabel>
            <Input
              id='q'
              name='q'
              type='search'
              placeholder='Search...'
              defaultValue={query.search ?? ''}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor='categoryId'>Category</FieldLabel>
            <NativeSelect
              id='categoryId'
              name='categoryId'
              defaultValue={query.categoryId ?? ''}
            >
              <NativeSelectOption value=''>All</NativeSelectOption>
              {data?.categories.map((category) => (
                <NativeSelectOption key={category.id} value={category.id}>
                  {category.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Field>

          <Field>
            <FieldLabel htmlFor='orderBy'>Sort By</FieldLabel>
            <NativeSelect
              id='orderBy'
              name='orderBy'
              defaultValue={query.orderBy}
            >
              {ProductValidators.orderBy.map((order) => {
                const [field, direction] = order.split('_')

                return (
                  <NativeSelectOption key={order} value={order}>
                    {field} ({direction})
                  </NativeSelectOption>
                )
              })}
            </NativeSelect>
          </Field>

          <Field>
            <Button variant='outline' type='submit'>
              <FilterIcon /> Apply Filters
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}

const EntityInfoCard: React.FC<{
  data: {
    name: string
    description: string | null
    image: string | null
  } | null
}> = ({ data }) =>
  data ? (
    <div className='flex items-center gap-4'>
      <Avatar className={`size-16 ${data.image ? '' : 'dark:invert'}`}>
        <AvatarImage src={data.image ?? '/assets/logo.svg'} alt={data.name} />
        <AvatarFallback>{data.name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className='flex flex-col gap-2'>
        <p className='text-lg font-semibold'>{data.name}</p>
        <p className='text-sm text-muted-foreground'>
          {data.description ?? 'No description available.'}
        </p>
      </div>
    </div>
  ) : null

export const AdditionalInfo: React.FC = () => {
  const [query] = useQueryStates(productsParsers, productsOptions)
  const trpc = useTRPC()

  const { data } = useQuery(trpc.product.all.queryOptions(query))

  const showCategory = query.categoryId && data?.category
  const showVendor = query.vendorId && data?.vendor

  if (!showCategory && !showVendor) return null

  return (
    <section className='flex items-center gap-6 rounded-xl bg-card p-6 shadow-sm dark:border'>
      <h3 className='sr-only'>Additional Information section</h3>

      {showVendor && <EntityInfoCard data={data.vendor} />}
      {showCategory && <EntityInfoCard data={data.category} />}
    </section>
  )
}

export const ProductsSearchResults: React.FC = () => {
  const [query] = useQueryStates(productsParsers, productsOptions)
  const trpc = useTRPC()

  const { data, isLoading } = useQuery(trpc.product.all.queryOptions(query))

  if (isLoading)
    return Array.from({ length: 8 }, (_, i) => <ProductCardSkeleton key={i} />)

  if (!data || data.products.length === 0)
    return (
      <div className='text-sm text-muted-foreground'>No products found.</div>
    )

  return data.products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))
}

export const ProductsSearchPagination: React.FC = () => {
  const [query, setQuery] = useQueryStates(productsParsers, productsOptions)
  const trpc = useTRPC()

  const { data, isLoading } = useQuery(trpc.product.all.queryOptions(query))
  if (isLoading || !data) return null

  const { pagination } = data

  const goToPage = async (page: number) => {
    await setQuery((prev) => ({ ...prev, page }))
  }

  return (
    <section className='flex items-center justify-center gap-2'>
      <h3 className='sr-only'>Pagination Navigation section</h3>

      {getPaginationRange(query.page, pagination.totalPages).map(
        (item, idx) => (
          <Button
            key={`pagination-item-${idx}`}
            variant='outline'
            size='icon'
            onClick={() => goToPage(Number(item))}
            disabled={item === '...' || item === query.page}
          >
            {item}
          </Button>
        ),
      )}
    </section>
  )
}

function getPaginationRange(cp: number, tp: number): (number | string)[] {
  if (tp <= 7) {
    return Array.from({ length: tp }, (_, i) => i + 1)
  }

  const range: (number | string)[] = []
  if (cp <= 4) {
    range.push(1, 2, 3, 4, 5, '...', tp)
  } else if (cp >= tp - 3) {
    range.push(1, '...', tp - 4, tp - 3, tp - 2, tp - 1, tp)
  } else {
    range.push(1, '...', cp - 1, cp, cp + 1, '...', tp)
  }
  return range
}
