import { formatDate } from '@yukinu/lib/utils'
import { cn } from '@yukinu/ui'
import { Button } from '@yukinu/ui/button'
import { Card, CardAction, CardHeader } from '@yukinu/ui/card'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
} from '@yukinu/ui/icons'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@yukinu/ui/table'
import { useCallback } from 'react'

interface TRenderCell<TValue> {
  label: string
  render: (value: TValue) => React.ReactNode
}

export function DataTable<TData>({
  header,

  data,
  keyExtractor,
  isLoading = false,

  columns,
  actions,
  pagination,

  className,
  ...props
}: {
  header?: React.ReactNode
  data: TData[]
  columns: { [K in keyof TData]?: string | TRenderCell<TData[K]> }
  keyExtractor: (item: TData) => string
  isLoading?: boolean
  actions?: (item: TData) => React.ReactNode
  pagination?: {
    page?: number
    totalPages?: number
    limit?: number
    setPage?: (page: number) => void
  }
} & React.ComponentProps<typeof Card>) {
  const keys = Object.keys(columns) as (keyof TData)[]
  const renderCell = useCallback(
    <K extends keyof TData>(key: K, value: TData[K]) => {
      const column = columns[key]

      if (typeof column === 'string')
        return value instanceof Date ? formatDate(value) : String(value)

      if (typeof column === 'object' && 'render' in column)
        return column.render(value)

      return String(value)
    },
    [columns],
  )

  const saveToCSV = useCallback(() => {
    const _header = keys
      .map((key) =>
        typeof columns[key] === 'string'
          ? columns[key]
          : (columns[key]?.label ?? String(key)),
      )
      .join(',')

    const rows = data.map((row) =>
      keys
        .map((key) => {
          const value = row[key]
          if (value instanceof Date) return formatDate(value)
          if (typeof value === 'string')
            return `"${value.replaceAll('"', '""')}"`
          return String(value)
        })
        .join(','),
    )

    const csvContent = [_header, ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `data-${Date.now()}.csv`
    document.body.append(link)
    link.click()
    link.remove()
  }, [data, keys, columns])

  return (
    <Card {...props} className={cn('my-4 px-4', className)}>
      <CardHeader className='px-0'>
        {header}

        <CardAction>
          <Button variant='outline' size='icon' onClick={() => saveToCSV()}>
            <DownloadIcon />
            <span className='sr-only'>Export to CSV</span>
          </Button>
        </CardAction>
      </CardHeader>

      <Table>
        <TableHeader>
          <TableRow>
            {keys.map((key) => (
              <TableHead key={String(key)}>
                {typeof columns[key] === 'string'
                  ? columns[key]
                  : (columns[key]?.label ?? String(key))}
              </TableHead>
            ))}

            {actions && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            Array.from({ length: pagination?.limit ?? 10 }, (_, index) => (
              <TableRow key={index}>
                {keys.map((key) => (
                  <TableCell key={String(key)}>
                    <div className='h-4 w-full animate-pulse rounded bg-current' />
                  </TableCell>
                ))}

                {actions && (
                  <TableCell>
                    <div className='h-4 w-full animate-pulse rounded bg-current' />
                  </TableCell>
                )}
              </TableRow>
            ))}

          {!isLoading &&
            data.map((row) => (
              <TableRow key={keyExtractor(row)}>
                {keys.map((key) => (
                  <TableCell key={String(key)}>
                    {renderCell(key, row[key])}
                  </TableCell>
                ))}

                {actions && <TableCell>{actions(row)}</TableCell>}
              </TableRow>
            ))}
        </TableBody>

        {pagination && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={keys.length + (actions ? 1 : 0)}>
                <div className='flex items-center justify-center gap-4'>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() =>
                      pagination.page &&
                      pagination.page > 1 &&
                      pagination.setPage?.(pagination.page - 1)
                    }
                    disabled={pagination.page === 1}
                  >
                    <ChevronLeftIcon />
                    <span className='sr-only'>Previous Page</span>
                  </Button>

                  <span>
                    Page {pagination.page} of {pagination.totalPages}
                  </span>

                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() =>
                      pagination.page &&
                      pagination.page < (pagination.totalPages ?? 0) &&
                      pagination.setPage?.(pagination.page + 1)
                    }
                    disabled={pagination.page === pagination.totalPages}
                  >
                    <ChevronRightIcon />
                    <span className='sr-only'>Next Page</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </Card>
  )
}
