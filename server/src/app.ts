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
import healthRoutes from './modules/health/health.routes';
import devtoolsRoutes from './modules/devtools/devtools.routes';

// Import middlewares
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/logger';
import { generalRateLimiter, aiRateLimiter } from './middleware/rateLimiter';
import { devtoolsTracer } from './middleware/devtoolsTracer';

const app = express();

// Security & Body parsing
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '15mb' })); // For base64 camera image uploads
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// High-performance Telemetry & Request Logging with X-Response-Time
app.use(requestLogger);

// Devtools tracing middleware (before routes, after body parsing)
app.use(devtoolsTracer);

// Global Sliding Window Rate Limiting (300 requests/minute per IP)
app.use(generalRateLimiter.middleware());

// Supported languages handler
const languagesHandler = (_req: express.Request, res: Response | any) => {
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

// Mount health and diagnostics module
app.use('/health', healthRoutes);
app.use('/api/v1/health', healthRoutes);

// Mount Dev Console module (no version prefix, short path)
app.use('/devtools', devtoolsRoutes);

// Helper function to mount routes with both /api/v1 and root prefixes
const mountRoutes = (prefix: string) => {
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/places`, placesRoutes);
  app.use(`${prefix}/heritage`, heritageRoutes);
  // Dedicated rate limiting for compute-intensive AI and Vision pipelines
  app.use(`${prefix}/ai`, aiRateLimiter.middleware(), aiRoutes);
  app.use(`${prefix}/vision`, aiRateLimiter.middleware(), visionRoutes);
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
