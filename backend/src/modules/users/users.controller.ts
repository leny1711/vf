import { Response } from 'express';
import { UsersService } from './users.service';
import { AuthRequest } from '../auth/auth.middleware';

const usersService = new UsersService();

export class UsersController {
  async updateLocation(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const { latitude, longitude } = req.body;
      const user = await usersService.updateLocation(req.userId, latitude, longitude);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async toggleAvailability(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const { isAvailable } = req.body;
      const user = await usersService.toggleAvailability(req.userId, isAvailable);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getStats(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      if (req.userRole === 'PROVIDER') {
        const stats = await usersService.getProviderStats(req.userId);
        res.status(200).json(stats);
      } else if (req.userRole === 'CLIENT') {
        const stats = await usersService.getClientStats(req.userId);
        res.status(200).json(stats);
      } else {
        res.status(400).json({ error: 'Invalid user role' });
      }
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}
