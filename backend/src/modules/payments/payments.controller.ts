import { Response } from 'express';
import { PaymentsService } from './payments.service';
import { AuthRequest } from '../auth/auth.middleware';

const paymentsService = new PaymentsService();

export class PaymentsController {
  async createPaymentIntent(req: AuthRequest, res: Response) {
    try {
      const { missionId } = req.body;
      const result = await paymentsService.createPaymentIntent(missionId);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async confirmPayment(req: AuthRequest, res: Response) {
    try {
      const { paymentIntentId } = req.body;
      const payment = await paymentsService.confirmPayment(paymentIntentId);
      res.status(200).json(payment);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getPaymentByMission(req: AuthRequest, res: Response) {
    try {
      const { missionId } = req.params;
      const payment = await paymentsService.getPaymentByMission(missionId);
      res.status(200).json(payment);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  }

  async getProviderEarnings(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const earnings = await paymentsService.getProviderEarnings(req.userId);
      res.status(200).json(earnings);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}
