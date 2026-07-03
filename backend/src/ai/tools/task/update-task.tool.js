import { z } from 'zod';
import BaseTool from '../base.tool.js';
import taskService from '../../../services/task.service.js';

class UpdateTaskTool extends BaseTool {
  constructor() {
    super({
      name: 'update_task',
      description: "Update an existing task's fields such as title, description, priority, category, status, and due date.",
      category: 'task',
      parameters: {
        type: 'OBJECT',
        properties: {
          taskId: { type: 'STRING', description: 'The unique 24-character Mongo ID of the task to update (required)' },
          title: { type: 'STRING', description: 'New title of the task' },
          description: { type: 'STRING', description: 'New description of the task' },
          status: { type: 'STRING', enum: ['todo', 'in-progress', 'done'], description: 'New status' },
          priority: { type: 'STRING', enum: ['low', 'medium', 'high'], description: 'New priority level' },
          category: { type: 'STRING', description: 'New category' },
          dueDate: { type: 'STRING', format: 'date-time', description: 'New due date in ISO format' },
          dueTime: { type: 'STRING', description: 'New due time' },
          isRecurring: { type: 'BOOLEAN', description: 'Update recurrence active status' },
          recurrenceType: { type: 'STRING', enum: ['daily', 'weekly', 'monthly'], description: 'Update recurrence frequency' },
          recurrenceEndDate: { type: 'STRING', format: 'date-time', description: 'Update recurrence end boundary date' },
        },
        required: ['taskId'],
      },
    });

    this.schema = z.object({
      taskId: z.string({ required_error: 'Task ID is required' }).regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB Task ID'),
      title: z.string().optional(),
      description: z.string().optional(),
      status: z.enum(['todo', 'in-progress', 'done']).optional(),
      priority: z.enum(['low', 'medium', 'high']).optional(),
      category: z.string().optional(),
      dueDate: z.string().datetime().optional().or(z.string().date().optional()),
      dueTime: z.string().optional(),
      isRecurring: z.boolean().optional(),
      recurrenceType: z.enum(['daily', 'weekly', 'monthly']).optional(),
      recurrenceEndDate: z.string().datetime().optional().or(z.string().date().optional()),
    });
  }

  async run(input, user, metadata) {
    const { taskId, ...updateData } = input;
    return await taskService.updateTask(taskId, updateData, user._id);
  }
}

export default new UpdateTaskTool();
