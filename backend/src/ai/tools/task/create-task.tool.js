import { z } from 'zod';
import BaseTool from '../base.tool.js';
import taskService from '../../../services/task.service.js';

class CreateTaskTool extends BaseTool {
  constructor() {
    super({
      name: 'create_task',
      description: 'Create a new task with details like title, description, priority, category, and due date.',
      category: 'task',
      parameters: {
        type: 'OBJECT',
        properties: {
          title: { type: 'STRING', description: 'The title of the task (required)' },
          description: { type: 'STRING', description: 'Detailed description of the task' },
          status: { type: 'STRING', enum: ['todo', 'in-progress', 'done'], description: 'Initial status of the task' },
          priority: { type: 'STRING', enum: ['low', 'medium', 'high'], description: 'Priority level of the task' },
          category: { type: 'STRING', description: 'Category grouping (e.g., work, personal, health)' },
          dueDate: { type: 'STRING', format: 'date-time', description: 'Due date in ISO-8601 format' },
          dueTime: { type: 'STRING', description: 'Due time (e.g. "14:00")' },
          isRecurring: { type: 'BOOLEAN', description: 'Whether the task repeats' },
          recurrenceType: { type: 'STRING', enum: ['daily', 'weekly', 'monthly'], description: 'Type of repetition' },
          recurrenceEndDate: { type: 'STRING', format: 'date-time', description: 'End date for recurring occurrences' },
        },
        required: ['title'],
      },
    });

    this.schema = z.object({
      title: z.string({ required_error: 'Task title is required' }).min(1, 'Task title cannot be empty'),
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
    return await taskService.createTask(input, user._id);
  }
}

export default new CreateTaskTool();
