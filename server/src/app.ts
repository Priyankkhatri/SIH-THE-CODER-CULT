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
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();

// Global middleware
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' })); // For base64 image uploads
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/places', placesRoutes);
app.use('/heritage', heritageRoutes);
app.use('/ai', aiRoutes);
app.use('/vision', visionRoutes);
app.use('/itinerary', itineraryRoutes);
app.use('/translate', translateRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
