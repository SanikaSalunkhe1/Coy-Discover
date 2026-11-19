import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import feedRoutes from './routes/feed.routes.js';
import swipeRoutes from './routes/swipe.routes.js';
import matchRoutes from './routes/match.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp(): Express {
  const app = express();

  // Basic security headers
  app.use(helmet());

  // CORS restricted to client origin
  const allowedOrigins = [
    process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, tests)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
      },
      credentials: true,
    })
  );

  // Body parser with safe payload size limit
  app.use(express.json({ limit: '10kb' }));

  // Rate limiting: 200 requests per 15 minutes per IP
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: 'Too many requests, please try again later.',
    },
  });
  app.use(limiter);

  // Health check route
  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'Coy Discover API',
      timestamp: new Date().toISOString(),
    });
  });

  // Mount API endpoints: support both root and /api prefixed routes
  app.use('/feed', feedRoutes);
  app.use('/api/feed', feedRoutes);

  app.use('/swipe', swipeRoutes);
  app.use('/api/swipe', swipeRoutes);

  app.use('/matches', matchRoutes);
  app.use('/api/matches', matchRoutes);

  // 404 handler for undefined routes
  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      error: 'Endpoint not found',
    });
  });

  // Centralized error handler
  app.use(errorHandler);

  return app;
}

