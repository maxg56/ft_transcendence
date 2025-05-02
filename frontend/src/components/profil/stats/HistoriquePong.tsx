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
import { HistoryGame, HistoryGame2v2 } from "../type/statsInterface"
import { useApi } from "@/hooks/api/useApi"

const ITEMS_PER_PAGE = 10

export function HistoriquePong() {
	const [page, setPage] = useState(0)
	const [matchHistory, setmatchHistory] = useState<HistoryGame[]>([])
	const start = page * ITEMS_PER_PAGE
	const end = start + ITEMS_PER_PAGE
	const [matchHistory2v2, setmatchHistory2v2] = useState<HistoryGame2v2[]>([])

	const {refetch: fetchHistory2v2} = useApi<HistoryGame2v2>(
		"/stats/history2v2",
		{
			immediate: false,
			onSuccess: (res) => {
				if (!res) {
					console.error("Erreur history2v2game", res)
					return
				}
				const historyGameFormatted: HistoryGame2v2[] = res.data.map((match: any) => ({
					id: match.match_id,
					opponent1: match.opponents[0]?.username,
					opponent2: match.opponents[1]?.username,
					partner: match.partner.username,
					result: match.player.winner ? "Victory" : "Defeat",
					scoreP: match.player.score,
					scoreO: match.opponents[0]?.score,
					time: match.duration_seconds,
					elo_gain: match.player.elo_change
				}))
				setmatchHistory2v2(historyGameFormatted);
				},
			onError: (errMsg) => {
				console.error('Erreur history2v2 game :', errMsg)
			},
		}
	)

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
				await Promise.all([fetchHistory(), fetchHistory2v2()]);
			};
			fetchData();
		}, []
	);

	const currentItems = matchHistory.slice(start, end)
	const currentItems2v2 = matchHistory2v2.slice(start, end)

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
		<div className="flex flex-col gap-6 w-full">
		<Card>
			
		<div className="flex flex-col gap-4 w-full">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="font-medium text-center">Adversaire</TableHead>
						<TableHead className="font-medium text-center">Resultat</TableHead>
						<TableHead className="font-medium text-center">Score</TableHead>
						<TableHead className="font-medium text-center">Temps</TableHead>
						<TableHead className="font-medium text-center">Elo</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody >
					{currentItems.map((match) => (
						<TableRow key={match.id}>
							<TableCell className="font-medium text-center">{match.opponent}</TableCell>
							<TableCell className="font-medium text-center">{match.result}</TableCell>
							<TableCell className="font-medium text-center">{match.scoreP} - {match.scoreO}</TableCell>
							<TableCell className="font-medium text-center">{match.time} s</TableCell>
							<TableCell className="text-center font-medium">{match.elo_gain}</TableCell>
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
	<Card>		
		<div className="flex flex-col gap-4 w-full">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="text-center font-medium">Adversaires</TableHead>
						<TableHead className="text-center font-medium">Coequipier</TableHead>
						<TableHead className="text-center font-medium">Resultat</TableHead>
						<TableHead className="text-center font-medium">Score</TableHead>
						<TableHead className="text-center font-medium">Temps</TableHead>
						<TableHead className="text-center font-medium">Elo</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody >
					{currentItems2v2.map((match) => (
						<TableRow key={match.id}>
							<TableCell className="font-medium text-center ">{match.opponent1} - {match.opponent2}</TableCell>
							<TableCell className="font-medium text-center ">{match.partner}</TableCell>
							<TableCell className="text-center font-medium">{match.result}</TableCell>
							<TableCell className="text-center font-medium"> {match.scoreP} - {match.scoreO}</TableCell>
							<TableCell className="text-center font-medium">{match.time}</TableCell>
							<TableCell className="text-center font-medium">{match.elo_gain}</TableCell>
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
	</div>
	)
}
