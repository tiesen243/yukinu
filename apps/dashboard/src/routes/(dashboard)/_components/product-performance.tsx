import type { ChartConfig } from '@yukinu/ui/chart'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@yukinu/ui/card'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from '@yukinu/ui/chart'

export const ProductPerformance: React.FC<{
  config: ChartConfig
  data: Array<{ product: string; sales: number; revenue: number }>
}> = ({ config, data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Top Products</CardTitle>
      <CardDescription>Product sales and revenue performance</CardDescription>
    </CardHeader>
    <CardContent>
      <ChartContainer config={config} className='h-72 w-full'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={data} layout='vertical' margin={{ right: 100 }}>
            <CartesianGrid strokeDasharray='3 3' stroke='var(--color-border)' />
            <XAxis type='number' stroke='var(--color-muted-foreground)' />
            <YAxis
              dataKey='product'
              type='category'
              width={140}
              tick={{ fontSize: 12 }}
              stroke='var(--color-muted-foreground)'
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar dataKey='sales' fill={config.sales?.color} />
            <Bar dataKey='revenue' fill={config.revenue?.color} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </CardContent>
  </Card>
)
