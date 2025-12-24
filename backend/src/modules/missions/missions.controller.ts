import { Response } from 'express';
import { MissionsService } from './missions.service';
import { AuthRequest } from '../auth/auth.middleware';

const missionsService = new MissionsService();

export class MissionsController {
  async createMission(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const mission = await missionsService.createMission(req.userId, req.body);
      res.status(201).json(mission);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getMissionById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const mission = await missionsService.getMissionById(id);
      res.status(200).json(mission);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  }

  async getNearbyMissions(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const maxDistance = req.query.maxDistance ? parseFloat(req.query.maxDistance as string) : 10;
      const missions = await missionsService.getNearbyMissions(req.userId, maxDistance);
      res.status(200).json(missions);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async acceptMission(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const { id } = req.params;
      const mission = await missionsService.acceptMission(req.userId, id);
      res.status(200).json(mission);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async updateMissionStatus(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const mission = await missionsService.updateMissionStatus(id, status);
      res.status(200).json(mission);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getMyMissions(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      let missions;
      if (req.userRole === 'CLIENT') {
        missions = await missionsService.getClientMissions(req.userId);
      } else if (req.userRole === 'PROVIDER') {
        missions = await missionsService.getProviderMissions(req.userId);
      } else {
        return res.status(400).json({ error: 'Invalid user role' });
      }

      res.status(200).json(missions);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async sendMessage(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const { id } = req.params;
      const { receiverId, content } = req.body;
      const message = await missionsService.sendMessage(id, req.userId, receiverId, content);
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getMessages(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const messages = await missionsService.getMessages(id);
      res.status(200).json(messages);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}
