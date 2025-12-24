import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import missionsRoutes from './modules/missions/missions.routes';
import paymentsRoutes from './modules/payments/payments.routes';
import ratingsRoutes from './modules/ratings/ratings.routes';
import adminRoutes from './modules/admin/admin.routes';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/missions', missionsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/ratings', ratingsRoutes);
app.use('/api/admin', adminRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;
