import app from './app';
import { config } from './config';
import prisma from './config/database';

const PORT = config.port;

async function main() {
  try {
    // Verify database connection
    await prisma.$connect();
    console.log('✅ Database connected');

    app.listen(PORT, () => {
      console.log(`
🏛️  AI Tourist Companion Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 Server:    http://localhost:${PORT}
📡 Health:    http://localhost:${PORT}/health
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
