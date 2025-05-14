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
import { useTranslation } from "@/context/TranslationContext"
	
type RatioGameAPI = {
	winNumber: number
	loseNumber: number
}

export function RatioPong() {
	const [chartData, setChartData] = useState<RatioGame[]>([])
	const {t} = useTranslation();

	const chartConfig = {
		count: {
			label: "Matchs",
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

	const {refetch: fetchRatio} = useApi<RatioGameAPI>(
		"/stats/ratiowin",
		{
			immediate: false,
			onSuccess: (data) => {
				if (!data) {
					console.error("Erreur ratiogame", data)
					return
				}
				const ratioGameFormatted: RatioGame[] = [
					{ category: t("Victoires"), count: data.winNumber, fill: "#04e0c7" },
					{ category: t("Défaites"), count: data.loseNumber, fill: "#d11111" },
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
		<Card className="flex flex-col  h-[250px] rounded-2xl rounded-md text-white font-semibold 
                        bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-200/20 
                        backdrop-blur-md
                        shadow-[0_0_20px_rgba(0,255,255,0.4)] 
                        hover:shadow-[0_0_30px_rgba(0,255,255,0.8)] 
                        border border-cyan-300/30 
                        transition duration-300">
			<CardHeader className="items-center pb-0 text-xl">
				<CardTitle>{t("Ratio")}</CardTitle>
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square max-h-[230px] "
				>
					<PieChart >
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
													className="fill-white text-3xl font-bold"
												>
													{totalMatches.toLocaleString()}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 24}
													className="fill-white "
												>
													{t("Matchs")}
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
