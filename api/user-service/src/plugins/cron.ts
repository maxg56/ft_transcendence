import cron from 'node-cron'
import { FastifyPluginAsync } from 'fastify'
import { deleteInactiveUsers } from '../utils/deleteInactiveUsers'

const cronPlugin: FastifyPluginAsync = async (fastify) => {
	cron.schedule('0 0 * * *', async () => {
		console.log('🕒 Tâche CRON : nettoyage des utilisateurs inactifs...')
		await deleteInactiveUsers();
	})
}

export { cronPlugin }