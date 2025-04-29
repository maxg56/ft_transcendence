import { FastifyRequest, FastifyReply } from 'fastify';
import User from '../models/User'
import { sendSuccess, sendError } from '../utils/reply';

async function putAvatar( request: FastifyRequest, reply: FastifyReply) {
try {
	const id = request.user.id

	const 
} catch (error) {
		request.log.error(error)
		return sendError(reply, "server error", 500)
	}
}