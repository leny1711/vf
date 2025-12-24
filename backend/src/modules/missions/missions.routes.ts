import { Router } from 'express';
import { MissionsController } from './missions.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();
const missionsController = new MissionsController();

router.post('/', authMiddleware, (req, res) => missionsController.createMission(req, res));
router.get('/nearby', authMiddleware, (req, res) => missionsController.getNearbyMissions(req, res));
router.get('/my-missions', authMiddleware, (req, res) => missionsController.getMyMissions(req, res));
router.get('/:id', authMiddleware, (req, res) => missionsController.getMissionById(req, res));
router.post('/:id/accept', authMiddleware, (req, res) => missionsController.acceptMission(req, res));
router.put('/:id/status', authMiddleware, (req, res) => missionsController.updateMissionStatus(req, res));
router.post('/:id/messages', authMiddleware, (req, res) => missionsController.sendMessage(req, res));
router.get('/:id/messages', authMiddleware, (req, res) => missionsController.getMessages(req, res));

export default router;
