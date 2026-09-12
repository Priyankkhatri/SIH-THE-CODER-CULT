import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Import route modules
import authRoutes from './modules/auth/auth.routes';
import placesRoutes from './modules/places/places.routes';
import heritageRoutes from './modules/heritage/heritage.routes';
import aiRoutes from './modules/ai/ai.routes';
import visionRoutes from './modules/vision/vision.routes';
import itineraryRoutes from './modules/itinerary/itinerary.routes';
import translateRoutes from './modules/translate/translate.routes';
import favoritesRoutes from './modules/favorites/favorites.routes';
import profileRoutes from './modules/profile/profile.routes';
import offlineRoutes from './modules/offline/offline.routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();

// Global middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '15mb' })); // For base64 camera image uploads
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health check handler
const healthHandler = (_req: express.Request, res: express.Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      api: 'operational',
      database: 'connected (Vadodara Heritage Seed Active)',
      local_ai: 'configured (http://localhost:1234/v1)',
    },
  });
};
app.get('/health', healthHandler);
app.get('/api/v1/health', healthHandler);

// Supported languages handler
const languagesHandler = (_req: express.Request, res: express.Response) => {
  res.json({
    success: true,
    data: [
      { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
      { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
    ],
  });
};
app.get('/languages', languagesHandler);
app.get('/api/v1/languages', languagesHandler);

// Helper function to mount routes with both /api/v1 and root prefixes
const mountRoutes = (prefix: string) => {
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/places`, placesRoutes);
  app.use(`${prefix}/heritage`, heritageRoutes);
  app.use(`${prefix}/ai`, aiRoutes);
  app.use(`${prefix}/vision`, visionRoutes);
  app.use(`${prefix}/itinerary`, itineraryRoutes);
  app.use(`${prefix}/itineraries`, itineraryRoutes); // Alias for plural client calls
  app.use(`${prefix}/translate`, translateRoutes);
  app.use(`${prefix}/favorites`, favoritesRoutes);
  app.use(`${prefix}/profile`, profileRoutes);
  app.use(`${prefix}/offline`, offlineRoutes);
};

// Mount for both standard /api/v1 (Expo client default) and root / (legacy / direct API)
mountRoutes('/api/v1');
mountRoutes('');

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
