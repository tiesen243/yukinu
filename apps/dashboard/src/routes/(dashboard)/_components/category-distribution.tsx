import type { ChartConfig } from '@yukinu/ui/chart'

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
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

export const CategoryDistributionChart: React.FC<{
  config: ChartConfig
  data: { name: string; value: number; fill: string }[]
}> = ({ config, data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Sales by Category</CardTitle>
      <CardDescription>Distribution breakdown</CardDescription>
    </CardHeader>
    <CardContent className='flex justify-center'>
      <ChartContainer config={config} className='h-72'>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={data}
              cx='50%'
              cy='50%'
              labelLine
              label={({ name, percent }) =>
                `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
              }
              outerRadius={80}
              dataKey='value'
            >
              {data.map((entry, index) => (
                // oxlint-disable-next-line react/no-array-index-key
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </CardContent>
  </Card>
)
