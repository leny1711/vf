import { Router } from 'express';
import { UsersController } from './users.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();
const usersController = new UsersController();

router.put('/location', authMiddleware, (req, res) => usersController.updateLocation(req, res));
router.put('/availability', authMiddleware, (req, res) => usersController.toggleAvailability(req, res));
router.get('/stats', authMiddleware, (req, res) => usersController.getStats(req, res));

export default router;
