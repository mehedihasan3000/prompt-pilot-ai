import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { errorHandler } from './middlewares/error.middleware';
import { generalRateLimit } from './middlewares/rateLimit.middleware';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import promptRoutes from './routes/prompt.routes';
import aiRoutes from './routes/ai.routes';
import templateRoutes from './routes/template.routes';
import collectionRoutes from './routes/collection.routes';
import reviewRoutes from './routes/review.routes';
import conversationRoutes from './routes/conversation.routes';
import analyticsRoutes from './routes/analytics.routes';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.BETTER_AUTH_URL, credentials: true }));
app.use(express.json());
app.use(generalRateLimit);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use(errorHandler);

export default app;
