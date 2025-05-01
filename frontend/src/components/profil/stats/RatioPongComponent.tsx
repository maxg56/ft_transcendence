"use client"

import React, { useEffect, useState } from "react"
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
import { RatioGame } from "../type/statsInterface"
import { useApi } from "@/hooks/api/useApi"
	
export function RatioPong() {
	const [chartData, setChartData] = useState<RatioGame[]>([])

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

	const {refetch: fetchRatio} = useApi<RatioGame>(
		"/stats/ratiowin",
		{
			immediate: false,
			onSuccess: (res) => {
				if (!res) {
					console.error("Erreur ratiogame", res)
					return
				}
				const ratioGameFormatted: RatioGame[] = [
					{ category: "Victories", count: res.data.winNumber, fill: "#04e0c7"},
					{ category: "Defeats", count: res.data.loseNumber, fill: "#d11111"},
				]
				setChartData(ratioGameFormatted);
    		},
			onError: (errMsg) => {
				console.error('Erreur ratio game :', errMsg)
    		},
    	}
	)

	useEffect(() => {
		const fetchData = async () => {
			await Promise.all([fetchRatio()]);
		};
		fetchData();
	}, []
	);

	const totalMatches = React.useMemo(() => {
		return chartData.reduce((acc, curr) => acc + curr.count, 0) ?? 0;
	}, [chartData])

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
