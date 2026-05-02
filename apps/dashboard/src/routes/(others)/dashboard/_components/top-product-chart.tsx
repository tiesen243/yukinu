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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { useTRPC } from '@/lib/trpc'

const chartConfig = {
  totalSold: {
    label: 'Units Sold',
    color: 'var(--color-chart-3)',
  },
} satisfies ChartConfig

export function TopProductsChart() {
  const { trpc } = useTRPC()
  const { data, isLoading } = useQuery(
    trpc.sales.admin.dashboard.queryOptions(),
  )

  if (isLoading || !data) return <div>Loading...</div>

  return (
    <Card className='lg:col-span-3'>
      <CardHeader>
        <CardTitle>Best Sellers</CardTitle>
        <CardDescription>Top performing products by volume</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='h-75 w-full'>
          <BarChart
            accessibilityLayer
            data={data.topProducts}
            layout='vertical'
            margin={{ left: -20 }}
          >
            <CartesianGrid vertical={false} />
            <YAxis
              dataKey='name'
              type='category'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                value.length > 15 ? `${value.slice(0, 15)}...` : value
              }
            />
            <XAxis type='number' hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey='totalSold' fill='var(--color-totalSold)' radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
