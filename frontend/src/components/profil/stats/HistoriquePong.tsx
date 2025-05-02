import  { useState, useEffect, use } from "react"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
	Card,
	// CardContent,
	// CardHeader,
	// CardTitle,
}from "@/components/ui/card"
import { HistoryGame } from "../type/statsInterface"
import { useApi } from "@/hooks/api/useApi"

const ITEMS_PER_PAGE = 10

export function HistoriquePong() {
	const [page, setPage] = useState(0)
	const [matchHistory, setmatchHistory] = useState<HistoryGame[]>([])
	const start = page * ITEMS_PER_PAGE
	const end = start + ITEMS_PER_PAGE
	
	const {refetch: fetchHistory} = useApi<HistoryGame>(
		"/stats/history1v1",
		{
			immediate: false,
			onSuccess: (res) => {
				if (!res) {
					console.error("Erreur historygame", res)
					return
				}
				const historyGameFormatted: HistoryGame[] = res.data.map((match: any) => ({
					id: match.match_id,
					opponent: match.opponents.username,
					result: match.player.winner ? "Victory" : "Defeat",
					scoreP: match.player.score,
					scoreO: match.opponents.score,
					time: match.duration_seconds,
					elo_gain: match.player.elo_change
				}))
				setmatchHistory(historyGameFormatted);
				},
			onError: (errMsg) => {
				console.error('Erreur history game :', errMsg)
			},
			}
		)
		
		useEffect(() => {
			const fetchData = async () => {
				await Promise.all([fetchHistory()]);
			};
			fetchData();
		}, []
	);

	const currentItems = matchHistory.slice(start, end)

	const handleNext = () => {
		if (end < matchHistory.length) {
			setPage((prev) => prev + 1)
		}
	}

	const handlePrev = () => {
		if (page > 0) {
			setPage((prev) => prev - 1)
		}
	}

	return (
		<Card>
			
		<div className="flex flex-col gap-4 w-full">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Adversaire</TableHead>
						<TableHead>Résultat</TableHead>
						<TableHead>Score</TableHead>
						<TableHead>Temps</TableHead>
						<TableHead className="text-right">Élo</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{currentItems.map((match) => (
						<TableRow key={match.id}>
							<TableCell className="font-medium">{match.opponent}</TableCell>
							<TableCell>{match.result}</TableCell>
							<TableCell>{match.scoreP} - {match.scoreO}</TableCell>
							<TableCell>{match.time}</TableCell>
							<TableCell className="text-right">{match.elo_gain}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<div className="flex justify-between m-4">
				<Button
					onClick={handlePrev}
					disabled={page === 0}
					>
					Précédent
				</Button>
				<Button
					onClick={handleNext}
					disabled={end >= matchHistory.length}
					>
					Suivant
				</Button>
			</div>
		</div>
	</Card>
	)
}
