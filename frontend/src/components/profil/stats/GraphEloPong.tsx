"use client"

import {CartesianGrid, Line, LineChart } from "recharts"
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

type Points = {
    points: number;
}

export function GraphEloPong() {
  const [chartData, setChartData] = useState<Points[]>([]);

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
			onSuccess: (data) => {
			if (!data ) {
				console.error("Erreur elos list", data)
				return
			}
      const initialElo = {points: 1000};
			const elos = data.map((e) => ({points: e.elo}));
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
    <Card className="rounded-2xl rounded-md text-white font-semibold 
                        bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-200/20 
                        backdrop-blur-md
                        shadow-[0_0_20px_rgba(0,255,255,0.4)] 
                        hover:shadow-[0_0_30px_rgba(0,255,255,0.8)] 
                        border border-cyan-300/30 
                        transition duration-300 ">
      <CardHeader>
        <CardTitle className="items-center pb-0 text-xl">Elo</CardTitle>
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
