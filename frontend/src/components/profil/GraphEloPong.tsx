"use client"

import { Area, AreaChart, CartesianGrid } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { match: "Match 1", points: 10 },
  { match: "Match 2", points: 35 },
  { match: "Match 3", points: 67 },
  { match: "Match 4", points: 73 },
  { match: "Match 5", points: 29 },
  { match: "Match 6", points: 214 },
]

const chartConfig = {
  points: {
    label: "Points",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function GraphEloPong() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Elos gagnes</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            // accessibilityLayer
            data={chartData}
            // margin={{
            //   left: 1,
            //   right: 1,
            // }}
          >
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="points"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
