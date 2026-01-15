import type { ChartConfig } from '@yukinu/ui/chart'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@yukinu/ui/card'
import {
  AreaChart,
  ChartContainer,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  ChartTooltip,
  ChartTooltipContent,
  Legend,
  Area,
  Line,
} from '@yukinu/ui/chart'

export const RevenueChart: React.FC<{
  config: ChartConfig
  data: Array<{ month: string; revenue: number; target: number }>
}> = ({ config, data }) => (
  <Card className='border-border bg-card lg:col-span-2'>
    <CardHeader>
      <CardTitle className='text-foreground'>Revenue Trend</CardTitle>
      <CardDescription>Monthly revenue vs target</CardDescription>
    </CardHeader>
    <CardContent>
      <ChartContainer config={config} className='h-72 w-full'>
        <ResponsiveContainer width='100%' height='100%'>
          <AreaChart data={data}>
            <defs>
              <linearGradient id='colorRevenue' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--color-chart-3)'
                  stopOpacity={0.3}
                />
                <stop
                  offset='95%'
                  stopColor='var(--color-chart-2)'
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray='3 3' stroke='var(--color-border)' />
            <XAxis dataKey='month' stroke='var(--color-muted-foreground)' />
            <YAxis stroke='var(--color-muted-foreground)' />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Area
              type='monotone'
              dataKey='revenue'
              stroke={config.revenue?.color}
              fillOpacity={1}
              fill='url(#colorRevenue)'
            />
            <Line
              type='monotone'
              dataKey='target'
              stroke={config.target?.color}
              strokeDasharray='5 5'
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </CardContent>
  </Card>
)
