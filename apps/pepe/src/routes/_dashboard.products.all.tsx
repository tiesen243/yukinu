import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import type { RouterOutputs } from '@yuki/api'
import { cn } from '@yuki/ui'
import { Button } from '@yuki/ui/button'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronUpIcon,
} from '@yuki/ui/icons'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@yuki/ui/table'

import { useTRPC } from '@/trpc/react'

export default function AllProductsPage() {
  const { trpc } = useTRPC()
  const { data = [], isLoading } = useQuery(
    trpc.admin.product.all.queryOptions(),
  )

  const columnHelper =
    createColumnHelper<RouterOutputs['admin']['product']['all'][number]>()
  const columns = React.useMemo(
    () => [
      columnHelper.accessor('id', {
        cell: (info) => info.getValue(),
        header: () => <>Product ID</>,
      }),
      columnHelper.accessor('name', {
        header: () => <>Product Name</>,
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('category', {
        header: () => <>Category</>,
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('seller', {
        header: () => <>Seller</>,
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('price', {
        header: () => <>Price</>,
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('stock', {
        header: () => <>Stock</>,
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('createdAt', {
        header: () => <>Created At</>,
        cell: (info) => info.getValue().toLocaleDateString(),
      }),
      columnHelper.accessor('updatedAt', {
        header: () => <>Updated At</>,
        cell: (info) => info.getValue().toLocaleDateString(),
      }),
    ],
    [columnHelper],
  )

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <main className='container py-4'>
      <div className='w-full group-data-[state=collapsed]/sidebar-inset:md:w-[calc(100%-var(--sidebar-width-icon))] group-data-[state=expanded]/sidebar-inset:md:w-[calc(100%-var(--sidebar-width))] lg:w-full group-data-[state=expanded]/sidebar-inset:lg:w-full'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <button
                        type='button'
                        className={cn(
                          'flex items-center gap-1 [&_svg]:size-4',
                          header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : '',
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                        title={
                          header.column.getCanSort()
                            ? header.column.getNextSortingOrder() === 'asc'
                              ? 'Sort ascending'
                              : header.column.getNextSortingOrder() === 'desc'
                                ? 'Sort descending'
                                : 'Clear sort'
                            : undefined
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: <ChevronUpIcon />,
                          desc: <ChevronDownIcon />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </button>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody suppressHydrationWarning>
            {isLoading
              ? Array.from({ length: 10 }, (_, rowIdx) => (
                  <TableRow key={`loading-${rowIdx}`}>
                    {columns.map((_, cellIdx) => (
                      // eslint-disable-next-line @eslint-react/no-array-index-key
                      <TableCell key={`loading-${rowIdx}-${cellIdx}`}>
                        <div className='h-5 w-full animate-pulse rounded-md bg-current' />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={`${row.id}-${cell.id}`}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={columns.length}>
                {isLoading ? (
                  <div className='flex items-center justify-center gap-4'>
                    <Button variant='outline' size='icon' disabled>
                      <ChevronsLeftIcon />
                    </Button>

                    <Button variant='outline' size='icon' disabled>
                      <ChevronLeftIcon />
                    </Button>

                    <div className='flex items-center gap-2'>
                      Page <strong>1</strong> of <strong>1</strong>
                    </div>

                    <Button variant='outline' size='icon' disabled>
                      <ChevronRightIcon />
                    </Button>

                    <Button variant='outline' size='icon' disabled>
                      <ChevronsRightIcon />
                    </Button>
                  </div>
                ) : (
                  <div className='flex items-center justify-center gap-4'>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => {
                        table.firstPage()
                      }}
                      disabled={!table.getCanPreviousPage()}
                    >
                      <ChevronsLeftIcon />
                    </Button>

                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => {
                        table.previousPage()
                      }}
                      disabled={!table.getCanPreviousPage()}
                    >
                      <ChevronLeftIcon />
                    </Button>

                    <div className='flex items-center gap-2'>
                      Page
                      <strong>
                        {table.getState().pagination.pageIndex + 1}
                      </strong>
                      of
                      <strong>{table.getPageCount().toLocaleString()}</strong>
                    </div>

                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => {
                        table.nextPage()
                      }}
                      disabled={!table.getCanNextPage()}
                    >
                      <ChevronRightIcon />
                    </Button>

                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => {
                        table.lastPage()
                      }}
                      disabled={!table.getCanNextPage()}
                    >
                      <ChevronsRightIcon />
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </main>
  )
}
