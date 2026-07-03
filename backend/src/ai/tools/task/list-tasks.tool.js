import { z } from 'zod';
import BaseTool from '../base.tool.js';
import taskService from '../../../services/task.service.js';

class ListTasksTool extends BaseTool {
  constructor() {
    super({
      name: 'list_tasks',
      description: 'List user tasks with optional filtering by status, priority, category, overdue status, and sorting options.',
      category: 'task',
      parameters: {
        type: 'OBJECT',
        properties: {
          status: { type: 'STRING', enum: ['todo', 'in-progress', 'done'], description: 'Filter by task status' },
          priority: { type: 'STRING', enum: ['low', 'medium', 'high'], description: 'Filter by task priority' },
          category: { type: 'STRING', description: 'Filter by task category' },
          overdue: { type: 'STRING', enum: ['true', 'false'], description: 'Filter overdue tasks (returns incomplete tasks with past due dates)' },
          sort: { type: 'STRING', enum: ['dueDate', '-dueDate', 'priority', '-priority'], description: 'Sort criteria' },
          page: { type: 'INTEGER', description: 'Page number for offset pagination' },
          limit: { type: 'INTEGER', description: 'Number of results to return per page' },
        },
      },
    });

    this.schema = z.object({
      status: z.enum(['todo', 'in-progress', 'done']).optional(),
      priority: z.enum(['low', 'medium', 'high']).optional(),
      category: z.string().optional(),
      overdue: z.enum(['true', 'false']).optional(),
      sort: z.enum(['dueDate', '-dueDate', 'priority', '-priority']).optional(),
      page: z.coerce.number().int().positive().optional(),
      limit: z.coerce.number().int().positive().optional(),
    });
  }

  async run(input, user, metadata) {
    return await taskService.getAllTasks(user._id, input);
  }
}

export default new ListTasksTool();
