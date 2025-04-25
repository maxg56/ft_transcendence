import  { useState } from "react"
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
const matchHistory = [
	{ id: "MATCH001", adversaire: "Sam", resultat: "Victoire", score: "10 - 7", time:"3:30", elo: "+15" },
	{ id: "MATCH002", adversaire: "Jane", resultat: "Défaite", score: "8 - 10", time:"3:30", elo: "-10" },
	{ id: "MATCH003", adversaire: "Max", resultat: "Victoire", score: "10 - 2", time:"3:30", elo: "+20" },
	{ id: "MATCH004", adversaire: "Leo", resultat: "Victoire", score: "10 - 9", time:"3:30", elo: "+12" },
	{ id: "MATCH005", adversaire: "Tom", resultat: "Défaite", score: "7 - 10", time:"3:30", elo: "-8" },
	{ id: "MATCH006", adversaire: "Anna", resultat: "Victoire", score: "10 - 3", time:"3:20", elo: "+18" },
	{ id: "MATCH007", adversaire: "Lucas", resultat: "Défaite", score: "9 - 10", time:"3:35", elo: "-5" },
	{ id: "MATCH008", adversaire: "Emma", resultat: "Victoire", score: "10 - 4", time:"3:25", elo: "+16" },
	{ id: "MATCH009", adversaire: "Noah", resultat: "Victoire", score: "10 - 8", time:"3:40", elo: "+14" },
	{ id: "MATCH010", adversaire: "Eva", resultat: "Défaite", score: "6 - 10", time:"3:50", elo: "-12" },
	{ id: "MATCH011", adversaire: "Zoe", resultat: "Victoire", score: "10 - 6", time:"3:30", elo: "+10" },
]

const ITEMS_PER_PAGE = 10

export function HistoriqueShifumi() {
	const [page, setPage] = useState(0)
	const start = page * ITEMS_PER_PAGE
	const end = start + ITEMS_PER_PAGE
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
		<Card >
		<div className="flex flex-col gap-4 w-full m-auto">
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
							<TableCell className="font-medium">{match.adversaire}</TableCell>
							<TableCell>{match.resultat}</TableCell>
							<TableCell>{match.score}</TableCell>
							<TableCell>{match.time}</TableCell>
							<TableCell className="text-right">{match.elo}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<div className="flex justify-between">
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
