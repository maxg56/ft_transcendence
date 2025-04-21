import { FastifyRequest, FastifyReply } from 'fastify';
import { sendSuccess, sendError } from '../utils/reply';
import { Op } from 'sequelize';
import Friendship from '../models/Friendship';
import User from '../models/User';


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
		const id = request.user.id
		await deleteFriends(id)
		const user = await User.findByPk(id)
		if (!user)
			return sendError(reply, "user not find", 404)
		const newName = await usernameAnonymise()
		await User.update(
			{username: newName,
			email: newName},
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