import { FastifyRequest, FastifyReply } from 'fastify';
import { Op, Sequelize } from 'sequelize';
import User from '../models/User';
import Match from '../models/Match';
import MatchPlayer from '../models/MatchPlayer';
import { sendSuccess, sendError } from '../utils/reply';
import { hasId } from '../utils/hasId';
import { MatchPlayerWithUser } from '../models/MatchPlayerWithUser';
  

async function matchesHistory2v2 (request: FastifyRequest, reply: FastifyReply) {
	try {
		const value: string | object | Buffer = request.user;
		let id: string = '';
		if (hasId(value)) {
			id = value.id;
		}
		const valid2v2MatchIdsResult = await MatchPlayer.findAll({
			attributes: ['match_id'],
			group: ['match_id'],
			having: Sequelize.literal('COUNT(*) = 4'),
			raw: true
		})
		const valid2v2MatchIds = valid2v2MatchIdsResult.map(m => m.match_id)

		const matchesPlayer = await MatchPlayer.findAll({
			where: { player_id: id, match_id: valid2v2MatchIds },
			order: [['match_id', 'DESC']]
		})
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
		
		const matchesHistory = matches.map(match => {
			const matchId = match.id
			const playerData = player.find(p => p.match_id === matchId)
			const opponentsData = opponents
				.filter(o => o.match_id === matchId)
				.map(o => {
					const op = o as MatchPlayerWithUser;
					return {
					username: op.player.username.replace(/^deleted user \d+$/, 'deleted user'),
					score: op.score
				}});
			const partner = opponentsData.find(o => o.score === playerData?.score )
			const adversaries = opponentsData.filter(o => o.username !== partner?.username)
			return {
				match_id: match.id,
				is_pong_game: match.is_pong_game,
				playedAt: match.playedAt,
				duration_seconds: match.duration_seconds,
				player: playerData,
				partner: partner,
				opponents: adversaries
			}
		})

		return sendSuccess(reply, matchesHistory, 200)
	} catch (error) {
		request.log.error(error);
		return sendError(reply, 'servor error', 500)
	}
}

async function matchesHistory1v1 (request: FastifyRequest, reply: FastifyReply) {
	try {
		const value: string | object | Buffer = request.user;
    	let id: string = '';
    	if (hasId(value)) {
      		id = value.id;
   	 	}
		const valid1v1MatchIdsResult = await MatchPlayer.findAll({
			attributes: ['match_id'],
			group: ['match_id'],
			having: Sequelize.literal('COUNT(*) = 2'),
			raw: true
		})
		const valid1v1MatchIds = valid1v1MatchIdsResult.map(m => m.match_id)

		const matchesPlayer = await MatchPlayer.findAll({
			where: { player_id: id, match_id: valid1v1MatchIds },
			order: [['match_id', 'DESC']]
		})

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

		const opponentformatted = opponents
			.map(o => {
			const op = o as MatchPlayerWithUser;
			return {
			match_id: op.match_id,
			username: op.player.username.replace(/^deleted user \d+$/, 'deleted user'),
			score: o.score}
		})
		
		const matchesHistory = matches.map(match => {
			const matchId = match.id
			const playerData = player.find(p => p.match_id === matchId)
			const opponentsData = opponentformatted
				.find(p => p.match_id === matchId)
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

export { matchesHistory2v2, matchesHistory1v1 }