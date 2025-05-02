import { FastifyRequest, FastifyReply } from 'fastify';
import { sendError, sendSuccess } from '../utils/reply';
import User from '../models/User';
import MatchPlayer from '../models/MatchPlayer';

async function getElos(request: FastifyRequest, reply: FastifyReply) {
	try {
		const id = request.user.id
		const elo_gain = await MatchPlayer.findAll({
			where: { player_id: id },
			attributes: ['elo_change'],
			order:  [['match_id', 'ASC']],
		})
		if (elo_gain.length === 0)
			return sendError(reply, 'elo not find', 404)
		let elo_now = 1000;
		const elos = elo_gain.map(match => {
			elo_now += match.elo_change;
			return { elo: elo_now }
		})
		return sendSuccess(reply, elos, 200)
	} catch (error) {
		request.log.error(error);
		return sendError(reply, 'servor error', 500)
	}
}

export { getElos }