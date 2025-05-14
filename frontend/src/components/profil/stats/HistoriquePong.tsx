import  { useState, useEffect} from "react"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {Card,}from "@/components/ui/card"
import { HistoryGame, HistoryGame2v2 } from "../type/statsInterface"
import { useApi } from "@/hooks/api/useApi"
import { useTranslation } from "@/context/TranslationContext"

const ITEMS_PER_PAGE = 5

export function HistoriquePong() {
	const [page, setPage] = useState(0)
	const [page2v2, setPage2v2] = useState(0)
	const [matchHistory, setmatchHistory] = useState<HistoryGame[]>([])
	const start = page * ITEMS_PER_PAGE
	const end = start + ITEMS_PER_PAGE
	const start2v2 = page2v2 * ITEMS_PER_PAGE
	const end2v2 = start2v2 + ITEMS_PER_PAGE
	const {t} = useTranslation();
	const [matchHistory2v2, setmatchHistory2v2] = useState<HistoryGame2v2[]>([])

	const {refetch: fetchHistory2v2} = useApi<HistoryGame2v2[]>(
		"/stats/history2v2",
		{
			immediate: false,
			onSuccess: (data) => {
				if (!data) {
					console.error("Erreur history2v2game", data)
					return
				}
				const historyGameFormatted: HistoryGame2v2[] = data.map((match: any) => ({
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

	const {refetch: fetchHistory} = useApi<HistoryGame[]>(
		"/stats/history1v1",
		{
			immediate: false,
			onSuccess: (data) => {
				if (!data) {
					console.error("Erreur historygame", data)
					return
				}
				const historyGameFormatted: HistoryGame[] = data.map((match: any) => ({
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
	const currentItems2v2 = matchHistory2v2.slice(start2v2, end2v2)

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

	const handleNext2v2 = () => {
		if (end2v2 < matchHistory2v2.length) {
			setPage2v2((prev) => prev + 1)
		}
	}

	const handlePrev2v2 = () => {
		if (page2v2 > 0) {
			setPage2v2((prev) => prev - 1)
		}
	}

	return (
		<div className="flex flex-col gap-3 w-full">
			<Card className="rounded-2xl rounded-md text-white font-semibold 
                        bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-200/20 
                        backdrop-blur-md
                        shadow-[0_0_20px_rgba(0,255,255,0.4)] 
                        hover:shadow-[0_0_30px_rgba(0,255,255,0.8)] 
                        border border-cyan-300/30 
                        transition duration-300">
				<div className="flex flex-col w-full">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="font-medium text-white text-center">{t("Adversaire")}</TableHead>
								<TableHead className="font-medium text-white text-center">{t("Résultat")}</TableHead>
								<TableHead className="font-medium text-white text-center">{t("Score")}</TableHead>
								<TableHead className="font-medium text-white text-center">{t("Temps")}</TableHead>
								<TableHead className="font-medium text-white text-center">{t("Elo")}</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
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
							{t("Précédent")}

						</Button>
						<Button
							onClick={handleNext}
							disabled={end >= matchHistory.length}
						>
							{t("Suivant")}
						</Button>
					</div>
				</div>
			</Card>
	
			<Card className=" rounded-2xl rounded-md text-white font-semibold 
                        bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-200/20 
                        backdrop-blur-md
                        shadow-[0_0_20px_rgba(0,255,255,0.4)] 
                        hover:shadow-[0_0_30px_rgba(0,255,255,0.8)] 
                        border border-cyan-300/30 
                        transition duration-300">
				<div className="flex flex-col  w-full">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="text-center text-white font-medium">{t("Adversaires")}</TableHead>
								<TableHead className="text-center text-white font-medium">{t("Coéquipier")}</TableHead>
								<TableHead className="text-center text-white font-medium">{t("Résultat")}</TableHead>
								<TableHead className="text-center text-white font-medium">{t("Score")}</TableHead>
								<TableHead className="text-center text-white font-medium">{t("Temps")}</TableHead>
								<TableHead className="text-center text-white font-medium">{t("Elo")}</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{currentItems2v2.map((match) => (
								<TableRow key={match.id}>
									<TableCell className="font-medium text-center">{match.opponent1} - {match.opponent2}</TableCell>
									<TableCell className="font-medium text-center">{match.partner}</TableCell>
									<TableCell className="text-center font-medium">{match.result}</TableCell>
									<TableCell className="text-center font-medium">{match.scoreP} - {match.scoreO}</TableCell>
									<TableCell className="text-center font-medium">{match.time} s</TableCell>
									<TableCell className="text-center font-medium">{match.elo_gain}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
	
					<div className="flex justify-between m-4">
						<Button
							onClick={handlePrev2v2}
							disabled={page2v2 === 0}
						>
							{t("Précédent")}
						</Button>
						<Button
							onClick={handleNext2v2}
							disabled={end2v2 >= matchHistory2v2.length}
						>
							{t("Suivant")}
						</Button>
					</div>
				</div>
			</Card>
		</div>
	)
	
}
