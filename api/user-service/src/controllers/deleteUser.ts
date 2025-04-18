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

async function deleteFriends (id: any, reply: FastifyReply) {
	const friends = await Friendship.findAll({
		where: {
			[Op.or]: [
				{ user1: id },
				{ user2: id }],
		}})
	if (friends.length === 0)
		sendError(reply, "no friends", 404)
	await Friendship.destroy({
		where: {
			[Op.or]: [
				{ user1: id },
				{ user2: id }],
		}
	})
}

async function deleteUser(request: FastifyRequest, reply: FastifyReply) {
	try {
		const id = request.user.id
		deleteFriends(id, reply)
		const user = await User.findByPk(id)
		if (!user)
			sendError(reply, "user not find", 404)
		await User.update({
			username: "deleted user",
			email: "deleteduser@mail.com"},
			{ where: {
				id: id
			}
		})
	} catch (error) {
		request.log.error(error);
		sendError(reply, "server error", 500);
	}
}

export { deleteUser }