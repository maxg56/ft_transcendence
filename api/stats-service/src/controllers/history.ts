import { FastifyRequest, FastifyReply } from 'fastify';
import { Op } from 'sequelize';
import User from '../models/User';
import Match from '../models/Match';
import MatchPlayer from '../models/MatchPlayer';
import { sendSuccess, sendError } from '../utils/reply';


async function matchesHistory (request: FastifyRequest, reply: FastifyReply) {
	try {
		const id = request.user.id
		// const { id } = request.params as {id: number}
		const matchesPlayer = await MatchPlayer.findAll({
			where: { player_id: id },
			order: [['match_id', 'DESC']]
		})
		if (matchesPlayer.length === 0) 
			return sendError(reply, "no match find", 404)
		const player = matchesPlayer.map( matchplayer => {
			return {
				match_id: matchplayer.match_id,
				score: matchplayer.score,
				elo_change: matchplayer.elo_change,
				winner: matchplayer.winner
			}
		})

		const matchIds = matchesPlayer.map(matchPlayer => matchPlayer.match_id)

		const opponents = await MatchPlayer.findAll({
			where: { 
				player_id: {[Op.ne]: id},
				match_id: matchIds,
			},
			include: [{
				model: User,
				as: 'player',
				attributes: ['username']
			}],
			order: [['match_id', 'DESC']]
		})
		
		const matches = await Match.findAll({
			where: { id: matchIds },
			order: [['id', 'DESC']],
		})
		if (matches.length === 0) 
			return sendError(reply, "no match find with matchIds", 404)
		
		const matchesHistory = matches.map(match => {
			const matchId = match.id
			const playerData = player.find(p => p.match_id === matchId)
			const opponentsData = opponents
				.filter(o => o.match_id === matchId)
				.map(o => ({
					username: o.player.username.replace(/^deleted user \d+$/, 'deleted user'),
					score: o.score
				}))
			return {
				match_id: match.id,
				is_pong_game: match.is_pong_game,
				playedAt: match.playedAt,
				duration_seconds: match.duration_seconds,
				player: playerData,
				opponents: opponentsData
			}
		})

		return sendSuccess(reply, matchesHistory, 200)
	} catch (error) {
		request.log.error(error);
		return sendError(reply, 'servor error', 500)
	}
}

export { matchesHistory }