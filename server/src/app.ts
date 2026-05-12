import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import businessRoutes from './routes/businessRoutes';
import contentRoutes from './routes/contentRoutes';
import flyerRoutes from './routes/flyerRoutes';
import trendRoutes from './routes/trendRoutes'; // Importing trend routes
import scheduleRoutes from './routes/scheduleRoutes'; // Importing schedule routes
import aiRoutes from './routes/aiRoutes'; // Importing AI routes
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Mount Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/business', businessRoutes);
app.use('/api/v1/content', contentRoutes);
app.use('/api/v1/flyer', flyerRoutes);
app.use('/api/v1/trends', trendRoutes); // Importing trend routes
app.use('/api/v1/schedule', scheduleRoutes); // Importing schedule routes
app.use('/api/v1/ai', aiRoutes); // Importing AI routes

app.use(errorHandler);

export default app;