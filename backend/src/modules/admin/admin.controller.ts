import { Response } from 'express';
import { AdminService } from './admin.service';
import { AuthRequest } from '../auth/auth.middleware';

const adminService = new AdminService();

export class AdminController {
  async getDashboard(req: AuthRequest, res: Response) {
    try {
      const dashboard = await adminService.getDashboard();
      res.status(200).json(dashboard);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getAllUsers(req: AuthRequest, res: Response) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const result = await adminService.getAllUsers(page, limit);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getAllMissions(req: AuthRequest, res: Response) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const result = await adminService.getAllMissions(page, limit);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getAllPayments(req: AuthRequest, res: Response) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const result = await adminService.getAllPayments(page, limit);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async blockUser(req: AuthRequest, res: Response) {
    try {
      const { userId } = req.params;
      const { isBlocked } = req.body;
      const user = await adminService.blockUser(userId, isBlocked);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async deleteUser(req: AuthRequest, res: Response) {
    try {
      const { userId } = req.params;
      const result = await adminService.deleteUser(userId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}
