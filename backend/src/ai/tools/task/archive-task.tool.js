import { z } from 'zod';
import BaseTool from '../base.tool.js';

class ArchiveTaskTool extends BaseTool {
  constructor() {
    super({
      name: 'archive_task',
      description: 'Archive a completed task to clean up the active dashboard view.',
      category: 'task',
      parameters: {
        type: 'OBJECT',
        properties: {
          taskId: { type: 'STRING', description: 'The unique 24-character Mongo ID of the task to archive (required)' },
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
      message: 'Archive task feature is not implemented in this phase.',
      taskId: input.taskId,
      archived: false,
    };
  }
}

export default new ArchiveTaskTool();
