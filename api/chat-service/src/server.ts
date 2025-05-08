// src/server.ts
import Fastify from 'fastify';
import WebSocket from 'ws';
import { createServer } from 'http';
import { handleWSConnection } from './ws/websocketHandler';
import dotenv from 'dotenv';
import database from './plugins/database';
import { logformat, logError } from "./utils/log";
import { verifyToken } from './controllers/JWT';
import User from "./models/User";
import authRoutes from './routes/index';
import auth from './plugins/auth';
dotenv.config();

const fastify = Fastify({ logger: true });
const server = createServer(fastify.server);
const wss = new WebSocket.Server({ server });
const PORT = process.env.PORT_CHAT || 3000;
// fastify.register(fastifyFormBody); // Pour les requêtes x-www-form-urlencoded
fastify.register(database);
fastify.register(auth);

// Routes
fastify.register(authRoutes);

fastify.ready().then(() => {
    logformat("\n\n📌 Fastify is ready, initializing models...\n",
      "✅ User model loaded:", !!User, "\n",
    )
  });

wss.on('connection', (ws: WebSocket, req) => {
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const token = url.searchParams.get('token');
  if (!token) {
    logError("Missing token");
    ws.send(JSON.stringify({ type: 'error', error: 'Missing token' }));
    ws.close();
    return;
  }
  handleWSConnection(ws, token);
});

server.listen(Number(PORT), () => {
    console.log(`Server (Fastify + WebSocket) running on http://localhost:${PORT}`);
});
