import { z } from 'zod';
import BaseTool from '../base.tool.js';
import taskService from '../../../services/task.service.js';

class CreateSubtasksTool extends BaseTool {
  constructor() {
    super({
      name: 'create_subtasks',
      description: 'Add one or more subtasks to a parent task in order to break it down.',
      category: 'project',
      parameters: {
        type: 'OBJECT',
        properties: {
          taskId: { type: 'STRING', description: 'The unique 24-character Mongo ID of the parent task (required)' },
          subtasks: {
            type: 'ARRAY',
            description: 'A list of subtasks to create (required)',
            items: {
              type: 'OBJECT',
              properties: {
                title: { type: 'STRING', description: 'The title of the subtask (required)' },
                dueDate: { type: 'STRING', format: 'date-time', description: 'Due date in ISO-8601 format' },
              },
              required: ['title'],
            },
          },
        },
        required: ['taskId', 'subtasks'],
      },
    });

    this.schema = z.object({
      taskId: z.string({ required_error: 'Task ID is required' }).regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB Task ID'),
      subtasks: z.array(
        z.object({
          title: z.string({ required_error: 'Subtask title is required' }).min(1, 'Subtask title cannot be empty'),
          dueDate: z.string().datetime().optional().or(z.string().date().optional()),
        }),
        { required_error: 'Subtasks array is required' }
      ).min(1, 'At least one subtask must be provided'),
    });
  }

  async run(input, user, metadata) {
    const { taskId, subtasks } = input;
    const results = [];
    
    // Add subtasks sequentially using TaskService
    for (const subtask of subtasks) {
      const updatedTask = await taskService.addSubtask(taskId, subtask, user._id);
      const added = updatedTask.subtasks[updatedTask.subtasks.length - 1];
      results.push(added);
    }
    
    return {
      taskId,
      addedSubtasks: results,
    };
  }
}

export default new CreateSubtasksTool();
