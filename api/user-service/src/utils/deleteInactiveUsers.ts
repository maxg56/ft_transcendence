import User from "../models/User";
import { Op } from "sequelize";
import { usernameAnonymise, deleteFriends } from "../controllers/deleteUser";


async function deleteInactiveUsers(){
	const sixMonthsAgo = new Date();
	sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
	const inactiveUsers = await User.findAll({
		where: {
			lastLogin_at: {
				[Op.lt]: sixMonthsAgo,
			}
		}
	})
	if (inactiveUsers.length !== 0) {
		for (const user of inactiveUsers) {
			await deleteFriends(user.id)
			const newName = await usernameAnonymise()
			await User.update(
				{username: newName},
				{ where: {
					id: user.id
				}},
			)
		}
	}
}


export { deleteInactiveUsers }