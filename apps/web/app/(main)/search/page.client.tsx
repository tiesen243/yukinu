'use client'

import { useQuery } from '@tanstack/react-query'
import { AllProductsDto } from '@yukinu/api/catalog'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@yukinu/ui/select'
import { useQueryStates } from 'nuqs'
import { useState } from 'react'

import { productsOptions, productsParsers } from '@/app/(main)/search/page.lib'
import { ProductCard, ProductCardSkeleton } from '@/components/product-card'
import { ProductPagination } from '@/components/product-pagination'
import { useTRPC } from '@/lib/trpc'

export const FilterForm: React.FC = () => {
  const [query, setQuery] = useQueryStates(productsParsers, productsOptions)

  const { trpc } = useTRPC()
  const { data, status } = useQuery(
    trpc.catalog.category.all.queryOptions({ search: '', limit: 100 }),
  )

  const [formState, setFormState] = useState({
    q: query.search,
    categoryId: query.categoryId,
    orderBy: query.orderBy,
  })

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()

    const search = formState.q ?? null
    const categoryId =
      formState.categoryId === '' ? null : (formState.categoryId ?? null)
    const _orderBy =
      (formState.orderBy as AllProductsDto.OrderBy | null) ?? 'createdAt_desc'

    await setQuery((prev) => ({
      ...prev,
      search,
      categoryId,
      orderBy: _orderBy,
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
              value={formState.q}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, q: e.target.value }))
              }
            />
          </Field>

          {status === 'success' && (
            <Field>
              <FieldLabel htmlFor='categoryId'>Category</FieldLabel>
              <Select
                id='categoryId'
                name='categoryId'
                value={formState.categoryId}
                onValueChange={(value) =>
                  setFormState((prev) => ({ ...prev, categoryId: value }))
                }
                items={[
                  { value: '', label: 'All' },
                  ...data.categories.map((category) => ({
                    value: category.id,
                    label: category.name,
                  })),
                ]}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select a category' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='' className='text-muted-foreground'>
                    All
                  </SelectItem>
                  {data?.categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}

          <Field>
            <FieldLabel htmlFor='orderBy'>Sort By</FieldLabel>
            <NativeSelect
              id='orderBy'
              name='orderBy'
              value={formState.orderBy}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  orderBy: e.target.value as AllProductsDto.OrderBy,
                }))
              }
            >
              {AllProductsDto.orderBy.map((order) => {
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

export const ProductsSearchResults: React.FC = () => {
  const [query] = useQueryStates(productsParsers, productsOptions)
  const { trpc } = useTRPC()

  const { data, isLoading } = useQuery(
    trpc.catalog.product.all.queryOptions(query),
  )

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
  const { trpc } = useTRPC()

  const { data, isLoading } = useQuery(
    trpc.catalog.product.all.queryOptions(query),
  )
  if (isLoading || !data) return null

  const { pagination } = data

  const goToPage = async (page: number) => {
    await setQuery((prev) => ({ ...prev, page }))
  }

  return (
    <ProductPagination
      pagination={pagination}
      query={query}
      goToPage={goToPage}
    />
  )
}
