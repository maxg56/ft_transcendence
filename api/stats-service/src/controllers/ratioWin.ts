import { FastifyRequest, FastifyReply } from 'fastify';
import { sendError, sendSuccess } from '../utils/reply';
import { Op } from 'sequelize';
import User from '../models/User';
import Match from '../models/Match';
import MatchPlayer from '../models/MatchPlayer';

async function ratioWinsLosses(request: FastifyRequest, reply: FastifyReply) {
	try {
		const id = request.user.id
		// const { id} = request.params as {id: number}
		console.log("🧩 user ID:", id)
		const player = await User.findByPk(id, { attributes: ['username']})
		const nbWin = await MatchPlayer.count({
			where: {
				player_id: id,
				winner: true
			},
		})
		const nbLose = await MatchPlayer.count({
			where: {
				player_id: id,
				winner: false
			}
		})
		const nbMatch = await MatchPlayer.count({ where: {player_id: id}})
		if (!nbWin || !nbLose || !nbMatch || !player)
			return sendError(reply, 'match not find', 404)
		return sendSuccess(reply, {
			// player: player.username,
			// matchNumber: nbMatch,
			winNumber: nbWin,
			loseNumber: nbLose
		}, 200)
	} catch (error) {
		request.log.error(error);
		return sendError(reply, 'servor error', 500)
	}
}

export { ratioWinsLosses }