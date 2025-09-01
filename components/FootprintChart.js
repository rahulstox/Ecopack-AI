// File: components/FootprintChart.js
'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

export function FootprintChart({ data }) {
  // We process the logs into a simpler format that the chart can read
  const chartData = data
    .map((log) => ({
      // Format the date to be short and readable (e.g., "Aug 31")
      date: new Date(log.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      // Ensure the total footprint is a number with 2 decimal places
      totalFootprint: parseFloat(log.carbonFootprint.toFixed(2)),
    }))
    .reverse() // Reverse to show dates in chronological order

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Carbon Footprint Over Time</CardTitle>
        <CardDescription>
          A visual summary of your daily CO₂e logs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* The chart needs a container with a defined height to render properly */}
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray='3 3' vertical={false} />
              <XAxis
                dataKey='date'
                stroke='#888888'
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke='#888888'
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value} kg`}
              />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                itemStyle={{ fontWeight: 'bold' }}
                formatter={(value) => [`${value} kg CO₂e`, 'Total Footprint']}
              />
              <Bar
                dataKey='totalFootprint'
                fill='hsl(var(--primary))'
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
