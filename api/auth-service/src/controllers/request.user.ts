import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import { PrismaClient } from "@prisma/client";

const fastify = Fastify();
const prisma = new PrismaClient();

fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET!,
});

fastify.decorate("authenticate", async function (request: any, reply: any) {
  try {
    await request.jwtVerify();
    const user = await prisma.user.findUnique({
      where: { id: request.user.id },
    });
    if (!user) {
      return reply.status(401).send({ error: "Unauthorized" });
    }
    request.user = user;
  } 
  catch (err) {
    return reply.status(401).send({ error: "Invalid token" });
  }
});
