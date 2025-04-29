import { FastifyReply } from "fastify";

function sendSuccess (reply: FastifyReply, data: any, statusCode: 200) {
	return reply.code(statusCode).send({
		status: "success",
		data
	})
}

function sendError (reply: FastifyReply, message: string, statusCode: number) {
	return reply.code(statusCode).send({
		status: "error",
		message,
		code: statusCode
	})
}

export {sendSuccess, sendError}