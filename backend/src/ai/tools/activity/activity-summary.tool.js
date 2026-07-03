import BaseTool from '../base.tool.js';

class ActivitySummaryTool extends BaseTool {
  constructor() {
    super({
      name: 'get_activity_summary',
      description: 'Get a clean, textual overview summarizing the users recent accomplishments and modifications.',
      category: 'activity',
      parameters: {
        type: 'OBJECT',
        properties: {},
      },
    });
  }

  async run(input, user, metadata) {
    return {
      message: 'Activity summary generation feature is not implemented in this phase.',
      summary: '',
    };
  }
}

export default new ActivitySummaryTool();
