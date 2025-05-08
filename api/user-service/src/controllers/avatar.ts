import { FastifyRequest, FastifyReply } from 'fastify';
import User from '../models/User'
import { sendSuccess, sendError } from '../utils/reply';
import { hasId } from '../utils/hasId';

async function putAvatar (request: FastifyRequest, reply: FastifyReply) {
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
	
	const { image } = request.body as { image: string};
	
	if (!/^data:image\/(png|jpeg|jpg);base64,/.test(image)) {
		return sendError(reply, 'Invalid image', 400);
	}
	console.log("image size in bytes:", Buffer.byteLength(image, 'utf8'));
	await User.update(
		{ avatar: image },
		{ where: { id: id}}
	);

	return sendSuccess(reply, 'image upload', 200);
} catch (error) {
		request.log.error(error)
		return sendError(reply, 'server error', 500)
}
}

async function deleteAvatar (request: FastifyRequest, reply: FastifyReply) {
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

	await User.update(
		{ avatar: null },
		{ where: { id: id}}
	);

	return sendSuccess(reply, 'image deleted', 200);
} catch (error) {
	request.log.error(error)
	return sendError(reply, 'server error', 500)
}
}

export { putAvatar, deleteAvatar }