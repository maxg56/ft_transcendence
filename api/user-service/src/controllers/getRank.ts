import { FastifyRequest, FastifyReply } from 'fastify';
import User from '../models/User'
import MatchPlayer from '../models/MatchPlayer';
import { sendSuccess, sendError } from '../utils/reply';
import { hasId } from '../utils/hasId';

export const getElo = async (request: FastifyRequest, reply: FastifyReply) => {
try {
	const value: string | object | Buffer = request.user;
	let id: number | null = null;
	if (hasId(value)) {
	  const rawId = value.id;
	  id = typeof rawId === 'string' ? parseInt(rawId, 10) : rawId;
	}
	if (typeof id !== 'number' || isNaN(id)) {
	  return sendError(reply, 'Invalid user ID', 400);
	}
	const elo_gain = await MatchPlayer.findAll({
		where: { player_id: id },
		attributes: ['elo_change'],
		order:  [['match_id', 'ASC']],
	})
	let elo_now = 1000;
	const elos = elo_gain.map(match => {
		elo_now += match.elo_change;
		return { elo: elo_now }
	})
	return sendSuccess(reply, elos[elos.length - 1], 200)
} catch (error) {
	request.log.error(error);
	return sendError(reply, 'server error', 500);
}
}