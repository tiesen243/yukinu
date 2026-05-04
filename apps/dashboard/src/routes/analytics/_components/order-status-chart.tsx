import type { ChartConfig } from '@yukinu/ui/chart'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@yukinu/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@yukinu/ui/chart'
import { LabelList, Pie, PieChart } from 'recharts'

import { useTRPC } from '@/lib/trpc'

const chartConfig = {
  count: { label: 'Orders' },
  completed: { label: 'Completed', color: 'var(--color-chart-1)' },
  cancelled: { label: 'Cancelled', color: 'var(--color-chart-2)' },
  pending: { label: 'Pending', color: 'var(--color-chart-3)' },
} satisfies ChartConfig

export const OrderStatusChart: React.FC = () => {
  const { trpc } = useTRPC()
  const { data, isLoading } = useQuery(
    trpc.sales.statistics.analytics.queryOptions(),
  )

  if (isLoading || !data)
    return (
      <Card className='animate-pulse flex-col lg:col-span-2'>
        <CardHeader className='items-center pb-0'>
          <CardTitle>Order Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className='flex-1 pb-0'>
          <div className='mx-auto aspect-square max-h-75 rounded-full bg-muted' />
        </CardContent>
      </Card>
    )

  const formattedData = data.orderStatusDist.map((item, idx) => ({
    ...item,
    fill: `var(--color-chart-${(idx % 5) + 1})`,
  }))

  return (
    <Card className='flex flex-col lg:col-span-2'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Order Status Distribution</CardTitle>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-75'
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={formattedData}
              dataKey='count'
              nameKey='status'
              innerRadius={60}
              strokeWidth={5}
            >
              <LabelList
                dataKey='status'
                className='fill-background'
                stroke='none'
                fontSize={12}
              />
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey='status' />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
