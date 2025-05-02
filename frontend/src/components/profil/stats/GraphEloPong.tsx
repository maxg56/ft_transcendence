"use client"

import { Area, AreaChart, CartesianGrid, Line, LineChart } from "recharts"
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
import { useEffect, useState } from "react";
import { Elos } from "../type/profilInterface";
import { useApi } from "@/hooks/api/useApi";

export function GraphEloPong() {
  const [chartData, setChartData] = useState<Elos[]>([]);

  const chartConfig = {
    points: {
      label: "elo",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig
  
  const {refetch: fetchElosList} = useApi<Elos[]>(
		"/stats/elo",
		{
			immediate: false,
			onSuccess: (res) => {
			if (!res ) {
				console.error("Erreur elos list", res)
				return
			}
      const initialElo = {points: 1000};
			const elos = res.data.map((e) => ({points: e.elo}));
      setChartData([initialElo, ...elos]);
    },
    onError: (errMsg) => {
      console.error('Erreur eloslist :', errMsg)
    },
    }
  )

  useEffect(() => {
		const fetchData = async () => {
			await Promise.all([fetchElosList()]);
		};
		fetchData();
	}, []
	);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="items-center pb-0 text-xl">Elos</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
          >
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="points"
              type="natural"
              fill="var(--color-points)"
              fillOpacity={0.4}
              stroke="var(--color-points)"
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
