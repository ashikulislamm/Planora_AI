import { z } from 'zod';
import BaseTool from '../base.tool.js';
import taskService from '../../../services/task.service.js';

class UpdateDueDateTool extends BaseTool {
  constructor() {
    super({
      name: 'update_due_date',
      description: 'Update the due date and optional due time for a task.',
      category: 'task',
      parameters: {
        type: 'OBJECT',
        properties: {
          taskId: { type: 'STRING', description: 'The unique 24-character Mongo ID of the task (required)' },
          dueDate: { type: 'STRING', format: 'date-time', description: 'The new due date in ISO-8601 format (required)' },
          dueTime: { type: 'STRING', description: 'The new due time (e.g. "17:30")' },
        },
        required: ['taskId', 'dueDate'],
      },
    });

    this.schema = z.object({
      taskId: z.string({ required_error: 'Task ID is required' }).regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB Task ID'),
      dueDate: z.string({ required_error: 'Due date is required' }).datetime().or(z.string().date()),
      dueTime: z.string().optional(),
    });
  }

  async run(input, user, metadata) {
    return await taskService.updateTask(input.taskId, {
      dueDate: input.dueDate,
      dueTime: input.dueTime,
    }, user._id);
  }
}

export default new UpdateDueDateTool();
