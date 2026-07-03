import BaseTool from '../base.tool.js';
import analyticsService from '../../../services/analytics.service.js';

class WeeklySummaryTool extends BaseTool {
  constructor() {
    super({
      name: 'get_weekly_summary',
      description: 'Get weekly task creation and completion trend metrics along with focus session hours.',
      category: 'analytics',
      parameters: {
        type: 'OBJECT',
        properties: {},
      },
    });
  }

  async run(input, user, metadata) {
    const overview = await analyticsService.getOverview(user._id);
    return {
      weekly: overview.weekly,
      weeklyTrend: overview.weeklyTrend,
      focusHoursThisWeek: overview.focus?.hoursThisWeek || 0,
      sessionsCompleted: overview.focus?.sessionsCompleted || 0,
    };
  }
}

export default new WeeklySummaryTool();
