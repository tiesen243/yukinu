import { useQuery } from '@tanstack/react-query'
import { Badge } from '@yukinu/ui/badge'
import { TableCell, TableRow } from '@yukinu/ui/table'

import { useTRPC } from '@/lib/trpc/react'
import { EditVendorButton } from '@/routes/admin/vendors/edit-vendor-button'
import { useVendorQueryStates } from '@/routes/admin/vendors/hook'

export const VendorsList: React.FC = () => {
  const trpc = useTRPC()
  const [query] = useVendorQueryStates()

  const { data, isLoading } = useQuery(trpc.vendor.all.queryOptions(query))

  if (isLoading)
    return Array.from({ length: 5 }, (_, index) => (
      <TableRow key={index}>
        {Array.from({ length: 8 }, (_, cellIndex) => (
          <TableCell key={cellIndex}>
            <div className='animate-pulse rounded bg-muted/50'>&nbsp;</div>
          </TableCell>
        ))}
      </TableRow>
    ))

  const statusVariantMap = {
    approved: 'success',
    pending: 'warning',
    suspended: 'destructive',
  } as const

  return data?.vendors.map((vendor) => (
    <TableRow key={vendor.id}>
      <TableCell>{vendor.id}</TableCell>
      <TableCell>{vendor.name}</TableCell>
      <TableCell>{vendor.owner.username}</TableCell>
      <TableCell>{vendor.staffCount}</TableCell>
      <TableCell>
        <Badge variant={statusVariantMap[vendor.status]}>{vendor.status}</Badge>
      </TableCell>
      <TableCell>{vendor.createdAt.toLocaleDateString()}</TableCell>
      <TableCell>{vendor.updatedAt.toLocaleDateString()}</TableCell>
      <TableCell>
        <EditVendorButton vendor={vendor} />
      </TableCell>
    </TableRow>
  ))
}
