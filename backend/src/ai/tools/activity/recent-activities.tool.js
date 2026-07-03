import { z } from 'zod';
import BaseTool from '../base.tool.js';
import activityService from '../../../services/activity.service.js';

class RecentActivitiesTool extends BaseTool {
  constructor() {
    super({
      name: 'get_recent_activities',
      description: 'Get paginated activity timeline logs for the authenticated user.',
      category: 'activity',
      parameters: {
        type: 'OBJECT',
        properties: {
          page: { type: 'INTEGER', description: 'Page number' },
          limit: { type: 'INTEGER', description: 'Number of results to return per page' },
        },
      },
    });

    this.schema = z.object({
      page: z.coerce.number().int().positive().optional().default(1),
      limit: z.coerce.number().int().positive().optional().default(20),
    });
  }

  async run(input, user, metadata) {
    return await activityService.getActivities(user._id, input.page, input.limit);
  }
}

export default new RecentActivitiesTool();
