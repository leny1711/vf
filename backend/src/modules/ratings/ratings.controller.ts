import { Response } from 'express';
import { RatingsService } from './ratings.service';
import { AuthRequest } from '../auth/auth.middleware';

const ratingsService = new RatingsService();

export class RatingsController {
  async createRating(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const rating = await ratingsService.createRating(req.userId, req.body);
      res.status(201).json(rating);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getProviderRatings(req: AuthRequest, res: Response) {
    try {
      const { providerId } = req.params;
      const result = await ratingsService.getProviderRatings(providerId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getRatingByMission(req: AuthRequest, res: Response) {
    try {
      const { missionId } = req.params;
      const rating = await ratingsService.getRatingByMission(missionId);
      res.status(200).json(rating);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  }
}
