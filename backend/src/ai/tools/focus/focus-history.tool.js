import BaseTool from '../base.tool.js';
import focusService from '../../../services/focus.service.js';

class FocusHistoryTool extends BaseTool {
  constructor() {
    super({
      name: 'get_focus_history',
      description: 'Retrieve history of the users completed and cancelled focus sessions.',
      category: 'focus',
      parameters: {
        type: 'OBJECT',
        properties: {},
      },
    });
  }

  async run(input, user, metadata) {
    return await focusService.getSessionHistory(user._id);
  }
}

export default new FocusHistoryTool();
