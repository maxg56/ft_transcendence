import { FastifyRequest, FastifyReply } from 'fastify';
import { Op } from 'sequelize';
import User from '../models/User';
import Match from '../models/Match';
import MatchPlayer from '../models/MatchPlayer';


// infos on a match : which kind of game (pong or other), score, win or lose,
// duration, date, 2 players or 4
async function matchesHistory (request: FastifyRequest, reply: FastifyReply) {
	try {
		const id = request.user.id
		const matches = await Match.findAll({
			include: [{
				model: User,
				through: {
					attributes: ['score']
				},
				where: {id: id},
				required: true,
			},
			],
			order: [['playedAt', 'DESC']],
		})

		if (matches.length === 0)
			return reply.code(404).send({ message: "no history find"})
		const players = await MatchPlayer.findAll({
			where: { matchId: matches.id }
		})
		const maxScore = Math.max(...players.map(p => p.score));
		const playerWithResult = players.map( p => ({
			playerId: p.playerId,
			score: p.score,
			result: p.score === maxScore ? 'WIN' : 'LOSE',
		}))
		const matchesHistory = matches.map(match => ({
			matchId: match.id,
			isPongGame: match.is_pong_game,
			playedAt: match.playedAt,
			durationSeconds: match.durationSeconds,
			playerWithResult
		}));

		return reply.send(matchesHistory)
	} catch (error) {
		request.log.error(error);
		return reply.code(500).send({ message: 'server error' });
	}
}