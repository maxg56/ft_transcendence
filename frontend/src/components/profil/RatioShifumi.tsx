"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
	{ category: "Victoires", count: 275, fill: "#04e0c7" },
	{ category: "Défaites", count: 200, fill: "#d11111" }
  ]

const chartConfig = {
  count: {
    label: "Matches",
  },
  victory: {
    label: "Victoires",
    color: "hsl(var(--chart-1))",
  },
  defeat: {
    label: "Défaites",
    color: "hsl(var(--chart-2))",
  }
} satisfies ChartConfig

export function RatioShifumi() {
  const totalMatches = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0)
  }, [])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0 text-xl">
        <CardTitle>Ratio</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
              />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="category"
              innerRadius={60}
              strokeWidth={2}
              >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalMatches.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Matches
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
