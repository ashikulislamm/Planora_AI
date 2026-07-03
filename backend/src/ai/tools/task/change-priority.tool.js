import { z } from 'zod';
import BaseTool from '../base.tool.js';
import taskService from '../../../services/task.service.js';

class ChangePriorityTool extends BaseTool {
  constructor() {
    super({
      name: 'change_priority',
      description: 'Change the priority level of an existing task to low, medium, or high.',
      category: 'task',
      parameters: {
        type: 'OBJECT',
        properties: {
          taskId: { type: 'STRING', description: 'The unique 24-character Mongo ID of the task (required)' },
          priority: { type: 'STRING', enum: ['low', 'medium', 'high'], description: 'The new priority level for the task (required)' },
        },
        required: ['taskId', 'priority'],
      },
    });

    this.schema = z.object({
      taskId: z.string({ required_error: 'Task ID is required' }).regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB Task ID'),
      priority: z.enum(['low', 'medium', 'high'], { required_error: 'Priority is required' }),
    });
  }

  async run(input, user, metadata) {
    return await taskService.updateTask(input.taskId, { priority: input.priority }, user._id);
  }
}

export default new ChangePriorityTool();
