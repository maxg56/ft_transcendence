import { FastifyInstance } from 'fastify';
import jwt from '@fastify/jwt';

const fastify:fastifyInstance;

fastify.register(jwt, { secret: 'your-secret-key' });

// Middleware pour vérifier le token
fastify.decorate("authenticate", async (request, reply) => {
    try {
        await request.jwtVerify();
    } catch (err) {
        reply.send(err);
    }
});

// Route pour générer un token
fastify.post('auth/login', async (request, reply) => {
    const { username, password } = request.body;

    // Vérifie les identifiants (exemple basique)
    if (username === "user" && password === "password") {
        const token = fastify.jwt.sign({ username });
        return { token };
    }

    return reply.code(401).send({ error: 'Unauthorized' });
});

// Route protégée par JWT
fastify.get('/protected', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    return { message: "This is a protected route", user: request.user };
});

