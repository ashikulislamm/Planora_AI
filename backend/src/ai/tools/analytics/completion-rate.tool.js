import BaseTool from '../base.tool.js';
import analyticsService from '../../../services/analytics.service.js';

class CompletionRateTool extends BaseTool {
  constructor() {
    super({
      name: 'get_completion_rate',
      description: 'Get task and subtask completion rates and progress statistics for the user.',
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
      completionRate: overview.completionRate,
      subtaskCompletionRate: overview.subtaskCompletionRate,
      averageTaskProgress: overview.averageTaskProgress,
      totalTasks: overview.totalTasks,
      completedTasks: overview.completedTasks,
      totalSubtasks: overview.totalSubtasks,
      completedSubtasks: overview.completedSubtasks,
    };
  }
}

export default new CompletionRateTool();
