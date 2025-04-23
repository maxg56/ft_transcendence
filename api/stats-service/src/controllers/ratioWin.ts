import { FastifyRequest, FastifyReply } from 'fastify';
import { sendError, sendSuccess } from '../utils/reply';
import { Op } from 'sequelize';
import User from '../models/User';
import Match from '../models/Match';
import MatchPlayer from '../models/MatchPlayer';

async function ratioWinsLosses(request: FastifyRequest, reply: FastifyReply) {
	try {
		// const id = request.user.id
		const { id} = request.params as {id: number}
		console.log("🧩 user ID:", id)
		const nbWin = await MatchPlayer.count({
			where: {
				player_id: id,
				winner: true
			}
		})
		const nbMatch = await MatchPlayer.count({ where: {player_id: id}})
		if (!nbWin || !nbMatch)
			return sendError(reply, 'match not find', 404)
		return sendSuccess(reply, {
			playerId: id,
			matchNumber: nbMatch,
			winNumber: nbWin
		}, 200)
	} catch (error) {
		request.log.error(error);
		return sendError(reply, 'servor error', 500)
	}
}

export { ratioWinsLosses }