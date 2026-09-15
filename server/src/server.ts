import http from 'http';
import app from './app';
import { config } from './config';
import prisma from './config/database';
import { attachDevWebSocket } from './modules/devtools/wsBroadcast';

const PORT = config.port;

async function main() {
  try {
    await prisma.$connect();
    console.log('✅ Database engine initialized');

    const server = http.createServer(app);

    attachDevWebSocket(server, '/ws/devtools');

    server.listen(PORT, () => {
      console.log(`
🏛️  AI Tourist Companion Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 Server:    http://localhost:${PORT}
📡 Health:    http://localhost:${PORT}/health
🔌 Dev WS:    ws://localhost:${PORT}/ws/devtools
🔧 Mode:      ${config.nodeEnv}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
API Endpoints:
  POST /auth/guest
  GET  /places/nearby?lat=X&lng=Y
  GET  /places/:id
  GET  /heritage/:placeId
  POST /ai/ask
  POST /vision/identify
  POST /itinerary/generate
  POST /translate

🧰 Dev Endpoints:
  GET  /devtools/services      — Service health snapshot
  POST /devtools/ai/playground — Force-tier LLM playground
  GET  /devtools/vision/catalog— Vision catalog with labels
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

main();
