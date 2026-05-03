import { useQuery } from '@tanstack/react-query'
import { formatDate } from '@yukinu/lib/utils'
import { Badge } from '@yukinu/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@yukinu/ui/card'
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from '@yukinu/ui/table'

import { useTRPC } from '@/lib/trpc'

const STATUS_VARIANT = {
  success: 'success',
  pending: 'warning',
  failed: 'destructive',
} as const

export const RecentTransactions: React.FC<{ isAdmin: boolean }> = ({
  isAdmin,
}) => {
  const { trpc } = useTRPC()
  const { data, isLoading } = useQuery(
    isAdmin
      ? trpc.sales.statistics.dashboard.queryOptions({})
      : trpc.sales.statistics.vendorDashboard.queryOptions({}),
  )

  if (isLoading || !data) return <div>Loading...</div>
  const { recentTransactions: transactions } = data

  return (
    <Card className='mb-4 px-4'>
      <CardHeader className='px-0'>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>
          Latest payment activities across the platform.
        </CardDescription>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reference</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='text-right'>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className='font-mono text-xs'>{tx.id}</TableCell>
              <TableCell>${tx.amount}</TableCell>
              <TableCell>
                <Badge variant={STATUS_VARIANT[tx.status]}>{tx.status}</Badge>
              </TableCell>
              <TableCell className='text-right text-muted-foreground'>
                {formatDate(tx.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
