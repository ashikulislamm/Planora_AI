import { z } from 'zod';
import BaseTool from '../base.tool.js';
import taskService from '../../../services/task.service.js';

class DeleteTaskTool extends BaseTool {
  constructor() {
    super({
      name: 'delete_task',
      description: 'Delete a task permanently from the system by its unique ID.',
      category: 'task',
      parameters: {
        type: 'OBJECT',
        properties: {
          taskId: { type: 'STRING', description: 'The unique 24-character Mongo ID of the task to delete (required)' },
        },
        required: ['taskId'],
      },
    });

    this.schema = z.object({
      taskId: z.string({ required_error: 'Task ID is required' }).regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB Task ID'),
    });
  }

  async run(input, user, metadata) {
    return await taskService.deleteTask(input.taskId, user._id);
  }
}

export default new DeleteTaskTool();
