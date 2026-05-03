import { useQuery } from '@tanstack/react-query'
import { formatPrice } from '@yukinu/lib/utils'
import { Card, CardHeader, CardTitle } from '@yukinu/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@yukinu/ui/table'

import { useTRPC } from '@/lib/trpc'

export const TopVendors: React.FC = () => {
  const { trpc } = useTRPC()
  const { data, isLoading } = useQuery(
    trpc.sales.admin.analytics.queryOptions(),
  )
  if (isLoading || !data) return <div>Loading...</div>

  return (
    <Card className='mb-4 px-4'>
      <CardHeader className='px-0'>
        <CardTitle>Top Performing Vendors</CardTitle>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vendor Name</TableHead>
            <TableHead>Total Orders</TableHead>
            <TableHead className='text-right'>Revenue Generated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.vendorRanking.map((vendor) => (
            <TableRow key={vendor.vendorName}>
              <TableCell className='font-medium'>{vendor.vendorName}</TableCell>
              <TableCell>{vendor.orderCount}</TableCell>
              <TableCell className='text-right font-mono text-success'>
                {formatPrice(vendor.revenue ?? '0')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
