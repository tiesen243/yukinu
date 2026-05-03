import type { ChartConfig } from '@yukinu/ui/chart'

import { useQuery } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@yukinu/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@yukinu/ui/chart'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import { useTRPC } from '@/lib/trpc'

const chartConfig = {
  amount: {
    label: 'Revenue',
    color: 'var(--color-chart-2)',
  },
} satisfies ChartConfig

export const RevenueChart: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => {
  const { trpc } = useTRPC()
  const { data, isLoading } = useQuery(
    isAdmin
      ? trpc.sales.statistics.dashboard.queryOptions({})
      : trpc.sales.statistics.vendorDashboard.queryOptions({}),
  )

  if (isLoading || !data) return <div>Loading...</div>

  return (
    <Card className='lg:col-span-4'>
      <CardHeader>
        <CardTitle>Revenue Stream</CardTitle>
        <CardDescription>
          Showing total revenue for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-62.5 w-full'
        >
          <AreaChart data={data.revenueTrend}>
            <defs>
              <linearGradient id='fillRevenue' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--color-amount)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='var(--color-amount)'
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray='3 3' />
            <XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Area
              dataKey='amount'
              type='natural'
              fill='url(#fillRevenue)'
              stroke='var(--color-amount)'
              stackId='a'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
