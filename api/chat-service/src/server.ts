// src/server.ts
import Fastify from 'fastify';
import WebSocket from 'ws';
import { createServer } from 'http';
import { handleWSConnection } from './ws/websocketHandler';
import dotenv from 'dotenv';
import database from './plugins/database';
import { logformat, logError } from "./controllers/log";
import User from "./models/User";
dotenv.config();

const fastify = Fastify({ logger: true });
const server = createServer(fastify.server);
const wss = new WebSocket.Server({ server });
const PORT = process.env.PORT_GAME || 3000;

fastify.register(database);

fastify.ready().then(() => {
    logformat("\n\n📌 Fastify is ready, initializing models...\n",
      "✅ User model loaded:", !!User, "\n",
    )
  });

wss.on('connection', handleWSConnection);

server.listen(Number(PORT), () => {
    console.log(`Server (Fastify + WebSocket) running on http://localhost:${PORT}`);
});

