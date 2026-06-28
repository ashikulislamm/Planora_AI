import { Router } from 'express';
import { testAi, checkAiHealth } from '../controllers/ai.controller.js';
import validate from '../../middlewares/validate.middleware.js';
import { testAiSchema } from '../validators/ai.validation.js';

const router = Router();

// Test Gemini connectivity
router.post('/test', validate(testAiSchema), testAi);

// Check AI service health
router.get('/health', checkAiHealth);

export default router;
