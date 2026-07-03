import BaseTool from '../base.tool.js';
import analyticsService from '../../../services/analytics.service.js';

class MonthlySummaryTool extends BaseTool {
  constructor() {
    super({
      name: 'get_monthly_summary',
      description: 'Get monthly task creation and completion trend metrics along with focus session hours.',
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
      monthly: overview.monthly,
      monthlyTrend: overview.monthlyTrend,
      focusHoursThisMonth: overview.focus?.hoursThisMonth || 0,
      sessionsCompleted: overview.focus?.sessionsCompleted || 0,
    };
  }
}

export default new MonthlySummaryTool();
