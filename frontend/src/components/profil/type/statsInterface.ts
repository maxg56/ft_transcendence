export interface RatioGame {
	category: string,
	count: number,
	fill: string
}

export interface HistoryGame {
	id: number,
	opponent: string,
	result: string,
	scoreP: number,
	scoreO: number,
	time: number,
	elo_gain: number
}

export interface HistoryGame2v2 {
	id: number,
	opponent1: string,
	opponent2: string,
	partner: string,
	result: string,
	scoreP: number,
	scoreO: number,
	time: number,
	elo_gain: number
}