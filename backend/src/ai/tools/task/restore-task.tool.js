import { z } from 'zod';
import BaseTool from '../base.tool.js';

class RestoreTaskTool extends BaseTool {
  constructor() {
    super({
      name: 'restore_task',
      description: 'Restore a previously archived task back to the active list.',
      category: 'task',
      parameters: {
        type: 'OBJECT',
        properties: {
          taskId: { type: 'STRING', description: 'The unique 24-character Mongo ID of the task to restore (required)' },
        },
        required: ['taskId'],
      },
    });

    this.schema = z.object({
      taskId: z.string({ required_error: 'Task ID is required' }).regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB Task ID'),
    });
  }

  async run(input, user, metadata) {
    return {
      message: 'Restore task feature is not implemented in this phase.',
      taskId: input.taskId,
      restored: false,
    };
  }
}

export default new RestoreTaskTool();
