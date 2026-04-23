import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.js';
import resumeRoutes from './routes/resumes.js';
import aiRoutes from './routes/ai.js';
import { env } from './config/env.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 200
});

app.use(helmet());
app.use(limiter);
app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json());
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/ai', aiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
