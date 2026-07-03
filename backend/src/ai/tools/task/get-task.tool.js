import { z } from 'zod';
import BaseTool from '../base.tool.js';
import taskService from '../../../services/task.service.js';

class GetTaskTool extends BaseTool {
  constructor() {
    super({
      name: 'get_task',
      description: 'Retrieve details of a single task by its unique ID.',
      category: 'task',
      parameters: {
        type: 'OBJECT',
        properties: {
          taskId: { type: 'STRING', description: 'The unique 24-character Mongo ID of the task to retrieve (required)' },
        },
        required: ['taskId'],
      },
    });

    this.schema = z.object({
      taskId: z.string({ required_error: 'Task ID is required' }).regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB Task ID'),
    });
  }

  async run(input, user, metadata) {
    return await taskService.getTaskById(input.taskId, user._id);
  }
}

export default new GetTaskTool();
