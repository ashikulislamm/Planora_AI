import { z } from 'zod';
import BaseTool from '../base.tool.js';
import focusService from '../../../services/focus.service.js';

class StartFocusTool extends BaseTool {
  constructor() {
    super({
      name: 'start_focus_session',
      description: 'Start a new active focus session (pomodoro timer) linked to a specific task.',
      category: 'focus',
      parameters: {
        type: 'OBJECT',
        properties: {
          taskId: { type: 'STRING', description: 'The unique 24-character Mongo ID of the task to focus on (required)' },
          duration: { type: 'INTEGER', description: 'Session duration in minutes (required)' },
          subtaskId: { type: 'STRING', description: 'The unique Mongo ID of the subtask (optional)' },
        },
        required: ['taskId', 'duration'],
      },
    });

    this.schema = z.object({
      taskId: z.string({ required_error: 'Task ID is required' }).regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB Task ID'),
      duration: z.coerce.number().int().positive('Duration must be positive').max(240, 'Duration cannot exceed 4 hours'),
      subtaskId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB Subtask ID').optional().nullable(),
    });
  }

  async run(input, user, metadata) {
    return await focusService.startSession(user._id, input.taskId, input.duration, input.subtaskId);
  }
}

export default new StartFocusTool();
