import BaseTool from '../base.tool.js';
import analyticsService from '../../../services/analytics.service.js';

class AnalyticsDashboardTool extends BaseTool {
  constructor() {
    super({
      name: 'get_analytics_dashboard',
      description: 'Get comprehensive task completions, priority and category distributions, and focus session stats.',
      category: 'analytics',
      parameters: {
        type: 'OBJECT',
        properties: {},
      },
    });
  }

  async run(input, user, metadata) {
    return await analyticsService.getOverview(user._id);
  }
}

export default new AnalyticsDashboardTool();
