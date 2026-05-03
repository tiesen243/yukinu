import type { LucideIcon } from '@yukinu/ui/icons'

import { useQuery } from '@tanstack/react-query'
import { Card, CardHeader, CardTitle, CardContent } from '@yukinu/ui/card'
import {
  DollarSignIcon,
  ShoppingBagIcon,
  StoreIcon,
  UsersIcon,
} from '@yukinu/ui/icons'

import { useTRPC } from '@/lib/trpc'

export const Stats: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => {
  const { trpc } = useTRPC()
  const { data, isLoading } = useQuery(
    isAdmin
      ? trpc.sales.statistics.dashboard.queryOptions({})
      : trpc.sales.statistics.vendorDashboard.queryOptions({}),
  )

  if (isLoading || !data) return <div>Loading...</div>

  return (
    <section className='my-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <h3 className='sr-only'>Key Performance Indicators</h3>

      <StatsCard
        label='Total Revenue'
        value={`$${data.metrics.revenue.toLocaleString()}`}
        icon={DollarSignIcon}
        description='+12% from last month'
      />
      <StatsCard
        label='Active Users'
        value={data.metrics.users}
        icon={UsersIcon}
        description='Total registered accounts'
      />
      <StatsCard
        label='Approved Vendors'
        value={data.metrics.vendors}
        icon={StoreIcon}
        description='Live storefronts'
      />
      <StatsCard
        label='Total Sales'
        value={data.metrics.orders}
        icon={ShoppingBagIcon}
        description='Successful checkouts'
      />
    </section>
  )
}

interface StatsCardsProps {
  label: string
  value: string | number
  icon: LucideIcon
  description?: string
}

function StatsCard({ label, value, icon: Icon, description }: StatsCardsProps) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{label}</CardTitle>
        <Icon className='h-4 w-4 text-muted-foreground' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        {description && (
          <p className='mt-1 text-xs text-muted-foreground'>{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
