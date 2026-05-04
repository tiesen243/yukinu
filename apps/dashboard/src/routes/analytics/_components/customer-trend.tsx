import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@yukinu/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@yukinu/ui/chart'
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'

import { useTRPC } from '@/lib/trpc'

export function CustomerTrend() {
  const { trpc } = useTRPC()
  const { data, isLoading } = useQuery(
    trpc.sales.statistics.analytics.queryOptions(),
  )
  if (isLoading || !data) return <div>Loading...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Acquisition</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            newUsers: { label: 'New Users', color: 'var(--color-primary)' },
          }}
        >
          <LineChart data={data.customerTrend} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v) => v.split('-')[2]}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              dataKey='newUsers'
              type='monotone'
              stroke='var(--color-newUsers)'
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
