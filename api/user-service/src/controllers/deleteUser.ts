import { FastifyRequest, FastifyReply } from 'fastify';
import { sendSuccess, sendError } from '../utils/reply';
import { Op } from 'sequelize';
import Friendship from '../models/Friendship';
import User from '../models/User';
import { hasId } from '../utils/hasId';


// -Anonymiser les données personnelles tout en gardant les informations
// nécessaires au fonctionnement du système (ex : historique, logs, identifiants
// non sensibles).
// -Préserver l'intégrité référentielle de la base de données (ex : ne pas
// supprimer les parties jouées ou les scores liés).
// -Garantir que les utilisateurs anonymisés ne peuvent plus se connecter.
// -Email → chaîne de type deleted_user_{id}@example.com
// -username → remplacés par Utilisateur supprimé ou valeur similaire
// -supprimer les amities

async function deleteFriends (id: any) {
	const friends = await Friendship.findAll({
		where: {
			[Op.or]: [
				{ user1: id },
				{ user2: id }],
		}})
	if (friends.length === 0)
		return ({message: "no friends"})
	await Friendship.destroy({
		where: {
			[Op.or]: [
				{ user1: id },
				{ user2: id }],
		}
	})
}

async function usernameAnonymise() {
	let name: string
	let isNametaken: any[]
	do {
		const randomNbr = Math.floor(Math.random() * 1000)
		name = `deleted user ${randomNbr}`
		isNametaken = await User.findAll({ where: { username: name}})
	} while (isNametaken.length !== 0)
	return name;
}


async function deleteUser(request: FastifyRequest, reply: FastifyReply) {
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
		await deleteFriends(id)
		const user = await User.findByPk(id)
		if (!user)
			return sendError(reply, "user not find", 404)
		const newName = await usernameAnonymise()
		await User.update({
			username: newName,
			avatar: null},
			{ where: {
				id: id
			}},
		)
		return sendSuccess(reply, "successfully deleted", 200)
	} catch (error) {
		request.log.error(error)
		return sendError(reply, "server error", 500)
	}
}

export { deleteUser, deleteFriends, usernameAnonymise }