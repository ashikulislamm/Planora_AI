import BaseTool from '../base.tool.js';
import focusService from '../../../services/focus.service.js';

class ActiveSessionTool extends BaseTool {
  constructor() {
    super({
      name: 'get_active_focus_session',
      description: 'Get the details of the users current active focus session, if one exists.',
      category: 'focus',
      parameters: {
        type: 'OBJECT',
        properties: {},
      },
    });
  }

  async run(input, user, metadata) {
    const session = await focusService.getCurrentSession(user._id);
    if (!session) {
      return {
        hasActiveSession: false,
        session: null,
      };
    }
    return {
      hasActiveSession: true,
      session,
    };
  }
}

export default new ActiveSessionTool();
