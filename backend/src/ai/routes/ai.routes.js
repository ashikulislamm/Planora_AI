import { Router } from 'express';
import { 
  testAi, 
  checkAiHealth, 
  getTaskPreview, 
  createTaskFromPreview,
  getProjectPreview,
  createProjectFromPreview
} from '../controllers/ai.controller.js';
import validate from '../../middlewares/validate.middleware.js';
import protect from '../../middlewares/auth.middleware.js';
import { 
  testAiSchema, 
  copilotTaskPreviewSchema, 
  copilotTaskCreateSchema,
  copilotProjectPreviewSchema,
  copilotProjectCreateSchema
} from '../validators/ai.validation.js';

const router = Router();

// Test Gemini connectivity
router.post('/test', validate(testAiSchema), testAi);

// Check AI service health
router.get('/health', checkAiHealth);

// Copilot AI Task Endpoints (Protected by JWT session auth)
router.post('/copilot/task-preview', protect, validate(copilotTaskPreviewSchema), getTaskPreview);
router.post('/copilot/task-create', protect, validate(copilotTaskCreateSchema), createTaskFromPreview);

// Copilot AI Project Endpoints (Protected by JWT session auth)
router.post('/copilot/project-preview', protect, validate(copilotProjectPreviewSchema), getProjectPreview);
router.post('/copilot/project-create', protect, validate(copilotProjectCreateSchema), createProjectFromPreview);

export default router;
