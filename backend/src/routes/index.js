import { Router } from 'express';
import authRoutes from './auth.routes.js';
import taskRoutes from './task.routes.js';
import analyticsRoutes from './analytics.routes.js';
import activityRoutes from './activity.routes.js';
import focusRoutes from './focus.routes.js';
import { aiRoutes } from '../ai/index.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/activities', activityRoutes);
router.use('/focus', focusRoutes);
router.use('/ai', aiRoutes);

export default router;
