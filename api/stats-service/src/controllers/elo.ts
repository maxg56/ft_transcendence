import { FastifyRequest, FastifyReply } from 'fastify';
import { sendError, sendSuccess } from '../utils/reply';
import { Op } from 'sequelize';
import User from '../models/User';
import Match from '../models/Match';
import MatchPlayer from '../models/MatchPlayer';

async function getElos(request: FastifyRequest, reply: FastifyReply) {
	try {
		const id = request.user.id
		const elos = await MatchPlayer.findAll({
			where: { player_id: id },
			attributes: ['elo_change'],
			order:  [['match_id', 'ASC']],
		})
		if (elos.length === 0)
			return sendError(reply, 'elo not find', 404)
		return sendSuccess(reply, elos, 200)
	} catch (error) {
		request.log.error(error);
		return sendError(reply, 'servor error', 500)
	}
}

export { getElos }