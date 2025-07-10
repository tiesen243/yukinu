'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { useQueryStates } from 'nuqs'

import { Button } from '@yuki/ui/button'
import { useForm } from '@yuki/ui/form'
import { FilterIcon } from '@yuki/ui/icons'
import { Input } from '@yuki/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@yuki/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@yuki/ui/select'

import { ProductCard } from '@/app/_components/product-card'
import { useTRPC } from '@/trpc/react'
import { searchParsers } from './page.lib'

export const ProductList: React.FC = () => {
  const [searchParams] = useQueryStates(searchParsers, {
    urlKeys: { query: 'q' },
  })

  const { trpc } = useTRPC()
  const {
    data: { products },
  } = useSuspenseQuery(trpc.product.all.queryOptions(searchParams))

  return products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))
}

export const SearchProduct: React.FC = () => {
  const [searchParams, setSearchParams] = useQueryStates(searchParsers, {
    urlKeys: { query: 'q' },
  })

  const form = useForm({
    defaultValues: searchParams,
    onSubmit: setSearchParams,
  })

  return (
    <form
      className="mb-4 grid gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <form.Field
        name="query"
        render={({ field, meta }) => (
          <div id={meta.id} className="grid gap-2">
            <form.Label>Search</form.Label>
            <form.Control {...field}>
              <Input />
            </form.Control>
          </div>
        )}
      />

      <div className="grid grid-cols-2 place-items-end gap-4 md:grid-cols-3">
        <form.Field
          name="sort"
          render={({ field, meta }) => (
            <div id={meta.id} className="grid w-full gap-2">
              <form.Label>Sort By</form.Label>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <form.Control className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Select sort option" />
                  </SelectTrigger>
                </form.Control>

                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="createdAt">Created At</SelectItem>
                  <SelectItem value="updatedAt">Updated At</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />

        <form.Field
          name="order"
          render={({ field, meta }) => (
            <div id={meta.id} className="grid w-full gap-2">
              <form.Label>Order</form.Label>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <form.Control className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Select order" />
                  </SelectTrigger>
                </form.Control>

                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />

        <Button className="col-span-2 w-full md:col-span-1">
          <FilterIcon /> Apply Filters
        </Button>
      </div>
    </form>
  )
}

export const PaginationSearch: React.FC = () => {
  const [searchParams, setSearchParams] = useQueryStates(searchParsers, {
    urlKeys: { query: 'q' },
  })

  const { trpc } = useTRPC()
  const {
    data: { page, totalPage },
  } = useSuspenseQuery(trpc.product.all.queryOptions(searchParams))

  if (totalPage <= 1 || page < 1 || page > totalPage) return null

  const renderPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    if (totalPage <= 7) {
      for (let i = 1; i <= totalPage; i++) pages.push(i)
    } else if (page <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i)

      pages.push('ellipsis')
      pages.push(totalPage)
    } else if (page >= totalPage - 2) {
      pages.push(1)
      pages.push('ellipsis')
      for (let i = totalPage - 3; i <= totalPage; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('ellipsis')
      pages.push(page - 1)
      pages.push(page)
      pages.push(page + 1)
      pages.push('ellipsis')
      pages.push(totalPage)
    }

    return pages
  }
  const pages = renderPageNumbers()

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() =>
              setSearchParams((prev) => ({
                ...prev,
                page: Math.max(prev.page - 1, 1),
              }))
            }
          />
        </PaginationItem>

        {pages.map((i, idx) => (
          // eslint-disable-next-line @eslint-react/no-array-index-key
          <PaginationItem key={`${i}-${idx}`}>
            {i === 'ellipsis' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                isActive={i === page}
                onClick={() =>
                  setSearchParams((prev) => ({ ...prev, page: i }))
                }
                aria-label={`Go to page ${i}`}
              >
                {i}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() =>
              setSearchParams((prev) => ({
                ...prev,
                page: Math.min(prev.page + 1, totalPage),
              }))
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
