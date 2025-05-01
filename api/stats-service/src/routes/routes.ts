import { FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin'
import { ratioWinsLosses } from '../controllers/ratioWin';
import { getElos } from '../controllers/elo';
import { matchesHistory } from '../controllers/history';
import User from '../models/User';
import Match from '../models/Match';
import MatchPlayer from '../models/MatchPlayer';

// test
async function getTest(req: FastifyRequest, reply: FastifyReply){
	try {
	// const idJoueur = req.user.id
	// const { joueur } = req.params as {joueur: number}
	// console.log('joueur id:', idJoueur)
	const test = await MatchPlayer.findAll({ 
		// where: { player_id: idJoueur},
		include: [{
			model: User,
			as: 'player',
			attributes: ['username']
		}]
	})
	if (test.length === 0)
		return reply.code(404).send({ message: 'pas de match'})
	const matchids = [...new Set(test.map(te => te.match_id))]
	console.log("id match:", matchids)
	const test2 = await Match.findAll({
		where: {id: matchids}
	})
	const testReturn = test.map(testtest => {
		return {
			match_id: testtest.match_id,
			player: testtest.player?.username ?? 'inconnu',
			score: testtest.score,
			elo_change: testtest.elo_change,
			winner: testtest.winner
		}
	})
	reply.send({testReturn, test2})
	} catch(error) {
		reply.code(500).send({ message: 'Database error', error })
	}
}

// test
async function postTest(request: FastifyRequest, reply: FastifyReply){
	const { idmatch, id, gameP, temps, joueur, score, elo, winner} = request.body as {
		idmatch:number, id: number, gameP: boolean, temps: number, joueur: string, score: number, elo: number, winner: boolean}
	try {
		const firstMatch = await Match.findByPk(idmatch)
		if (!firstMatch) {
			console.log('firsmatch:', firstMatch)
			await Match.create({
			id: idmatch,
			is_pong_game: gameP,
			duration_seconds: temps
	})}} catch (error) {  return reply.send({message: 'error match.create'})}
	try {
		const joueurId = await User.findOne({
			where: {username: joueur}
		})
		await MatchPlayer.create({
		match_id: id,
		player_id: joueurId?.id,
		score: score,
		elo_change: elo,
		winner: winner
	})} catch (error) { return reply.send({message: 'error matchplayer.create'})}
	return reply.send({ message: 'create ok' })
}


async function statsRoutes(fastify: any) {
	fastify.post('/stats/addtest', postTest);
	fastify.get('/stats/gettest', getTest);
	// penser a remettre { preHandler: [fastify.authenticate] } et enlever :id et verifier dans la fucntion ratiowinslosses
	fastify.get('/stats/ratiowin', { preHandler: [fastify.authenticate] }, ratioWinsLosses);
	fastify.get('/stats/elo', { preHandler: [fastify.authenticate] }, getElos);
	fastify.get('/stats/history', { preHandler: [fastify.authenticate] }, matchesHistory);
}

export default fp(statsRoutes);