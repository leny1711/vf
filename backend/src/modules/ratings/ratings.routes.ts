import { Router } from 'express';
import { RatingsController } from './ratings.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();
const ratingsController = new RatingsController();

router.post('/', authMiddleware, (req, res) => ratingsController.createRating(req, res));
router.get('/provider/:providerId', authMiddleware, (req, res) => ratingsController.getProviderRatings(req, res));
router.get('/mission/:missionId', authMiddleware, (req, res) => ratingsController.getRatingByMission(req, res));

export default router;
