import { z } from 'zod';
import BaseTool from '../base.tool.js';

class CreateProjectTool extends BaseTool {
  constructor() {
    super({
      name: 'create_project',
      description: 'Create a new project group workspace to categorize and track multiple tasks.',
      category: 'project',
      parameters: {
        type: 'OBJECT',
        properties: {
          name: { type: 'STRING', description: 'The name of the project (required)' },
          description: { type: 'STRING', description: 'Brief overview of the project scope' },
        },
        required: ['name'],
      },
    });

    this.schema = z.object({
      name: z.string({ required_error: 'Project name is required' }).min(1, 'Project name cannot be empty'),
      description: z.string().optional(),
    });
  }

  async run(input, user, metadata) {
    return {
      message: 'Create project feature is not implemented in this phase.',
      name: input.name,
      created: false,
    };
  }
}

export default new CreateProjectTool();
