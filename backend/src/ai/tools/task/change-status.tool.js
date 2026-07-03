import { z } from 'zod';
import BaseTool from '../base.tool.js';
import taskService from '../../../services/task.service.js';

class ChangeStatusTool extends BaseTool {
  constructor() {
    super({
      name: 'change_status',
      description: 'Change the status of an existing task to todo, in-progress, or done.',
      category: 'task',
      parameters: {
        type: 'OBJECT',
        properties: {
          taskId: { type: 'STRING', description: 'The unique 24-character Mongo ID of the task (required)' },
          status: { type: 'STRING', enum: ['todo', 'in-progress', 'done'], description: 'The new status for the task (required)' },
        },
        required: ['taskId', 'status'],
      },
    });

    this.schema = z.object({
      taskId: z.string({ required_error: 'Task ID is required' }).regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB Task ID'),
      status: z.enum(['todo', 'in-progress', 'done'], { required_error: 'Status is required' }),
    });
  }

  async run(input, user, metadata) {
    return await taskService.updateTask(input.taskId, { status: input.status }, user._id);
  }
}

export default new ChangeStatusTool();
