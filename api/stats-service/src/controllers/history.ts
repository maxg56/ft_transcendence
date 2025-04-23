import { FastifyRequest, FastifyReply } from 'fastify';
import { Op } from 'sequelize';
import User from '../models/User';
import Match from '../models/Match';
import MatchPlayer from '../models/MatchPlayer';


// infos match : pong ou shifumi, score, win or lose, gain/perte elo,
// duration, date, 2 players or 4
async function matchesHistory (request: FastifyRequest, reply: FastifyReply) {
	try {
		const id = request.user.id
		const matches = await Match.findAll({
			include: [{
				model: User,
				through: {
					attributes: ['score', 'elo_change', 'winner']
				},
				where: {id: id},
				required: true,
			},
			],
			order: [['playedAt', 'DESC']],
		})

		if (matches.length === 0)
			return reply.code(404).send({ message: "no history find"})
		
		const matchesHistory = matches.map(match => ({
			matchId: match.id,
			isPongGame: match.is_pong_game,
			playedAt: match.playedAt,
			duration_seconds: match.duration_seconds,
			players: match.Users.map(user => ({
				score: user.MatchPlayer.score,
				elo_change: user.MatchPlayer.elo_change,
				result: user.MatchPlayer.winner
			}))
		}));

		return reply.send(matchesHistory)
	} catch (error) {
		request.log.error(error);
		return reply.code(500).send({ message: 'server error' });
	}
}