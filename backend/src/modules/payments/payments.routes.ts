import { Router } from 'express';
import { PaymentsController } from './payments.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();
const paymentsController = new PaymentsController();

router.post('/create-intent', authMiddleware, (req, res) => paymentsController.createPaymentIntent(req, res));
router.post('/confirm', authMiddleware, (req, res) => paymentsController.confirmPayment(req, res));
router.get('/mission/:missionId', authMiddleware, (req, res) => paymentsController.getPaymentByMission(req, res));
router.get('/earnings', authMiddleware, (req, res) => paymentsController.getProviderEarnings(req, res));

export default router;
