import { z } from 'zod';
import BaseTool from '../base.tool.js';
import focusService from '../../../services/focus.service.js';

class StopFocusTool extends BaseTool {
  constructor() {
    super({
      name: 'stop_focus_session',
      description: 'End the current active focus session, marking it as completed or cancelled.',
      category: 'focus',
      parameters: {
        type: 'OBJECT',
        properties: {
          status: { type: 'STRING', enum: ['completed', 'cancelled'], description: 'The final status of the session' },
        },
      },
    });

    this.schema = z.object({
      status: z.enum(['completed', 'cancelled']).default('completed'),
    });
  }

  async run(input, user, metadata) {
    return await focusService.endSession(user._id, input.status);
  }
}

export default new StopFocusTool();
