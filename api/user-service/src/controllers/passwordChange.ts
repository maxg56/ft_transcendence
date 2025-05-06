import { FastifyRequest, FastifyReply } from 'fastify';
import User from '../models/User'
import { sendSuccess, sendError } from '../utils/reply';
import { hasId } from '../utils/hasId';
import bcrypt from 'bcryptjs';

async function passwordChange (request: FastifyRequest, reply: FastifyReply) {
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

		const { password } = request.body as { password: string };
		const hashedPassword = await bcrypt.hash(password, 10);
		
		await User.update(
			{ password: hashedPassword },
			{ where: {id: id} }
		);

		return sendSuccess(reply, 'password changed', 200);
	} catch (error) {
		request.log.error(error);
		return sendError(reply, 'servor error', 500);
	}
}

async function getPassword (request: FastifyRequest, reply: FastifyReply) {
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

		const password = await User.findByPk(id, {attributes: ['password']})

		return sendSuccess(reply, password, 200);
	} catch (error) {
		request.log.error(error);
		return sendError(reply, 'servor error', 500);
	}
}

export { passwordChange, getPassword }