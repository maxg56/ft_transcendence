import { FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin'
import { ratioWinsLosses } from '../controllers/ratioWin';
import Match from '../models/Match';
import MatchPlayer from '../models/MatchPlayer';

// test
async function getTest(req: FastifyRequest, reply: FastifyReply){
	try {
	const { joueur } = req.params as {joueur: number}
	console.log('joueur id:', joueur)
	const test = await MatchPlayer.findAll({ where: { player_id: joueur}})
	if (test.length === 0)
		return reply.code(404).send({ message: 'not find euh'})
	reply.send(test)
	} catch(error) {
		reply.code(500).send({ message: 'Database error', error })
	}
}

// test
async function postTest(request: FastifyRequest, reply: FastifyReply){
	const { id, gameP, temps, joueur, score, elo, winner} = request.body as {
		id: number, gameP: boolean, temps: number, joueur: number, score: number, elo: number, winner: boolean}
	try {
		await Match.create({
		id: id,
		is_pong_game: gameP,
		duration_seconds: temps
	})} catch (error) { reply.send({message: 'error match.create'})}
	try {
		await MatchPlayer.create({
		match_id: id,
		player_id: joueur,
		score: score,
		elo_change: elo,
		winner: winner
	})} catch (error) { reply.send({message: 'error matchplayer.create'})}
	reply.send({ message: 'create ok' })
}


async function statsRoutes(fastify: any) {
	// penser a remettre { preHandler: [fastify.authenticate] } et enlever :id et verifier dans la fucntion ratiowinslosses
	fastify.get('/stats/ratiowin/:id', ratioWinsLosses);
	fastify.post('/stats/addtest', postTest);
	fastify.get('/stats/gettest/:joueur', getTest);
}

export default fp(statsRoutes);