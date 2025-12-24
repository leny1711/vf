import { Router } from 'express';
import { AdminController } from './admin.controller';
import { authMiddleware, adminMiddleware } from '../auth/auth.middleware';

const router = Router();
const adminController = new AdminController();

router.get('/dashboard', authMiddleware, adminMiddleware, (req, res) => adminController.getDashboard(req, res));
router.get('/users', authMiddleware, adminMiddleware, (req, res) => adminController.getAllUsers(req, res));
router.get('/missions', authMiddleware, adminMiddleware, (req, res) => adminController.getAllMissions(req, res));
router.get('/payments', authMiddleware, adminMiddleware, (req, res) => adminController.getAllPayments(req, res));
router.put('/users/:userId/block', authMiddleware, adminMiddleware, (req, res) => adminController.blockUser(req, res));
router.delete('/users/:userId', authMiddleware, adminMiddleware, (req, res) => adminController.deleteUser(req, res));

export default router;
